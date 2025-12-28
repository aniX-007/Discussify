import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  useScrollTrigger,
} from "@mui/material";
import {
  Forum,
  Menu as MenuIcon,
  Person2Outlined,
  Login,
  Close,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ mode, onModeChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  useEffect(() => {
    setScrolled(trigger);
  }, [trigger]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Forum sx={{ mr: 1.5, fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Discussify
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mx: 2 }} />

      <List sx={{ px: 2, pt: 3 }}>
        {/* Theme Toggle in Mobile */}
        <ListItem sx={{ mb: 2, p: 0, justifyContent: "center" }}>
          <Button
            onClick={onModeChange}
            startIcon={mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            sx={{
              color: "white",
              borderColor: "white",
              borderWidth: 2,
              fontWeight: 700,
              py: 1.2,
              borderRadius: 3,
              fontSize: "0.95rem",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </ListItem>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 2 }} />

        <ListItem sx={{ mb: 2, p: 0 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Person2Outlined />}
            sx={{
              bgcolor: "white",
              color: "#3b82f6",
              fontWeight: 700,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "#f8fafc",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              navigate("/register");
              setMobileOpen(false);
            }}
          >
            Sign Up
          </Button>
        </ListItem>

        <ListItem sx={{ p: 0 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Login />}
            sx={{
              borderColor: "white",
              color: "white",
              fontWeight: 700,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              navigate("/login");
              setMobileOpen(false);
            }}
          >
            Log In
          </Button>
        </ListItem>
      </List>

      <Box sx={{ position: "absolute", bottom: 20, left: 0, right: 0, px: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            display: "block",
          }}
        >
          © 2024 Discussify. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 8 : 2}
        sx={{
          background: scrolled
            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottomLeftRadius: scrolled ? 0 : 16,
          borderBottomRightRadius: scrolled ? 0 : 16,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(59, 130, 246, 0.3)"
            : "0 4px 16px rgba(59, 130, 246, 0.2)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: { xs: 1.5, md: 1.5 }, minHeight: { xs: 64, md: 72 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="start"
              sx={{
                display: { md: "none" },
                mr: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Forum sx={{ fontSize: { xs: 32, md: 40 }, mr: 1.5 }} />
                </motion.div>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    flexShrink: 0,
                    fontSize: { xs: "1.3rem", md: "1.7rem" },
                    letterSpacing: "-0.02em",
                  }}
                >
                  Discussify
                </Typography>
              </Box>
            </motion.div>

            <Box sx={{ flexGrow: 1 }} />

            {/* Theme Toggle & Auth Buttons (Desktop) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Theme Toggle Button */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={onModeChange}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<Person2Outlined />}
                  sx={{
                    bgcolor: "white",
                    color: "#3b82f6",
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: 3,
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<Login />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: 3,
                    fontSize: "0.95rem",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      bgcolor: "rgba(255,255,255,0.15)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
              </motion.div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer with Animation */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          },
        }}
        SlideProps={{
          timeout: { enter: 300, exit: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Overlay when drawer is open */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1199,
              display: mobileOpen ? "block" : "none",
            }}
            onClick={handleDrawerToggle}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;