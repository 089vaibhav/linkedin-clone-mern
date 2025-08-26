// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import http from 'http';
import { Server } from 'socket.io';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();
connectDB();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
  },
});


app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});


app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount the user routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



let onlineUsers = new Map(); // Use a Map to store userId -> socketId

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // A user sends their userId when they connect
  socket.on('addUser', (userId) => {
    onlineUsers.set(userId, socket.id);
    // Broadcast the updated list of online users to all clients
    io.emit('getUsers', Array.from(onlineUsers.keys()));
    console.log('Online users:', Array.from(onlineUsers.keys()));
  });

  // Listen for 'sendMessage' event from a client
  socket.on('sendMessage', ({ senderId, receiverId, content }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      // If the receiver is online, send the message directly to them
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        content,
      });
    }
    // Here you would also save the message to the database
  });

  // A user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Find and remove the user from our onlineUsers map
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    // Broadcast the updated list again
    io.emit('getUsers', Array.from(onlineUsers.keys()));
    console.log('Online users:', Array.from(onlineUsers.keys()));
  });
});


