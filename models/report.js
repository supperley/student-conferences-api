import mongoose, { Schema } from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    supervisor: { type: Schema.Types.ObjectId, ref: 'User' },
    conference: { type: Schema.Types.ObjectId, ref: 'Conference', required: true },
    thumbUrl: { type: String },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'accepted', 'declined'],
    },
    fileUrl: { type: String },
    comments: [{ author: { type: Schema.Types.ObjectId, ref: 'User' }, comment: { type: String } }],
  },
  { timestamps: true },
);

const Report = mongoose.model('Report', ReportSchema);

export default Report;
