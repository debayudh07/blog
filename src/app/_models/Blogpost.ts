import mongoose, { Schema, model, models } from 'mongoose';

const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // URLs for images
  tags: [{ type: String }],
  seoTitle: { type: String },
  seoDescription: { type: String },
  isDraft: { type: Boolean, default: false },
  publishDate: { type: Date },
}, { timestamps: true });

// Check if the model already exists to avoid overwriting during hot reloads
const BlogPost = models.BlogPost || model('BlogPost', BlogPostSchema);

export default BlogPost;
