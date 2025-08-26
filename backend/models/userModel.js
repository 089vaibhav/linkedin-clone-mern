// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Sub-schema for experience
const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // --- New Profile Fields ---
    bio: {
      type: String,
      default: '',
    },
    profilePic: {
      type: String,
      default: 'https://i.ibb.co/4pDNDk1/avatar.png', // A default avatar
    },
    bannerPic: {
      type: String,
      default: 'https://i.ibb.co/DD5N2sD/banner.jpg', // A default banner
    },
    skills: [String], // An array of strings
    experience: [experienceSchema], // An array of experience objects
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

// ... (matchPassword method and pre-save hook remain the same) ...

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;