import mongoose, { Schema } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin'],
    },
    status: {
      type: String,
      required: true,
      default: 'active',
      enum: ['active', 'paused', 'blocked'],
    },
    name: { type: String, required: true },
    department: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export default User;
