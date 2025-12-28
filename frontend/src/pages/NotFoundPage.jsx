import React from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { Home, ArrowBack, Forum } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = ({ mode }) => {
    const navigate = useNavigate();
    const isDark = mode === 'dark';

    // Animation Variants
    const containerVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } }
    };

    const glitchAnim = {
        textShadow: isDark 
            ? ["2px 0 #2196f3, -2px 0 #00e5ff", "-2px 0 #2196f3, 2px 0 #00e5ff", "2px 0 #2196f3, -2px 0 #00e5ff"]
            : ["2px 0 #1565c0, -2px 0 #2196f3", "-2px 0 #1565c0, 2px 0 #2196f3", "2px 0 #1565c0, -2px 0 #2196f3"],
        transition: { repeat: Infinity, duration: 2 }
    };

    return (
        <Box sx={{
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDark ? '#0a192f' : '#f8fafc',
            color: isDark ? 'white' : '#1e293b',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Circles */}
            <Box sx={{
                position: 'absolute', width: '40vw', height: '40vw',
                borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
                background: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                top: '-10%', right: '-10%'
            }} />

            <Container component={motion.div} variants={containerVariants} initial="initial" animate="animate" maxWidth="sm" sx={{ textAlign: 'center', zIndex: 1 }}>
                
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                    <Forum sx={{ fontSize: 100, color: '#3b82f6', mb: 2, opacity: 0.8 }} />
                </motion.div>

                <Typography variant="h1" component={motion.h1} animate={glitchAnim}
                    sx={{ 
                        fontSize: { xs: '6rem', md: '10rem' }, 
                        fontWeight: 900, 
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                    404
                </Typography>

                <Typography variant="h4" fontWeight={800} sx={{ mt: 2, mb: 1, letterSpacing: '-0.02em' }}>
                    Lost in Space?
                </Typography>

                <Typography variant="body1" sx={{ opacity: 0.7, mb: 5 }}>
                    The page you are looking for has vanished into the void. 
                    Let's get you back to the conversation.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="contained"
                        startIcon={<Home />}
                        onClick={() => navigate('/')}
                        sx={{
                            bgcolor: '#3b82f6',
                            borderRadius: 3,
                            px: 4, py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                            '&:hover': { bgcolor: '#2563eb' }
                        }}
                    >
                        Back Home
                    </Button>

                    <Button
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        sx={{
                            borderRadius: 3,
                            px: 4, py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                            color: 'inherit',
                            '&:hover': { borderColor: '#3b82f6', bgcolor: 'transparent' }
                        }}
                    >
                        Go Back
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default NotFoundPage;