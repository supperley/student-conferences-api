import mongoose, { Schema } from 'mongoose';
import crypto from 'node:crypto';

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
    position: { type: String },
    avatarUrl: { type: String },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // 10 min
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', UserSchema);

export default User;
