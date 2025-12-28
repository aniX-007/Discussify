import React, { useState, useCallback, useEffect } from 'react';
import {
    Container, Box, Typography, TextField, Button, Grid, Avatar, Paper, IconButton,
    InputAdornment, Link, Snackbar, Alert, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Stack
} from '@mui/material';
import { 
    AccountCircle, Email, Lock, Description, CloudUpload, CameraAlt, Forum, 
    VpnKey, ContentCopy, Favorite, CheckCircle 
} from '@mui/icons-material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Global Constants (Unchanged) ---
const MAX_BIO_LENGTH = 200;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const REGISTER_API_URL = 'http://localhost:3001/api/v1/auth/register';
const VERIFY_API_URL = 'http://localhost:3001/api/v1/auth/verify-email';
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_ ]{3,20}$/; 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COMMUNITY_CATEGORIES = [
    'Technology', 'Gaming', 'Sports', 'Music', 'Art', 'Education',
    'Science', 'Business', 'Health', 'Food', 'Travel', 'Fashion',
    'Entertainment', 'Books', 'Photography', 'Other'
];

// Enhanced theme with dynamic mode support
const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: { 
            main: mode === 'dark' ? '#60a5fa' : '#3b82f6',
            light: mode === 'dark' ? '#93c5fd' : '#60a5fa',
            dark: mode === 'dark' ? '#3b82f6' : '#2563eb',
        },
        secondary: { 
            main: mode === 'dark' ? '#f59e0b' : '#f97316',
        },
        background: {
            default: mode === 'dark' ? '#020617' : '#f8fafc',
            paper: mode === 'dark' ? '#0f172a' : '#ffffff',
        },
        text: {
            primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
            secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
        },
    },
    typography: {
        fontFamily: "'Onest', 'Plus Jakarta Sans', sans-serif",
        h5: { fontWeight: 800, letterSpacing: '-0.01em' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
    },
});

const initialRegistrationData = {
    username: '',
    email: '',
    password: '',
    bio: '',
    interests: [],
    profileImage: null,
    profileImagePreview: null,
};

// --- Email Verification Component ---
const EmailVerificationPage = ({ onNavigate, registeredEmail, capturedOTP, mode }) => {
    const [formData, setFormData] = useState({ 
        email: registeredEmail || '', 
        otp: '' 
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const showToast = (message, severity) => setToast({ open: true, message, severity });
    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        if (!registeredEmail || !capturedOTP) {
            showToast("Verification link expired or registration incomplete. Please register again.", "error");
        }
    }, [registeredEmail, capturedOTP]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
            tempErrors.email = 'Valid email is required.';
            isValid = false;
        }
        if (!formData.otp || formData.otp.length !== 6 || isNaN(formData.otp)) {
            tempErrors.otp = 'OTP must be a 6-digit number.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            showToast("Please check the fields and try again.", "error");
            return;
        }
        
        if (!capturedOTP) {
            showToast("OTP missing from registration context. Cannot verify.", "error");
            return;
        }

        setLoading(true);

        let success = false;
        let finalMessage = "Verification failed due to an unknown error.";

        try {
            const response = await fetch(VERIFY_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                success = true;
                finalMessage = "Email verified successfully! Redirecting to login...";
            } else {
                finalMessage = result.message || `Verification failed: ${response.statusText}`;
            }

        } catch (error) {
            finalMessage = `Network error: Could not connect to the server.`;
            console.error("Verification Network Error:", error);
        } finally {
            setLoading(false);
            showToast(finalMessage, success ? "success" : "error");

            if (success) {
                setTimeout(() => {
                    onNavigate('login');
                }, 2000);
            }
        }
    };

    return (
        <Container 
            component="main" 
            maxWidth="sm" 
            sx={{ 
                py: { xs: 2, sm: 4, md: 6 }, 
                px: { xs: 2, sm: 3 },
                minHeight: "100vh", 
                display: "flex", 
                alignItems: "center",
                background: mode === 'dark' 
                    ? 'linear-gradient(135deg, #020617 0%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%' }}
            >
                <Paper elevation={8} sx={{ 
                    p: { xs: 3, sm: 4, md: 6 }, 
                    borderRadius: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    boxShadow: mode === 'dark' 
                        ? '0 20px 60px rgba(96, 165, 250, 0.15)' 
                        : '0 20px 60px rgba(59, 130, 246, 0.15)',
                    bgcolor: 'background.paper',
                }}>
                    <Box textAlign="center" mb={{ xs: 3, md: 4 }}>
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        >
                            <VpnKey color="primary" sx={{ fontSize: { xs: 50, sm: 60, md: 60 }, mb: { xs: 1.5, md: 2 } }} />
                        </motion.div>
                        <Typography 
                            variant="h5" 
                            fontWeight={800} 
                            mb={1}
                            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                        >
                            Verify Your Email
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}
                        >
                            Enter the 6-digit OTP sent to your email
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                            <TextField
                                fullWidth
                                required
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading || registeredEmail}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start"><Email color="primary" /></InputAdornment>),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                            <TextField
                                fullWidth
                                required
                                label="Verification Code (OTP)"
                                name="otp"
                                type="text"
                                inputProps={{ maxLength: 6 }}
                                value={formData.otp}
                                onChange={handleChange}
                                error={!!errors.otp}
                                helperText={errors.otp || "Enter the 6-digit code"}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start"><Lock color="primary" /></InputAdornment>),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                    }
                                }}
                            />
                        </Box>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: { xs: 1.5, sm: 2 }, 
                                    py: { xs: 1.5, sm: 1.8 }, 
                                    borderRadius: 3,
                                    fontSize: { xs: '0.95rem', sm: '1rem' },
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                                    }
                                }}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                                disabled={loading || !capturedOTP}
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </Button>
                        </motion.div>
                    </Box>
                </Paper>
            </motion.div>

            <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleToastClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

// --- Registration Component ---
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            borderRadius: '12px',
        },
    },
};

const RegistrationPage = ({ onNavigate, onRegistrationSuccess, mode }) => {
    const [formData, setFormData] = useState(initialRegistrationData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const showToast = (message, severity) => setToast({ open: true, message, severity });
    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    const handleDeleteInterest = (chipToDelete) => (event) => {
        event.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.filter((interest) => interest !== chipToDelete),
        }));
    };

    const validateField = useCallback((name, value) => {
        let error = null;
        switch (name) {
            case 'username':
                if (!value) error = "Username is required.";
                else if (value.length < 3 || value.length > 20) error = "Username must be between 3 and 20 characters.";
                else if (!USERNAME_REGEX.test(value)) error = "Username can only contain letters, numbers, and underscores.";
                break;
            case 'email':
                if (!value) error = "Email address is required.";
                else if (!EMAIL_REGEX.test(value)) error = "Please enter a valid email address.";
                break;
            case 'password':
                if (!value) error = "Password is required.";
                else if (value.length < 8) error = "Password must be at least 8 characters long.";
                else if (!PASSWORD_REGEX.test(value)) error = "Must include uppercase, lowercase, number, and special character.";
                break;
            case 'bio':
                if (value.length > MAX_BIO_LENGTH) error = `Bio cannot exceed ${MAX_BIO_LENGTH} characters.`;
                break;
            default: break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    
    const handleBlur = (e) => validateField(e.target.name, e.target.value);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        let tempErrors = { ...errors, profileImage: null };
        setFormData(prev => ({ ...prev, profileImage: null, profileImagePreview: null }));

        if (file) {
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                tempErrors.profileImage = `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB.`;
            } else {
                const acceptedTypes = ['image/jpeg', 'image/png'];
                if (!acceptedTypes.includes(file.type)) {
                    tempErrors.profileImage = `Only JPEG and PNG images are accepted.`;
                } else {
                    const previewURL = URL.createObjectURL(file);
                    setFormData(prev => ({ ...prev, profileImage: file, profileImagePreview: previewURL }));
                }
            }
        } 
        setErrors(tempErrors);
    };

    const validate = () => {
        const fieldsToValidate = ['username', 'email', 'password', 'bio'];
        let isValid = true;
        fieldsToValidate.forEach(field => {
            if (!validateField(field, formData[field])) isValid = false;
        });
        if (errors.profileImage) isValid = false;
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            showToast("Please fix the validation errors before submitting.", "error");
            return;
        }

        setLoading(true);
        
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('bio', formData.bio);
        
        if (formData.profileImage) {
            data.append('profileImage', formData.profileImage); 
        }

        formData.interests.forEach(interest => {
            data.append('interests[]', interest);
        });

        let success = false;
        let finalMessage = "Registration failed due to an unknown error.";
        let navigateToVerification = false;

        try {
            const response = await fetch(REGISTER_API_URL, {
                method: 'POST',
                body: data, 
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const receivedOtp = result.user?.otp; 
                
                if (receivedOtp) {
                    onRegistrationSuccess(formData.email, receivedOtp);
                    finalMessage = `Registration successful! Your verification code is: ${receivedOtp}. Redirecting...`;
                    success = true;
                    navigateToVerification = true;
                } else {
                    finalMessage = "Registration successful, but OTP was not received.";
                    success = true;
                }
            } else {
                finalMessage = result.message || `Registration failed: ${response.statusText}`;
            }
        } catch (error) {
            finalMessage = `Network error: Could not connect to the server.`;
            console.error("Registration Network Error:", error);
        } finally {
            setLoading(false);
            showToast(finalMessage, success ? "success" : "error");

            if (navigateToVerification) {
                setFormData(initialRegistrationData);
                setErrors({});
                setTimeout(() => {
                    onNavigate('verify-email');
                }, 4000); 
            }
        }
    };

    // Shared input styles for consistency
    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': { borderColor: 'primary.main' },
            '&.Mui-focused fieldset': { borderWidth: 2 },
        }
    };

    // Form fields configuration for cleaner code
    const formFields = [
        { name: 'username', label: 'Username', icon: <AccountCircle color="primary" />, type: 'text', hint: '3-20 characters' },
        { name: 'email', label: 'Email Address', icon: <Email color="primary" />, type: 'email', hint: 'We\'ll send verification code here' },
        { name: 'password', label: 'Password', icon: <Lock color="primary" />, type: 'password', hint: 'Min 8 chars, upper, lower, number & special' },
    ];

    return (
        <Container 
            component="main" 
            maxWidth="sm" 
            sx={{ 
                py: { xs: 2, sm: 4, md: 6 }, 
                px: { xs: 2, sm: 3 },
                minHeight: "100vh", 
                display: "flex", 
                alignItems: "center",
                background: mode === 'dark' 
                    ? 'linear-gradient(135deg, #020617 0%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%' }}
            >
                <Paper elevation={8} sx={{ 
                    p: { xs: 3, sm: 4, md: 6 }, 
                    borderRadius: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    boxShadow: mode === 'dark' 
                        ? '0 20px 60px rgba(96, 165, 250, 0.15)' 
                        : '0 20px 60px rgba(59, 130, 246, 0.15)',
                    bgcolor: 'background.paper',
                }}>
                    {/* Header */}
                    <Box textAlign="center" mb={{ xs: 3, md: 4 }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                            <Forum color="primary" sx={{ fontSize: { xs: 50, sm: 60, md: 60 }, mb: { xs: 1.5, md: 2 } }} />
                        </motion.div>
                        <Typography 
                            variant="h5" 
                            fontWeight={800} 
                            mb={1}
                            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                        >
                            Create Your Account
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}
                        >
                            Join Discussify and connect with communities
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={{ xs: 2, sm: 2.5 }}>
                            {/* Profile Image */}
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Box sx={{ position: "relative" }}>
                                        <Avatar
                                            src={formData.profileImagePreview}
                                            sx={{ 
                                                width: { xs: 100, sm: 110 }, 
                                                height: { xs: 100, sm: 110 }, 
                                                border: "3px solid", 
                                                borderColor: errors.profileImage ? "error.main" : "primary.light",
                                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                                            }}
                                        >
                                            {!formData.profileImagePreview && <AccountCircle sx={{ fontSize: { xs: 60, sm: 70 }, color: "text.disabled" }}/>}
                                        </Avatar>
                                        <input accept="image/jpeg,image/png" id="img-upload" type="file" style={{ display: "none" }} onChange={handleImageChange} disabled={loading}/>
                                        <label htmlFor="img-upload">
                                            <IconButton 
                                                component="span" 
                                                disabled={loading} 
                                                sx={{ 
                                                    position: "absolute", 
                                                    bottom: 0, 
                                                    right: 0, 
                                                    bgcolor: "primary.main", 
                                                    color: "white", 
                                                    p: { xs: 0.8, sm: 1 },
                                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                                                    "&:hover": { bgcolor: "primary.dark", transform: 'scale(1.1)' },
                                                }}
                                            >
                                                <CameraAlt sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                            </IconButton>
                                        </label>
                                    </Box>
                                </motion.div>
                                {errors.profileImage && <Typography variant="caption" color="error" mt={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{errors.profileImage}</Typography>}
                            </Box>

                            {/* Dynamic Form Fields */}
                            {formFields.map(field => (
                                <TextField 
                                    key={field.name}
                                    fullWidth 
                                    required 
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name]} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                    error={!!errors[field.name]} 
                                    helperText={errors[field.name] || field.hint} 
                                    InputProps={{ startAdornment: <InputAdornment position="start">{field.icon}</InputAdornment> }} 
                                    disabled={loading}
                                    sx={inputStyles}
                                />
                            ))}
                            
                            {/* Interests */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Select Your Interests</InputLabel>
                                <Select
                                    multiple
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Select Your Interests" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((v) => (
                                                <Chip 
                                                    key={v} 
                                                    label={v} 
                                                    size="small"
                                                    onDelete={handleDeleteInterest(v)}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    startAdornment={<InputAdornment position="start"><Favorite color="primary" /></InputAdornment>}
                                    disabled={loading}
                                    sx={{ '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }}
                                >
                                    {COMMUNITY_CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                </Select>
                            </FormControl>
                            
                            {/* Bio */}
                            <TextField 
                                fullWidth 
                                label="Bio (Optional)" 
                                name="bio" 
                                multiline 
                                rows={3} 
                                value={formData.bio} 
                                onChange={handleChange} 
                                onBlur={handleBlur} 
                                error={!!errors.bio} 
                                helperText={errors.bio || `${formData.bio.length}/${MAX_BIO_LENGTH}`} 
                                InputProps={{ 
                                    startAdornment: <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}><Description color="primary" /></InputAdornment>
                                }} 
                                disabled={loading}
                                sx={inputStyles}
                            />
                        </Stack>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                sx={{ 
                                    mt: { xs: 3, sm: 4 }, 
                                    py: { xs: 1.5, sm: 1.8 }, 
                                    borderRadius: 3,
                                    fontSize: { xs: '0.95rem', sm: '1rem' },
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                                    }
                                }} 
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />} 
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </motion.div>

                        {/* Login Link */}
                        <Box textAlign="center" mt={{ xs: 2.5, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                                Already have an account?{' '}
                                <Link 
                                    onClick={() => onNavigate('login')} 
                                    sx={{ 
                                        cursor: "pointer", 
                                        fontWeight: 700,
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Log In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>

            <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleToastClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

// --- Main Component (Unchanged) ---
const RegistrationComponent = ({ mode = 'dark' }) => {
    const [currentPage, setCurrentPage] = useState('register');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [capturedOTP, setCapturedOTP] = useState(''); 
    const navigate = useNavigate();

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    const handleRegistrationSuccess = (email, otp) => {
        setRegisteredEmail(email);
        setCapturedOTP(otp);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'register':
                return <RegistrationPage 
                    onNavigate={handleNavigation} 
                    onRegistrationSuccess={handleRegistrationSuccess}
                    mode={mode}
                />;
            case 'verify-email':
                return <EmailVerificationPage 
                    onNavigate={handleNavigation} 
                    registeredEmail={registeredEmail}
                    capturedOTP={capturedOTP}
                    mode={mode}
                />;
            case 'login':
                navigate('/login');
                return null;
            default:
                return <RegistrationPage 
                    onNavigate={handleNavigation} 
                    onRegistrationSuccess={handleRegistrationSuccess}
                    mode={mode}
                />;
        }
    };

    return (
        <ThemeProvider theme={getTheme(mode)}>
            <CssBaseline />
            {renderPage()}
        </ThemeProvider>
    );
};

export default RegistrationComponent;