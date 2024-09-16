import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PostListProps {
  selectedCategory: string;
}

const PostList: React.FC<PostListProps> = ({ selectedCategory }) => {
  interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
  }
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post-blog', {
            method: 'GET', // Specify the GET method
          }) // Ensure this matches your backend route
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(data.posts); // Assuming `data.posts` contains the array of posts from the API
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        {selectedCategory === "All" ? "All Posts" : `${selectedCategory} Posts`}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
            <div className="flex flex-wrap justify-between items-center">
              <Link href={`/post/${post.id}`} className="text-blue-500 hover:text-blue-600 transition-colors duration-300 mb-2 sm:mb-0">
                Read more →
              </Link>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{post.category}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PostList;
