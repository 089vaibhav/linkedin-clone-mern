// src/pages/MessagingPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../context/SocketContext';
import { useGetUsersQuery } from '../redux/slices/usersApiSlice';
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from '../redux/slices/messagesApiSlice';

const MessagingPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { socket, onlineUsers } = useSocketContext();
  const { data: allUsers, isLoading: usersLoading } = useGetUsersQuery();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const lastMessageRef = useRef(null);

  // Fetch message history when a user is selected
  const { data: messageHistory, isLoading: messagesLoading } = useGetMessagesQuery(
    selectedUser?._id,
    { skip: !selectedUser }
  );

  const [sendMessage] = useSendMessageMutation();

  // Effect to scroll to the latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect to load message history
  useEffect(() => {
    if (messageHistory) {
      setMessages(messageHistory);
    }
  }, [messageHistory]);

  // Effect for listening to real-time messages
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        // Only update if the message is from the currently selected user
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

  if (usersLoading) return <p>Loading users...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', height: '80vh' }}>
      <div className="user-list" style={{ borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
        <h3>Contacts</h3>
        {allUsers?.filter(u => u._id !== userInfo._id).map((user) => (
          <div key={user._id} onClick={() => setSelectedUser(user)} style={{ padding: '10px', cursor: 'pointer', background: selectedUser?._id === user._id ? '#e0e0e0' : 'none' }}>
            {user.name} {onlineUsers.includes(user._id) && '🟢'}
          </div>
        ))}
      </div>
      <div className="chat-window" style={{ display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>
            <div className="messages" style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {messagesLoading ? <p>Loading messages...</p> : messages.map((msg) => (
                <div key={msg._id} ref={lastMessageRef} style={{ textAlign: msg.senderId === userInfo._id ? 'right' : 'left', marginBottom: '10px' }}>
                  <p style={{ background: msg.senderId === userInfo._id ? '#dcf8c6' : '#fff', display: 'inline-block', padding: '10px', borderRadius: '10px' }}>
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: '10px' }}>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flexGrow: 1, padding: '10px' }} />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a conversation to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;