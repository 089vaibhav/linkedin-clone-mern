// src/pages/ProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserQuery } from '../redux/slices/usersApiSlice';

// --- MUI Imports ---
import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const ProfilePage = () => {
  const { id: userId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: user, isLoading, error } = useGetUserQuery(userId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error?.data?.message || error.error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 2 }}>
        {/* --- Profile Header with Banner and Avatar --- */}
        <Box sx={{ position: 'relative', height: '250px' }}>
          <Box
            component="img"
            src={user.bannerPic}
            alt="Banner"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Avatar
            alt={user.name}
            src={user.profilePic}
            sx={{
              width: 150,
              height: 150,
              border: '4px solid white',
              position: 'absolute',
              bottom: '-75px',
              left: '24px',
            }}
          />
        </Box>

        {/* --- User Info and Actions --- */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          {userInfo._id === user._id && <Button variant="outlined">Edit Profile</Button>}
        </Box>
        
        <Box sx={{ p: 3, pt: 6 /* Adjust padding to clear the avatar */ }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.bio || 'No bio available.'}
          </Typography>
        </Box>

        {/* --- Skills Section --- */}
        <Box sx={{ p: 3, borderTop: '1px solid #ddd' }}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          <Box>
            {user.skills?.length > 0 ? (
              user.skills.map((skill, index) => (
                <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No skills listed.</Typography>
            )}
          </Box>
        </Box>

        {/* --- Experience Section --- */}
        <Box sx={{ p: 3, borderTop: '1px solid #ddd' }}>
          <Typography variant="h6" gutterBottom>Experience</Typography>
          {user.experience?.length > 0 ? (
            user.experience.map((exp, index) => (
              <Grid container key={index} spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                  <WorkIcon color="action" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{exp.role}</Typography>
                  <Typography variant="body1">{exp.company}</Typography>
                  <Typography variant="body2" color="text.secondary">{exp.duration}</Typography>
                </Grid>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No experience listed.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;