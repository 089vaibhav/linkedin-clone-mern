// src/components/NotificationBell.jsx
import { useState, useEffect } from 'react';
import { useGetNotificationsQuery, useMarkNotificationsAsReadMutation } from '../redux/slices/notificationsApiSlice';
import { useSocketContext } from '../context/SocketContext';
import { apiSlice } from '../redux/slices/apiSlice';
import { useDispatch } from 'react-redux';

// --- MUI Imports ---
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationBell = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Manually update the cache when a new notification arrives
  useEffect(() => {
    if (socket) {
      const handleNewNotification = (newNotification) => {
        dispatch(
          apiSlice.util.updateQueryData('getNotifications', undefined, (draftNotifications) => {
            draftNotifications.unshift(newNotification);
          })
        );
      };
      socket.on('newNotification', handleNewNotification);
      return () => socket.off('newNotification', handleNewNotification);
    }
  }, [socket, dispatch]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const getNotificationMessage = (n) => {
    switch(n.type) {
      case 'like': return `${n.emitter.name} liked your post.`;
      case 'comment': return `${n.emitter.name} commented on your post.`;
      case 'connection_accepted': return `${n.emitter.name} accepted your connection request.`;
      default: return 'You have a new notification.';
    }
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        {isLoading ? (
          <MenuItem>Loading...</MenuItem>
        ) : notifications?.length > 0 ? (
          notifications.map((n) => (
            <MenuItem key={n._id} onClick={handleMenuClose}>
              <Typography variant="body2">{getNotificationMessage(n)}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;