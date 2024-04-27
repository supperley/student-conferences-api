import mongoose, { Schema } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    login: { type: String, required: true },
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
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    patronymic: { type: String },
    faculty: { type: String },
    department: { type: String },
    position: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export default User;
