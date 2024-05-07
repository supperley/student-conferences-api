import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    parent_comment: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Comment',
    },
    // likes: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
