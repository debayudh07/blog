import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import BlogPost from '@/app/_models/Blogpost'; // Import the model

// Connect to MongoDB (Assuming mongoose is already set up)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return; // already connected
  }
  await mongoose.connect(process.env.MONGODB_URI ?? '', {
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const {
        title,
        author,
        category,
        content,
        images,
        tags,
        seoTitle,
        seoDescription,
        isDraft,
        publishDate,
      } = req.body;

      const newBlogPost = new BlogPost({
        title,
        author,
        category,
        content,
        images,
        tags,
        seoTitle,
        seoDescription,
        isDraft,
        publishDate,
      });

      await newBlogPost.save();

      return res.status(200).json({ message: 'Blog post saved successfully' });
    } catch (error) {
      console.error('Error saving blog post:', error);
      return res.status(500).json({ message: 'Failed to save blog post' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
