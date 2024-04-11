import mongoose, { Schema } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    team: { type: String },
    status: { type: String, required: true, default: 'active' },
    avatarUrl: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export default User;
