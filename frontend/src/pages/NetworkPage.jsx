// src/pages/NetworkPage.jsx
import { Link } from 'react-router-dom';
import {
  useGetPendingRequestsQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from '../redux/slices/usersApiSlice';

// --- MUI Imports ---
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';

const NetworkPage = () => {
  const { data: requests, isLoading, error } = useGetPendingRequestsQuery();
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();

  const handleAccept = async (userId) => {
    try {
      await acceptRequest(userId).unwrap();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectRequest(userId).unwrap();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return <Alert severity="error">Error fetching invitations.</Alert>;
    }
    if (requests?.length > 0) {
      return (
        <List>
          {requests.map((req, index) => (
            <div key={req._id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleReject(req._id)}
                    >
                      Ignore
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAccept(req._id)}
                    >
                      Accept
                    </Button>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    component={Link}
                    to={`/profile/${req._id}`}
                    src={req.profilePic}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component={Link}
                      to={`/profile/${req._id}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {req.name}
                    </Typography>
                  }
                  secondary={req.bio}
                />
              </ListItem>
              {index < requests.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </div>
          ))}
        </List>
      );
    }
    return <Typography sx={{ mt: 2 }}>No pending invitations.</Typography>;
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Invitations
        </Typography>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default NetworkPage;
