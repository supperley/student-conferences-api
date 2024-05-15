import mongoose, { Schema } from 'mongoose';

const ConferenceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    administrator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String },
    status: {
      type: String,
      required: true,
      default: 'registrationOpen',
      enum: ['registrationOpen', 'registrationClosed', 'declined', 'held', 'completed'],
    },
    // faculties: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
    faculties: [{ type: String }],
    link: { type: String },
  },
  { timestamps: true },
);

const Conference = mongoose.model('Conference', ConferenceSchema);

export default Conference;
