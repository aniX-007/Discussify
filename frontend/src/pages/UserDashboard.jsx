import React, { useState, useCallback, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Badge, Typography, Container, Box,
  InputBase, Paper, Grid, Card, CardContent, Avatar, Chip, Button, Drawer,
  Divider, List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, Tooltip, CircularProgress,
  Alert, Snackbar, FormControl, Select, OutlinedInput, MenuItem, InputLabel,
  useTheme, Menu, ListItemIcon, CssBaseline
} from '@mui/material';

import {
  Notifications as NotificationsIcon, Search as SearchIcon,
  Group as GroupIcon, TrendingUp as TrendingUpIcon, ThumbUp as ThumbUpIcon,
  Close as CloseIcon, Check as CheckIcon, Edit as EditIcon,
  AddCircle as AddCircleIcon, Send as SendIcon, PhotoCamera as PhotoCameraIcon,
  Info, Interests, Visibility, Share, Logout, ExitToApp,
  Home, Brightness4, Brightness7, Person, Forum, MoreVert
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';

import {
  getUserProfile, updateUserProfile, getMyCommunities, getPopularCommunities,
  getRecommendedCommunities, createCommunity as createCommunityAPI,
  joinCommunity as joinCommunityAPI, getUserNotifications,
  deleteNotification, inviteMember as inviteMemberAPI,
  clearAllNotifications, leaveCommunity
} from '../services/api.js';

import CommunityPage from '../pages/CommunityPage.jsx';

export default function UserDashboard({ mode, onModeChange }) {
  const [view, setView] = useState('dashboard');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [profileMenu, setProfileMenu] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const [inviteMemberDialog, setInviteMemberDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [communityToInvite, setCommunityToInvite] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [myCommunities, setMyCommunities] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newCommunityData, setNewCommunityData] = useState({ name: '', categories: [], description: '', coverImage: null, coverFile: null });
  const [creatingCommunity, setCreatingCommunity] = useState(false);

  const AVAILABLE_INTERESTS = ['Technology', 'Gaming', 'Sports', 'Music', 'Art', 'Education', 'Science', 'Business', 'Health', 'Food', 'Travel', 'Fashion', 'Entertainment', 'Books', 'Photography', 'Other'];
  const BASE_URL = 'http://localhost:3001';

  // --- THEME ENGINE ---
  const isDark = mode === 'dark';
  const colors = {
    bg: isDark ? '#0f172a' : '#f8fafc', // Slate 900
    card: isDark ? '#1e293b' : '#ffffff', // Slate 800
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    textMain: isDark ? '#f1f5f9' : '#1e293b', // Slate 100 vs Slate 800 (Avoid Pure Black)
    textSec: isDark ? '#94a3b8' : '#64748b', // Slate 400
    primary: isDark ? '#60a5fa' : '#2563eb',
    inputBg: isDark ? '#334155' : '#f1f5f9'
  };

  // Shared SX for Inputs to ensure Text is NOT Black in Dark Mode
  const commonInputSx = {
    '& .MuiInputLabel-root': { color: colors.textSec },
    '& .MuiInputLabel-root.Mui-focused': { color: colors.primary },
    '& .MuiOutlinedInput-root': {
        color: colors.textMain,
        bgcolor: colors.inputBg,
        '& fieldset': { borderColor: colors.border },
        '&:hover fieldset': { borderColor: colors.primary },
        '&.Mui-focused fieldset': { borderColor: colors.primary },
    },
    '& .MuiSelect-icon': { color: colors.textSec }
  };

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  useEffect(() => { loadDashboardData(); }, []);
  useEffect(() => {
    if (currentTab === 1 && popularCommunities.length === 0) loadPopularCommunities();
    else if (currentTab === 2 && recommendedCommunities.length === 0) loadRecommendedCommunities();
  }, [currentTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const profileRes = await getUserProfile();
      const formattedProfile = { ...profileRes.user, profileImage: formatImageUrl(profileRes.user.profileImage) };
      setProfileData(formattedProfile);
      setEditData(formattedProfile);
      try {
        const myCommunitiesRes = await getMyCommunities();
        const formattedCommunities = (myCommunitiesRes.data || []).map(c => ({ ...c, coverImage: formatImageUrl(c.coverImage), role: c.members.find(m => m.user === profileRes.user._id || m.user === profileRes.user.id)?.role || 'member' }));
        setMyCommunities(formattedCommunities);
      } catch { setMyCommunities([]); }
      try {
        const notificationsRes = await getUserNotifications();
        setNotifications(notificationsRes.notifications || []);
      } catch { setNotifications([]); }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load');
        showSnackbar('Failed to load data', 'warning');
      }
    } finally { setLoading(false); }
  };

  const loadPopularCommunities = async () => {
    try {
      setLoadingTab(true);
      const response = await getPopularCommunities(10);
      setPopularCommunities((response.data || []).map(c => ({ ...c, coverImage: formatImageUrl(c.coverImage) })));
    } catch { showSnackbar('Failed to load popular', 'error'); } finally { setLoadingTab(false); }
  };

  const loadRecommendedCommunities = async () => {
    try {
      setLoadingTab(true);
      const response = await getRecommendedCommunities();
      setRecommendedCommunities((response.data || []).map(c => ({ ...c, coverImage: formatImageUrl(c.coverImage) })));
    } catch { showSnackbar('Failed to load recommended', 'error'); } finally { setLoadingTab(false); }
  };

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleViewCommunity = useCallback((community) => { setSelectedCommunity(community); setView('community'); }, []);
  const goBackToDashboard = useCallback(() => { setSelectedCommunity(null); setView('dashboard'); }, []);

  const handleJoinCommunity = async (community) => {
    try {
      await joinCommunityAPI(community._id || community.id);
      showSnackbar(`Joined ${community.name}!`, 'success');
      loadDashboardData();
      setPopularCommunities(prev => prev.filter(c => c._id !== community._id));
      setRecommendedCommunities(prev => prev.filter(c => c._id !== community._id));
    } catch (err) { showSnackbar(err.response?.data?.message || 'Failed to join', 'error'); }
  };

  const handleAcceptInvite = async (notifId, communityId) => {
    try {
      await joinCommunityAPI(communityId);
      await deleteNotification(notifId);
      setNotifications(notifications.filter(n => n.id !== notifId));
      showSnackbar('Invitation accepted!', 'success');
      loadDashboardData();
    } catch { showSnackbar('Failed to accept', 'error'); }
  };

  const handleDeclineInvite = async (notifId) => {
    try {
      await deleteNotification(notifId);
      setNotifications(notifications.filter(n => n.id !== notifId));
      showSnackbar('Invitation declined', 'info');
    } catch { showSnackbar('Failed to decline', 'error'); }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await updateUserProfile({ username: editData.username, bio: editData.bio, interests: editData.interests, profileImage: editData.profileImage });
      setProfileData(response.user);
      setEditProfileDialog(false);
      showSnackbar('Profile updated!', 'success');
      loadDashboardData();
    } catch { showSnackbar('Failed to update', 'error'); }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditData(prev => ({ ...prev, profileImage: URL.createObjectURL(file), profileImageFile: file }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewCommunityData(prev => ({ ...prev, coverImage: URL.createObjectURL(file), coverFile: file }));
  };

  const toggleInterest = (interest) => {
    setEditData(prev => {
      const currentInterests = prev.interests || [];
      return { ...prev, interests: currentInterests.includes(interest) ? currentInterests.filter(i => i !== interest) : [...currentInterests, interest] };
    });
  };

  const handleCreateCommunity = async () => {
    if (!newCommunityData.name || !newCommunityData.categories.length || !newCommunityData.description) {
      showSnackbar('Fill all fields', 'error');
      return;
    }
    try {
      setCreatingCommunity(true);
      await createCommunityAPI(newCommunityData);
      showSnackbar('Community created!', 'success');
      loadDashboardData();
      setNewCommunityData({ name: '', categories: [], description: '', coverImage: null, coverFile: null });
      setCurrentTab(0);
    } catch { showSnackbar('Failed to create', 'error'); } finally { setCreatingCommunity(false); }
  };

  const handleInviteMembers = (community) => { setCommunityToInvite(community); setInviteEmail(''); setInviteMemberDialog(true); };

  const handleSendInvite = async () => {
    if (!inviteEmail || !communityToInvite) return;
    if (!/\S+@\S+\.\S+/.test(inviteEmail)) { showSnackbar('Invalid email', 'error'); return; }
    setSendingInvite(true);
    try {
      await inviteMemberAPI(communityToInvite._id || communityToInvite.id, inviteEmail);
      showSnackbar('Invitation sent!', 'success');
      setInviteMemberDialog(false);
      setCommunityToInvite(null);
      setInviteEmail('');
    } catch { showSnackbar('Failed to send', 'error'); } finally { setSendingInvite(false); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await clearAllNotifications();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showSnackbar('All marked as read', 'success');
    } catch { showSnackbar('Failed to mark', 'error'); }
  };

  const handleLeaveCommunity = async (communityId) => {
    if (!window.confirm("Leave community?")) return;
    try {
      await leaveCommunity(communityId);
      showSnackbar('Left community', 'success');
      loadDashboardData();
    } catch { showSnackbar('Failed to leave', 'error'); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const tabs = [{ name: 'My Communities', icon: Home }, { name: 'Popular', icon: TrendingUpIcon }, { name: 'Recommended', icon: ThumbUpIcon }, { name: 'Create', icon: AddCircleIcon }];

  // --- SUB-COMPONENT: FIXED SIZE CARD ---
  const CommunityCard = ({ community, type, index }) => (
    // Grid item must be flex to stretch children
    <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8 }}
        style={{ width: '100%', display: 'flex' }} // Ensure motion div fills Grid item
      >
        <Card
          elevation={0}
          sx={{
            width: '100%',
            height: '100%', // Take full height of Grid item
            display: 'flex', 
            flexDirection: 'column', // Stack content vertically
            borderRadius: 4,
            bgcolor: colors.card,
            border: '1px solid',
            borderColor: colors.border,
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.4)' : '0 20px 25px -5px rgba(0,0,0,0.1)',
            }
          }}
        >
          {/* Banner - Fixed Height */}
          <Box sx={{ height: 140, position: 'relative', bgcolor: isDark ? '#334155' : '#e2e8f0', flexShrink: 0 }}>
            {community.coverImage && (
              <Box 
                component="img" 
                src={community.coverImage} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', // Ensures image fills 140px exactly
                  opacity: 0.7 
                }} 
              />
            )}
            <Chip
              label={community.role || 'Member'}
              size="small"
              sx={{
                position: 'absolute', top: 12, right: 12,
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255,255,255,0.9)',
                color: colors.textMain
              }}
            />
          </Box>

          {/* Content - Flex Grow to fill space */}
          <CardContent sx={{ pt: 0, px: 3, pb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Avatar Overlap */}
            <Box sx={{ mt: -4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Avatar
                src={community.coverImage}
                sx={{
                  width: 64, height: 64,
                  border: `4px solid ${colors.card}`,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  bgcolor: colors.primary, fontWeight: 800
                }}
              >
                {community.name?.charAt(0)}
              </Avatar>
            </Box>

            <Typography variant="h6" fontWeight={800} noWrap sx={{ color: colors.textMain, mb: 0.5 }}>
              {community.name}
            </Typography>

            <Stack direction="row" spacing={2} mb={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <GroupIcon sx={{ fontSize: 16, color: colors.primary }} />
                <Typography variant="caption" fontWeight={700} color={colors.textSec}>
                  {community.memberCount || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" fontWeight={700} color={colors.textSec}>
                  Active
                </Typography>
              </Box>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: colors.textSec,
                flexGrow: 1, // Pushes buttons to bottom
                mb: 3,
                minHeight: '40px', // Prevents layout shift on short descriptions
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {community.description || "No description available for this community."}
            </Typography>

            {/* Action Buttons - Pushed to bottom via flexGrow above */}
            <Stack direction="row" spacing={1} mt="auto">
              {type === 'my' ? (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    onClick={() => handleViewCommunity(community)}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', bgcolor: colors.primary }}
                  >
                    View
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleInviteMembers(community)}
                    sx={{ borderRadius: 2, border: '1px solid', borderColor: colors.border, color: colors.textMain }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleLeaveCommunity(community._id)}
                    sx={{ borderRadius: 2, border: '1px solid', borderColor: colors.border }}
                  >
                    <ExitToApp fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleJoinCommunity(community)}
                  sx={{ 
                    borderRadius: 2, fontWeight: 700, textTransform: 'none', 
                    borderWidth: 2, borderColor: colors.primary, color: colors.primary,
                    '&:hover': { borderWidth: 2 } 
                  }}
                >
                  Join Community
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: colors.bg }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error && !profileData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3, bgcolor: colors.bg }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={loadDashboardData} sx={{ borderRadius: 2 }}>Retry</Button>
          <Button variant="outlined" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} sx={{ borderRadius: 2 }}>Login</Button>
        </Stack>
      </Box>
    );
  }

  if (view === 'community' && selectedCommunity) {
    return <CommunityPage community={selectedCommunity} userId={profileData?._id} goBack={goBackToDashboard} showSnackbar={showSnackbar} userAvatar={profileData?.profileImage} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.bg, display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease', color: colors.textMain }}>
      <CssBaseline />
      {/* NAVBAR */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid', 
          borderColor: colors.border,
          background: colors.card,
          color: colors.textMain
        }}
      >
        <Toolbar sx={{ maxWidth: 1400, mx: 'auto', width: '100%', px: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
            <Forum sx={{ color: colors.primary, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px">Discussify</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={onModeChange} color="inherit" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
              {isDark ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>

            <IconButton onClick={() => setNotificationDrawer(true)} color="inherit" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>

            <Tooltip title="Profile">
              <IconButton onClick={(e) => setProfileMenu(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar src={profileData?.profileImage} sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: '14px', fontWeight: 700 }}>
                  {profileData?.username?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu 
            anchorEl={profileMenu} 
            open={Boolean(profileMenu)} 
            onClose={() => setProfileMenu(null)} 
            PaperProps={{ elevation: 3, sx: { mt: 1.5, minWidth: 220, borderRadius: 3, bgcolor: colors.card, color: colors.textMain, border: '1px solid', borderColor: colors.border } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={800} color={colors.textMain}>{profileData?.username}</Typography>
              <Typography variant="caption" color={colors.textSec} noWrap>{profileData?.email}</Typography>
            </Box>
            <Divider sx={{ borderColor: colors.border }} />
            <MenuItem onClick={() => { setProfileMenu(null); setEditProfileDialog(true); }}>
              <ListItemIcon><Person fontSize="small" sx={{ color: colors.textSec }} /></ListItemIcon>
              <Typography variant="body2" fontWeight={600}>Edit Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} sx={{ color: 'error.main' }}>
              <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
              <Typography variant="body2" fontWeight={600}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        {/* Navigation Tabs */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 } }}>
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const active = currentTab === i;
            return (
              <Button
                key={i}
                startIcon={<Icon />}
                onClick={() => setCurrentTab(i)}
                sx={{
                  whiteSpace: 'nowrap',
                  px: 3, py: 1,
                  borderRadius: 3,
                  fontWeight: 800,
                  textTransform: 'none',
                  bgcolor: active ? colors.primary : 'transparent',
                  color: active ? '#fff' : colors.textSec,
                  '&:hover': { bgcolor: active ? colors.primary : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: active ? '#fff' : colors.textMain }
                }}
              >
                {tab.name}
              </Button>
            );
          })}
        </Box>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {currentTab === 0 && (
            <motion.div key="tab0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Paper elevation={0} sx={{ mb: 4, p: 1.5, borderRadius: 4, bgcolor: colors.card, border: '1px solid', borderColor: colors.border }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                  <SearchIcon sx={{ mr: 1.5, color: colors.primary }} />
                  <InputBase 
                    placeholder="Search your communities..." 
                    fullWidth 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    sx={{ color: colors.textMain, fontWeight: 600 }} 
                  />
                </Box>
              </Paper>

              <Grid container spacing={3} alignItems="stretch">
                {myCommunities.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                      <Typography variant="h6" color={colors.textSec}>You haven't joined any communities yet.</Typography>
                    </Box>
                  </Grid>
                ) : (
                  myCommunities
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((c, i) => <CommunityCard key={c._id} community={c} type="my" index={i} />)
                )}
              </Grid>
            </motion.div>
          )}

          {(currentTab === 1 || currentTab === 2) && (
            <motion.div key="tab-explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loadingTab ? (
                <Box display="flex" justifyContent="center" py={10}><CircularProgress size={30} /></Box>
              ) : (
                <Grid container spacing={3} alignItems="stretch">
                  {(currentTab === 1 ? popularCommunities : recommendedCommunities).map((c, i) => (
                    <CommunityCard key={c._id} community={c} type="explore" index={i} />
                  ))}
                </Grid>
              )}
            </motion.div>
          )}

          {currentTab === 3 && (
            <motion.div key="tab3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 5, bgcolor: colors.card, border: '1px solid', borderColor: colors.border }}>
                  <Typography variant="h5" fontWeight={900} mb={1} textAlign="center" color={colors.textMain}>Start a Community</Typography>
                  <Typography variant="body2" mb={4} textAlign="center" color={colors.textSec}>Create a space for people with shared interests.</Typography>
                  
                  <Box display="flex" justifyContent="center" mb={4}>
                    <input accept="image/*" style={{ display: 'none' }} id="cover-upload" type="file" onChange={handleCoverImageChange} />
                    <label htmlFor="cover-upload">
                      <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                        <Avatar src={newCommunityData.coverImage} sx={{ width: 100, height: 100, border: '2px solid', borderColor: colors.primary, bgcolor: 'transparent', color: colors.primary }}>
                          <PhotoCameraIcon />
                        </Avatar>
                        <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: colors.primary, borderRadius: '50%', p: 0.5, border: '2px solid', borderColor: colors.card }}>
                          <EditIcon sx={{ color: '#fff', fontSize: 16 }} />
                        </Box>
                      </Box>
                    </label>
                  </Box>

                  <Stack spacing={3}>
                    <TextField label="Community Name" fullWidth variant="outlined" value={newCommunityData.name} onChange={(e) => setNewCommunityData(p => ({ ...p, name: e.target.value }))} sx={commonInputSx} />
                    <TextField label="Description" fullWidth multiline rows={3} value={newCommunityData.description} onChange={(e) => setNewCommunityData(p => ({ ...p, description: e.target.value }))} sx={commonInputSx} />
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: colors.textSec }}>Categories</InputLabel>
                      <Select 
                        multiple 
                        value={newCommunityData.categories} 
                        onChange={(e) => setNewCommunityData(p => ({ ...p, categories: e.target.value }))} 
                        input={<OutlinedInput label="Categories" sx={{ color: colors.textMain, '& fieldset': { borderColor: colors.border } }} />} 
                        renderValue={(s) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{s.map(v => <Chip key={v} label={v} size="small" />)}</Box>}
                        MenuProps={{ PaperProps: { sx: { bgcolor: colors.card, color: colors.textMain } } }}
                        sx={commonInputSx}
                      >
                        {AVAILABLE_INTERESTS.map(i => <MenuItem key={i} value={i} sx={{ color: colors.textMain, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>{i}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      onClick={handleCreateCommunity} 
                      disabled={creatingCommunity} 
                      sx={{ py: 1.8, borderRadius: 3, fontWeight: 800, textTransform: 'none', fontSize: '1rem', bgcolor: colors.primary }}
                    >
                      {creatingCommunity ? <CircularProgress size={24} color="inherit" /> : 'Create Community'}
                    </Button>
                  </Stack>
                </Paper>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* FOOTER */}
      <Box component="footer" sx={{ py: 6, borderTop: '1px solid', borderColor: colors.border, bgcolor: colors.card }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Forum sx={{ color: colors.primary }} />
              <Typography variant="h6" fontWeight={900} color={colors.textMain}>Discussify</Typography>
            </Stack>
            <Typography variant="body2" color={colors.textSec}>© 2025 Discussify Platform. Built for conversation.</Typography>
          </Stack>
        </Container>
      </Box>

      {/* NOTIFICATIONS DRAWER */}
      <Drawer anchor="right" open={notificationDrawer} onClose={() => setNotificationDrawer(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, bgcolor: colors.card, color: colors.textMain, borderLeft: '1px solid', borderColor: colors.border } }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={800} color={colors.textMain}>Notifications</Typography>
            <IconButton onClick={() => setNotificationDrawer(false)} sx={{ color: colors.textMain }}><CloseIcon /></IconButton>
          </Stack>
          <Button fullWidth size="small" onClick={handleMarkAllAsRead} sx={{ mb: 3, borderRadius: 2, color: colors.primary }}>Mark all as read</Button>
          <List>
            {notifications.length === 0 ? <Alert severity="info" sx={{ borderRadius: 2 }}>All caught up!</Alert> : notifications.map(n => (
              <ListItem key={n._id} sx={{ bgcolor: n.read ? 'transparent' : isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', borderRadius: 3, mb: 1.5, border: '1px solid', borderColor: n.read ? colors.border : colors.primary }}>
                <ListItemAvatar><Avatar sx={{ bgcolor: colors.primary }}><Info /></Avatar></ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight={700} color={colors.textMain}>{n.title}</Typography>}
                  secondary={
                    <Box mt={0.5}>
                      <Typography variant="caption" color={colors.textSec} sx={{ display: 'block', mb: 1 }}>{n.message}</Typography>
                      {n.type === 'COMMUNITY_INVITE' && n.data?.communityId && (
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="contained" disableElevation onClick={() => handleAcceptInvite(n._id, n.data.communityId)} sx={{ borderRadius: 1.5, textTransform: 'none', bgcolor: colors.primary }}>Accept</Button>
                          <Button size="small" variant="outlined" onClick={() => handleDeclineInvite(n._id)} sx={{ borderRadius: 1.5, textTransform: 'none', color: colors.textSec, borderColor: colors.border }}>Ignore</Button>
                        </Stack>
                      )}
                    </Box>
                  } 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* DIALOGS */}
      <Dialog open={editProfileDialog} onClose={() => setEditProfileDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: colors.card, color: colors.textMain, borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: colors.textMain }}>Profile Settings</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" py={3}>
            <input accept="image/*" style={{ display: 'none' }} id="profile-upload" type="file" onChange={handleProfileImageChange} />
            <label htmlFor="profile-upload">
              <Avatar src={editData.profileImage} sx={{ width: 90, height: 90, cursor: 'pointer', border: '3px solid', borderColor: colors.primary }}>{editData.username?.charAt(0)}</Avatar>
            </label>
          </Box>
          <Stack spacing={3}>
            <TextField label="Display Name" fullWidth value={editData.username || ''} onChange={(e) => setEditData(p => ({ ...p, username: e.target.value }))} sx={commonInputSx} />
            <TextField label="About You" fullWidth multiline rows={3} value={editData.bio || ''} onChange={(e) => setEditData(p => ({ ...p, bio: e.target.value }))} sx={commonInputSx} />
            <Typography variant="subtitle2" fontWeight={800} color={colors.textMain}>Your Interests</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {AVAILABLE_INTERESTS.map(i => (
                <Chip key={i} label={i} variant={editData.interests?.includes(i) ? 'filled' : 'outlined'} color={editData.interests?.includes(i) ? 'primary' : 'default'} onClick={() => toggleInterest(i)} clickable sx={{ fontWeight: 600, color: editData.interests?.includes(i) ? '#fff' : colors.textMain, borderColor: colors.border }} />
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditProfileDialog(false)} sx={{ fontWeight: 700, color: colors.textSec }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile} sx={{ borderRadius: 2, px: 4, fontWeight: 700, bgcolor: colors.primary }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={inviteMemberDialog} onClose={() => setInviteMemberDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: colors.card, color: colors.textMain, borderRadius: 4 } }}>
        <DialogTitle sx={{ color: colors.textMain }}>Invite Member</DialogTitle>
        <DialogContent>
            <TextField label="Email" fullWidth value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} sx={{ mt: 2, ...commonInputSx }} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setInviteMemberDialog(false)} sx={{ color: colors.textSec }}>Cancel</Button>
            <Button variant="contained" onClick={handleSendInvite} sx={{ bgcolor: colors.primary }}>Send</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}