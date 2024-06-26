import mongoose, { Schema } from 'mongoose';

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    faculties: [{ type: String }],
    imageUrl: { type: String },
    chip: { type: String },
  },
  { timestamps: true },
);

const News = mongoose.model('News', NewsSchema);

export default News;
