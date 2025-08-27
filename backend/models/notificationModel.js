// backend/models/notificationModel.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // The user who will receive the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who triggered the notification (e.g., who liked the post)
    emitter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'connection_accepted', 'message'],
      required: true,
    },
    link: {
      // Link to the relevant content (e.g., /post/:id or /profile/:id)
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;