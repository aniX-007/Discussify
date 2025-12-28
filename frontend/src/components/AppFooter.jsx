import { Facebook, Forum, LinkedIn, Twitter, Instagram, GitHub, Email } from "@mui/icons-material";
import { Box, Container, Typography, Divider, IconButton, Stack } from "@mui/material";
import { motion } from "framer-motion";

const AppFooter = ({ mode }) => {
    const socialLinks = [
        { icon: <Twitter />, label: 'Twitter' },
        { icon: <Facebook />, label: 'Facebook' },
        { icon: <LinkedIn />, label: 'LinkedIn' },
        { icon: <Instagram />, label: 'Instagram' },
        { icon: <GitHub />, label: 'GitHub' },
    ];

    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: mode === 'dark' ? '#1e293b' : '#ffffff',
                borderTop: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(203, 213, 225, 0.2)' : 'rgba(0,0,0,0.08)',
                py: 6,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                {/* Logo and Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Forum sx={{ fontSize: 48, color: mode === 'dark' ? '#60a5fa' : '#3b82f6', mr: 1.5 }} />
                            </motion.div>
                            <Typography 
                                variant="h4" 
                                fontWeight={900}
                                color={mode === 'dark' ? '#e2e8f0' : 'text.primary'}
                            >
                                DISCUSSIFY
                            </Typography>
                        </Box>
                        
                        {/* About */}
                        <Typography 
                            variant="body1" 
                            color={mode === 'dark' ? '#94a3b8' : 'text.secondary'}
                            align="center"
                            sx={{ maxWidth: 600, lineHeight: 1.8, mb: 3 }}
                        >
                            A modern platform to foster meaningful conversations and build vibrant communities. 
                            Join thousands sharing ideas, solving problems, and connecting worldwide.
                        </Typography>

                        {/* Contact */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <Email sx={{ fontSize: 18, color: mode === 'dark' ? '#60a5fa' : '#3b82f6' }} />
                            <Typography variant="body2" color={mode === 'dark' ? '#94a3b8' : 'text.secondary'}>
                                hello@discussify.com
                            </Typography>
                        </Box>

                        {/* Social Media */}
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                            {socialLinks.map((social, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.15, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <IconButton
                                        aria-label={social.label}
                                        sx={{
                                            bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                            color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
                                            width: 44,
                                            height: 44,
                                            border: '1px solid',
                                            borderColor: mode === 'dark' ? 'rgba(203, 213, 225, 0.2)' : 'rgba(0,0,0,0.08)',
                                            '&:hover': {
                                                bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                                                borderColor: mode === 'dark' ? '#60a5fa' : '#3b82f6',
                                            },
                                        }}
                                    >
                                        {social.icon}
                                    </IconButton>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                </motion.div>

                {/* Divider */}
                <Divider 
                    sx={{ 
                        borderColor: mode === 'dark' ? 'rgba(203, 213, 225, 0.2)' : 'rgba(0,0,0,0.08)',
                        mb: 3,
                    }} 
                />

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Stack spacing={1} alignItems="center">
                        <Typography 
                            variant="body2" 
                            color={mode === 'dark' ? '#94a3b8' : 'text.secondary'}
                            align="center"
                        >
                            © {new Date().getFullYear()} Discussify. All rights reserved.
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            color={mode === 'dark' ? '#94a3b8' : 'text.secondary'}
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 0.5,
                            }}
                        >
                            Made with 
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                style={{ display: 'inline-flex', alignItems: 'center' }}
                            >
                                ❤️
                            </motion.span>
                            by Discussify Team
                        </Typography>
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AppFooter;