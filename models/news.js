import mongoose, { Schema } from 'mongoose';

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    imageUrl: { type: String },
    chip: { type: String },
    // chip: { label: 'Конференция', value: 'conference' },
  },
  { timestamps: true },
);

const News = mongoose.model('News', NewsSchema);

export default News;
