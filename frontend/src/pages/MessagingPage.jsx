// src/pages/MessagingPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../context/SocketContext';
import { useGetUsersQuery } from '../redux/slices/usersApiSlice';
import { useGetMessagesQuery, useSendMessageMutation } from '../redux/slices/messagesApiSlice';

// --- MUI Imports ---
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Badge,
  styled,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Custom styled badge for online indicator
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const MessagingPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { socket, onlineUsers } = useSocketContext();
  const { data: allUsers, isLoading: usersLoading } = useGetUsersQuery();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const lastMessageRef = useRef(null);

  const { data: messageHistory, isLoading: messagesLoading } = useGetMessagesQuery(selectedUser?._id, { skip: !selectedUser });
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messageHistory) setMessages(messageHistory);
  }, [messageHistory]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        if (selectedUser && message.senderId === selectedUser._id) {
          setMessages((prev) => [...prev, message]);
        }
      };
      socket.on('receiveMessage', handleReceiveMessage);
      return () => socket.off('receiveMessage', handleReceiveMessage);
    }
  }, [socket, selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await sendMessage({ receiverId: selectedUser._id, content: newMessage }).unwrap();
      setMessages((prev) => [...prev, res]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (usersLoading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex' }}>
        <Grid container>
          {/* User List Column */}
          <Grid item xs={4} sx={{ borderRight: '1px solid #ddd' }}>
            <Typography variant="h6" sx={{ p: 2 }}>Contacts</Typography>
            <List>
              {allUsers?.filter(u => u._id !== userInfo._id).map((user) => (
                <ListItem button key={user._id} onClick={() => setSelectedUser(user)} selected={selectedUser?._id === user._id}>
                  <ListItemAvatar>
                    {onlineUsers.includes(user._id) ? (
                      <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                        <Avatar alt={user.name} src={user.profilePic} />
                      </StyledBadge>
                    ) : (
                      <Avatar alt={user.name} src={user.profilePic} />
                    )}
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Chat Window Column */}
          <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                  {messagesLoading ? <CircularProgress /> : messages.map((msg) => (
                    <Box key={msg._id} ref={lastMessageRef} sx={{ display: 'flex', justifyContent: msg.senderId === userInfo._id ? 'flex-end' : 'flex-start', mb: 1 }}>
                      <Paper elevation={1} sx={{ p: 1, bgcolor: msg.senderId === userInfo._id ? 'primary.light' : 'grey.300', maxWidth: '70%' }}>
                        <Typography variant="body1">{msg.content}</Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex' }}>
                  <TextField fullWidth variant="outlined" size="small" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <IconButton type="submit" color="primary"><SendIcon /></IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">Select a conversation to start chatting</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MessagingPage;