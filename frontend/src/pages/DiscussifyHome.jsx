import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Avatar,
  Paper,
  IconButton,
  CssBaseline,
  ThemeProvider,
  Chip,
} from "@mui/material";
import {
  Groups,
  VerifiedUser,
  TrendingUp,
  Security,
  RocketLaunch,
  Chat,
  AutoGraph,
  ArrowForward,
  Person,
} from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Sample communities with images
const SAMPLE_COMMUNITIES = [
  {
    name: "Tech Innovators",
    description: "Exploring cutting-edge technology and innovation",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    members: 2450,
    category: "Technology"
  },
  {
    name: "Design Masters",
    description: "Where creativity meets functionality",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
    members: 1820,
    category: "Design"
  },
  {
    name: "Business Leaders",
    description: "Strategic insights for modern entrepreneurs",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    members: 3200,
    category: "Business"
  },
  {
    name: "Creative Writers",
    description: "Share stories, get feedback, grow together",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    members: 1560,
    category: "Writing"
  },
  {
    name: "Fitness Warriors",
    description: "Transform your body and mind",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    members: 2890,
    category: "Health"
  },
  {
    name: "Photography Hub",
    description: "Capture moments, share perspectives",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    members: 2120,
    category: "Photography"
  },
];

const DiscussifyHome = ({ mode }) => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#60a5fa" : "#3b82f6" },
          background: {
            default: mode === "dark" ? "#020617" : "#f8fafc",
            paper: mode === "dark" ? "#0f172a" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f1f5f9" : "#0f172a",
            secondary: mode === "dark" ? "#94a3b8" : "#64748b",
          },
        },
        typography: {
          fontFamily: "'Onest', 'Plus Jakarta Sans', sans-serif",
          h1: { fontWeight: 900, letterSpacing: "-0.02em" },
          h3: { fontWeight: 800, letterSpacing: "-0.01em" },
        },
        shape: { borderRadius: 16 },
      }),
    [mode]
  );

  // Backend call unchanged
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/v1/communities/popular")
      .then((res) => {
        const data = res.data.data || [];
        setCommunities(data.length > 0 ? data : SAMPLE_COMMUNITIES);
      })
      .catch(() => setCommunities(SAMPLE_COMMUNITIES));
  }, []);

  // Auto-scroll with pause on hover
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isScrolling) return;

    let animationFrame;
    const scroll = () => {
      if (el && isScrolling) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [isScrolling]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* HERO */}
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: mode === "dark"
            ? "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #dbeafe 100%)",
        }}
      >
        {/* Animated orbs */}
        <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.4 }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-5%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </Box>

        <Container sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Chip
              label="🚀 Trusted by 10,000+ communities"
              sx={{
                mb: 3,
                bgcolor: mode === "dark" ? "rgba(96, 165, 250, 0.15)" : "rgba(59, 130, 246, 0.1)",
                color: "primary.main",
                border: "1px solid",
                borderColor: mode === "dark" ? "rgba(96, 165, 250, 0.3)" : "rgba(59, 130, 246, 0.2)",
                fontWeight: 600,
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem" },
                background: mode === "dark"
                  ? "linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)"
                  : "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              Build Communities.
              <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Grow Together.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 3,
                mb: 5,
                maxWidth: 600,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                color: "text.secondary",
              }}
            >
              A modern platform to create, manage and grow meaningful communities. Connect with
              like-minded individuals.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(59, 130, 246, 0.5)",
                  },
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.3)",
                  color: "text.primary",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "primary.main",
                    bgcolor: mode === "dark" ? "rgba(96, 165, 250, 0.1)" : "rgba(59, 130, 246, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Explore
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* POPULAR COMMUNITIES */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Section>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 1,
              background: mode === "dark"
                ? "linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)"
                : "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Popular Communities
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 5, fontSize: "1.1rem" }}>
            Discover active spaces across different interests
          </Typography>
        </Section>

        <Box
          ref={scrollRef}
          onMouseEnter={() => setIsScrolling(false)}
          onMouseLeave={() => setIsScrolling(true)}
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": {
              bgcolor: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.2)",
              borderRadius: "3px",
              "&:hover": { bgcolor: "primary.main" },
            },
          }}
        >
          {[...communities, ...communities].map((item, i) => (
            <CommunityCard
              key={i}
              item={item}
              isHovered={hoveredCard === i}
              onHover={() => setHoveredCard(i)}
              onLeave={() => setHoveredCard(null)}
              mode={mode}
            />
          ))}
        </Box>
      </Container>

      {/* HOW IT WORKS & FEATURES - Compact */}
      <Box sx={{ bgcolor: mode === "dark" ? "rgba(15, 23, 42, 0.4)" : "rgba(248, 250, 252, 0.8)", py: { xs: 6, md: 10 } }}>
        <Container>
          <Section>
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 6,
                fontSize: { xs: "2rem", md: "2.5rem" },
                background: mode === "dark"
                  ? "linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)"
                  : "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              How It Works
            </Typography>

            <Grid container spacing={3} sx={{ mb: 8 }}>
              <InfoCard icon={<Groups />} title="Create Community" mode={mode} />
              <InfoCard icon={<Chat />} title="Start Discussions" mode={mode} />
              <InfoCard icon={<AutoGraph />} title="Grow Engagement" mode={mode} />
            </Grid>

            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 6,
                mt: 8,
                fontSize: { xs: "2rem", md: "2.5rem" },
                background: mode === "dark"
                  ? "linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)"
                  : "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose Discussify
            </Typography>

            <Grid container spacing={3}>
              <InfoCard icon={<VerifiedUser />} title="Trusted Members" mode={mode} />
              <InfoCard icon={<TrendingUp />} title="Analytics Driven" mode={mode} />
              <InfoCard icon={<Security />} title="Safe & Moderated" mode={mode} />
              <InfoCard icon={<RocketLaunch />} title="Built for Scale" mode={mode} />
            </Grid>
          </Section>
        </Container>
      </Box>

      {/* CTA */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            sx={{
              p: { xs: 6, md: 8 },
              textAlign: "center",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)",
            }}
          >
            <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2.5rem" } }}>
              Start Building Your Community
            </Typography>
            <Typography sx={{ mb: 4, opacity: 0.95, fontSize: "1.1rem" }}>
              Bring people together around ideas that matter.
            </Typography>
            <Button
              size="large"
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "white",
                color: "#0f172a",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Create Community
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

// Community Card Component
const CommunityCard = ({ item, isHovered, onHover, onLeave, mode }) => (
  <motion.div
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    whileHover={{ scale: 1.05, y: -12, zIndex: 10 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{ minWidth: 320, flexShrink: 0 }}
  >
    <Paper
      elevation={isHovered ? 20 : 6}
      sx={{
        height: 280,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 3,
        border: "1px solid",
        borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
        boxShadow: isHovered
          ? "0 32px 64px rgba(59, 130, 246, 0.4)"
          : mode === "dark"
          ? "0 8px 24px rgba(0, 0, 0, 0.3)"
          : "0 8px 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Image */}
      <motion.div
        animate={{ scale: isHovered ? 1.15 : 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${item.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(to top, rgba(2,6,23,0.95), rgba(2,6,23,0.3))"
            : "linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.4))",
          transition: "background 0.4s",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Top */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={item.category || "Community"}
            size="small"
            sx={{
              bgcolor: "rgba(59, 130, 246, 0.2)",
              color: "#60a5fa",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              fontSize: "0.75rem",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }}
          />
          <Chip
            icon={<Person sx={{ fontSize: 14 }} />}
            label={`${item.members || Math.floor(Math.random() * 3000) + 500}`}
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.15)",
              color: "white",
              backdropFilter: "blur(10px)",
              fontSize: "0.75rem",
            }}
          />
        </Box>

        {/* Bottom */}
        <motion.div animate={{ y: isHovered ? 0 : 10 }} transition={{ duration: 0.3 }}>
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1.3rem", mb: 1 }}>
            {item.name}
          </Typography>
          <Typography sx={{ color: "#cbd5e1", fontSize: "0.9rem", mb: 2 }}>
            {item.description}
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          >
            <Button
              size="small"
              variant="contained"
              endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: "white",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "0.8rem",
                "&:hover": { bgcolor: "#f1f5f9", transform: "translateX(4px)" },
              }}
            >
              Join Now
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </Paper>
  </motion.div>
);

// Info Card Component
const InfoCard = ({ icon, title, mode }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={3}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -6, scale: 1.02 }}
      >
        <Paper
          elevation={hovered ? 12 : 3}
          sx={{
            p: 3,
            textAlign: "center",
            border: "1px solid",
            borderColor: hovered ? "primary.main" : mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
            bgcolor: hovered
              ? mode === "dark"
                ? "rgba(96, 165, 250, 0.08)"
                : "rgba(59, 130, 246, 0.05)"
              : "transparent",
          }}
        >
          <motion.div animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
            <Avatar
              sx={{
                bgcolor: hovered ? "primary.main" : mode === "dark" ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.15)",
                mx: "auto",
                mb: 2,
                width: 56,
                height: 56,
                color: hovered ? "white" : "primary.main",
              }}
            >
              {icon}
            </Avatar>
          </motion.div>
          <Typography fontWeight={700} color={hovered ? "primary.main" : "text.primary"}>
            {title}
          </Typography>
        </Paper>
      </motion.div>
    </Grid>
  );
};

// Section wrapper with scroll animation
const Section = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.div>
  );
};

export default DiscussifyHome;