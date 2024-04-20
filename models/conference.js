import mongoose, { Schema } from 'mongoose';

const ConferenceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    administrator: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    imageUrl: { type: String },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'completed'] },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    link: { type: String },
  },
  { timestamps: true },
);

const Conference = mongoose.model('Conference', ConferenceSchema);

export default Conference;
