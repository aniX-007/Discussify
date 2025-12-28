import React, { useState } from 'react';
import {
    Container, Box, Typography, TextField, Button, Grid, Paper, InputAdornment, CircularProgress,
    Link, Snackbar, Alert, IconButton, useTheme
} from '@mui/material';
import { Email, Lock, Login, Forum, Send, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// API Endpoints
const LOGIN_API_URL = 'http://localhost:3001/api/v1/auth/login';
const FORGOT_PASSWORD_INIT_API = 'http://localhost:3001/api/v1/auth/forgot-password';
const FORGOT_PASSWORD_RESET_API = 'http://localhost:3001/api/v1/auth/reset-password';

// Dynamic theme creator
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
            default: mode === 'dark' ? '#0f172a' : '#f1f5f9',
            paper: mode === 'dark' ? '#334155' : '#ffffff',
        },
        text: {
            primary: mode === 'dark' ? '#e2e8f0' : '#0f172a',
            secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
        },
    },
    typography: {
        fontFamily: "'Onest', 'Plus Jakarta Sans', sans-serif",
        h4: { fontWeight: 800, letterSpacing: '-0.02em' },
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
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                    },
                },
            },
        },
    },
});

// Reset Password View
const ResetPasswordView = ({ emailOrIdentifier, setCurrentView, showToast, mode }) => {
    const [formData, setFormData] = useState({ otp: '', newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        let tempErrors = {};
        if (formData.otp.length !== 6 || isNaN(formData.otp)) tempErrors.otp = "OTP must be 6 digits";
        if (formData.newPassword.length < 6) tempErrors.newPassword = "Min 6 characters";
        if (formData.newPassword !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords don't match";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            showToast("Please fix validation errors", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(FORGOT_PASSWORD_RESET_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailOrIdentifier, otp: formData.otp, newPassword: formData.newPassword }),
            });
            const result = await response.json();
            if (response.ok) {
                showToast(result.message || "Password reset successful!", "success");
                setTimeout(() => setCurrentView('login'), 2500);
            } else {
                showToast(result.message || "Reset failed", "error");
                setFormData(prev => ({ ...prev, otp: '' }));
            }
        } catch (error) {
            showToast("Connection error", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => setCurrentView('login')} disabled={isLoading} sx={{ color: 'primary.main' }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" color="primary" sx={{ ml: 1 }}>Reset Password</Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter the 6-digit code sent to <strong>{emailOrIdentifier}</strong>
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        required
                        fullWidth
                        label="6-Digit Code"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        inputProps={{ maxLength: 6 }}
                        error={!!errors.otp}
                        helperText={errors.otp || "Check your email"}
                        disabled={isLoading}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: mode === 'dark' ? '#94a3b8' : 'action.active' }} /></InputAdornment> }}
                    />
                    
                    <TextField
                        required
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword || "Min 6 characters"}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Lock sx={{ color: mode === 'dark' ? '#94a3b8' : 'action.active' }} /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        required
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Lock sx={{ color: mode === 'dark' ? '#94a3b8' : 'action.active' }} /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 2, 
                                py: 1.8, 
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                                }
                            }}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Login />}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </motion.div>
                </Box>
            </Box>
        </motion.div>
    );
};

// Forgot Password View
const ForgotPasswordView = ({ setCurrentView, setEmailOrIdentifier, showToast, mode }) => {
    const [identifier, setIdentifier] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setIdentifier(e.target.value);
        if (errors.identifier) setErrors({});
    };

    const validate = () => {
        let tempErrors = {};
        if (!identifier || !/\S+@\S+\.\S+/.test(identifier)) tempErrors.identifier = "Valid email required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            showToast("Enter valid email", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(FORGOT_PASSWORD_INIT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: identifier }),
            });
            const result = await response.json();
            if (response.ok) {
                showToast(result.message || "Code sent!", "success");
                setEmailOrIdentifier(identifier);
                setTimeout(() => setCurrentView('reset-password'), 2500);
            } else {
                showToast(result.message || "Failed to send code", "error");
            }
        } catch (error) {
            showToast("Connection error", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => setCurrentView('login')} disabled={isLoading} sx={{ color: 'primary.main' }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" color="primary" sx={{ ml: 1 }}>Recover Account</Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter your email to receive a reset code
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="identifier"
                        value={identifier}
                        onChange={handleChange}
                        error={!!errors.identifier}
                        helperText={errors.identifier || "We'll send the OTP here"}
                        disabled={isLoading}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: mode === 'dark' ? '#94a3b8' : 'action.active' }} /></InputAdornment> }}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 2, 
                                py: 1.8,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                                }
                            }}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Code'}
                        </Button>
                    </motion.div>
                </Box>
            </Box>
        </motion.div>
    );
};

// Login View
const LoginView = ({ setCurrentView, showToast, mode }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = "Email required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email";
        if (!formData.password) tempErrors.password = "Password required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            showToast("Check your credentials", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok && result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.user.role);
                showToast("Login successful!", "success");
                setTimeout(() => navigate(result.user.role === 'admin' ? '/admin' : '/user'), 1500);
            } else {
                showToast(result.message || 'Login failed', "error");
            }
        } catch (error) {
            showToast("Connection error", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <Forum color="primary" sx={{ fontSize: 60, mb: 2 }} />
                    </motion.div>
                    <Typography variant="h4" color="primary" gutterBottom>Welcome Back</Typography>
                    <Typography variant="body2" color="text.secondary">Sign in to continue your discussion</Typography>
                </Box>
            
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isLoading}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: mode === 'dark' ? '#94a3b8' : 'action.active' }} /></InputAdornment> }}
                    />

                    <TextField
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Lock sx={{ color: mode === 'dark' ? '#94a3b8' : 'action.active' }} /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 1, 
                                py: 1.8,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                                }
                            }}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Login />}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging In...' : 'Log In'}
                        </Button>
                    </motion.div>
                </Box>

                <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                    <Grid item>
                        <Button
                            onClick={() => setCurrentView('forgot-password')}
                            sx={{ p: 0, textTransform: 'none', fontWeight: 600 }}
                            disabled={isLoading}
                        >
                            Forgot password?
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="text.secondary">
                            New user?
                            <Link
                                onClick={() => navigate('/register')}
                                sx={{ ml: 0.5, textDecoration: 'none', cursor: 'pointer', fontWeight: 600, color: 'primary.main' }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
};

// Main Component
const LoginPage = ({ mode, onModeChange }) => {
    const [currentView, setCurrentView] = useState('login');
    const [emailOrIdentifier, setEmailOrIdentifier] = useState('');
    const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

    const showToast = (message, severity) => setToast({ open: true, message, severity });
    const handleToastClose = () => setToast(prev => ({ ...prev, open: false }));

    const theme = getTheme(mode);

    const renderView = () => {
        switch (currentView) {
            case 'login':
                return <LoginView setCurrentView={setCurrentView} showToast={showToast} mode={mode} />;
            case 'forgot-password':
                return <ForgotPasswordView setCurrentView={setCurrentView} setEmailOrIdentifier={setEmailOrIdentifier} showToast={showToast} mode={mode} />;
            case 'reset-password':
                if (!emailOrIdentifier) {
                    setCurrentView('forgot-password');
                    return <ForgotPasswordView setCurrentView={setCurrentView} setEmailOrIdentifier={setEmailOrIdentifier} showToast={showToast} mode={mode} />;
                }
                return <ResetPasswordView setCurrentView={setCurrentView} emailOrIdentifier={emailOrIdentifier} showToast={showToast} mode={mode} />;
            default:
                return <LoginView setCurrentView={setCurrentView} showToast={showToast} mode={mode} />;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: mode === 'dark' 
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                    : 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated background orbs */}
                <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.4 }}>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: "-10%",
                            right: "-5%",
                            width: "400px",
                            height: "400px",
                            borderRadius: "50%",
                            background: mode === 'dark' 
                                ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
                                : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            bottom: "-10%",
                            left: "-5%",
                            width: "350px",
                            height: "350px",
                            borderRadius: "50%",
                            background: mode === 'dark'
                                ? "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)"
                                : "radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />
                </Box>

                <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={mode === 'dark' ? 8 : 4}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 4,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: mode === 'dark' ? 'rgba(203, 213, 225, 0.2)' : 'rgba(0,0,0,0.08)',
                                boxShadow: mode === 'dark' 
                                    ? '0 20px 60px rgba(96, 165, 250, 0.15)' 
                                    : '0 20px 60px rgba(59, 130, 246, 0.15)',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {renderView()}
                            </AnimatePresence>
                        </Paper>
                    </motion.div>
                </Container>

                <Snackbar 
                    open={toast.open} 
                    autoHideDuration={5000} 
                    onClose={handleToastClose} 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
                        {toast.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default LoginPage;