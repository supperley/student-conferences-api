import mongoose, { Schema } from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    thumbUrl: { type: String },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'accepted'] },
    link: { type: String },
    comments: [{ author: { type: Schema.Types.ObjectId, ref: 'User' }, comment: { type: String } }],
  },
  { timestamps: true },
);

const Report = mongoose.model('Report', ReportSchema);

export default Report;
