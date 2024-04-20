import mongoose, { Schema } from 'mongoose';

const FacultySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

const Faculty = mongoose.model('Faculty', FacultySchema);

export default Faculty;
