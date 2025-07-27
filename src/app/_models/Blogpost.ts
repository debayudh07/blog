// Firebase Firestore types for BlogPost
export interface BlogPost {
  id?: string; // Firestore document ID
  title: string;
  author: string;
  authorId: string; // Firebase Auth UID
  category: string;
  content: string;
  images?: string[]; // URLs for images
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isDraft: boolean;
  publishDate?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Type for creating a new blog post (without auto-generated fields)
export interface CreateBlogPost {
  title: string;
  author: string;
  authorId: string;
  category: string;
  content: string;
  images?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isDraft: boolean;
  publishDate?: string;
}

// Type for updating a blog post
export interface UpdateBlogPost {
  id: string;
  title?: string;
  author?: string;
  category?: string;
  content?: string;
  images?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isDraft?: boolean;
  publishDate?: string;
}
