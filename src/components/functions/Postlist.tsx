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
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-700/50 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
            <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
            <div className="h-4 bg-gray-700/30 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-700/30 rounded w-20"></div>
              <div className="h-6 bg-gray-700/30 rounded-full w-16"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm border border-red-700/30 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-400 font-medium">Error loading posts: {error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <section>
      <motion.h2 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold mb-8 text-white"
      >
        {selectedCategory === "All" ? "All Posts" : `${selectedCategory} Posts`}
      </motion.h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-2xl p-6 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:border-primary/30">
              <motion.h3 
                className="text-xl font-semibold mb-3 text-primary group-hover:text-emerald-400 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {post.title}
              </motion.h3>
              <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                {post.content.substring(0, 120)}...
              </p>
              <div className="flex flex-wrap justify-between items-center mt-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={`/post/${post.id}`} 
                    className="inline-flex items-center text-primary hover:text-emerald-400 transition-colors duration-300 font-medium group"
                  >
                    Read more 
                    <motion.span
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-sm text-gray-400 bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50"
                >
                  {post.category}
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PostList;
