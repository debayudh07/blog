'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, X, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from '@/app/_contexts/Authcontext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/functions/Navbar'
import { AdminOnly } from '@/components/functions/AdminGuard'

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  createdAt: string;
  images?: string[];
  tags?: string[];
}

export default function PostViewer() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  if (!user) {
    router.push('/');
    return null;
  }

  useEffect(() => {
    if (!user) return;

    // Fetching posts - all posts for everyone, but only admins can delete
    const fetchPosts = async () => {
      try {
        // Remove userId filter to get all posts
        const response = await fetch(`/api/post-blog`, {
          method: 'GET',
        })
        const data = await response.json()

        if (response.ok) {
          setPosts(data.posts)
        } else {
          console.error('Failed to retrieve posts:', data.message)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch('/api/post-blog', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
        console.log('Post deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete post:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openModal = (post: Post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar />
        <div className="container mx-auto p-4">
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading your posts...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-white text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {isAdmin ? 'All Blog Posts' : 'Blog Posts'}
        </motion.h1>
        {posts.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-gray-400 text-lg mb-6">You haven't created any posts yet.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => router.push('/createblog')} 
                  className="bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium px-6 py-3 shadow-lg hover:shadow-primary/30"
                >
                  Create Your First Post
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group w-full"
                >
                  <Card className="w-full bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-3xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/40 rounded-2xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Section */}
                      {post.images && post.images.length > 0 && (
                        <div className="lg:w-1/3 xl:w-1/4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                          >
                            <img 
                              src={post.images[0]} 
                              alt={post.title} 
                              className="w-full h-64 lg:h-full object-cover" 
                            />
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Content Section */}
                      <div className={`flex-1 flex flex-col ${post.images && post.images.length > 0 ? '' : 'w-full'}`}>
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-primary group-hover:text-emerald-400 transition-colors duration-300 text-2xl lg:text-3xl mb-3">
                                {post.title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                <span className="bg-gradient-to-r from-primary/20 to-emerald-400/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                                  {post.category}
                                </span>
                                <span className="text-gray-500">
                                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                                <span className="text-gray-500">by {post.author}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="flex-grow pb-4">
                          <div 
                            className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed line-clamp-4"
                            dangerouslySetInnerHTML={{ 
                              __html: post.content.length > 300 
                                ? post.content.substring(0, 300) + '...' 
                                : post.content 
                            }} 
                          />
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 5).map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex}
                                    className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md text-xs border border-gray-600/30"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 5 && (
                                  <span className="text-gray-400 text-xs">+{post.tags.length - 5} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-700/30">
                          <div className="flex gap-3">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                variant="ghost" 
                                onClick={() => router.push(`/post/${post.id}`)}
                                className="text-primary hover:text-emerald-400 hover:bg-gray-800/50 transition-all duration-300 group"
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Read Full Post
                                <motion.span
                                  className="ml-2"
                                  initial={{ x: 0 }}
                                  whileHover={{ x: 3 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  →
                                </motion.span>
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                variant="ghost" 
                                onClick={() => openModal(post)}
                                className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                              >
                                Quick View
                              </Button>
                            </motion.div>
                          </div>
                          <AdminOnly>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                                className="bg-gradient-to-r from-red-600/80 to-red-700/80 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-700/30"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </motion.div>
                          </AdminOnly>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-gray-900 to-black border-2 border-primary/30 backdrop-blur-md shadow-2xl shadow-primary/20">
            <DialogHeader className="border-b border-gray-700/50 pb-6">
              <DialogTitle className="text-white text-3xl font-bold mb-2">{selectedPost?.title}</DialogTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="bg-gradient-to-r from-primary to-emerald-400 text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  {selectedPost?.category}
                </span>
                <span className="text-gray-300 bg-gray-800/60 px-3 py-1 rounded-full">
                  {selectedPost && new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-gray-300 bg-gray-800/60 px-3 py-1 rounded-full">
                  by {selectedPost?.author}
                </span>
              </div>
            </DialogHeader>
            <DialogDescription asChild>
              <div className="pt-6">
                {selectedPost?.images && selectedPost.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <img 
                      src={selectedPost.images[0]} 
                      alt={selectedPost.title} 
                      className="w-full h-80 object-cover rounded-2xl border-2 border-gray-700/30 shadow-xl" 
                    />
                  </motion.div>
                )}
                
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 mb-6">
                  <div 
                    className="prose prose-invert prose-xl max-w-none text-gray-100 leading-relaxed"
                    style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
                    dangerouslySetInnerHTML={{ __html: selectedPost?.content || '' }} 
                  />
                </div>
                
                {selectedPost?.tags && selectedPost.tags.length > 0 && (
                  <motion.div 
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-bold mb-4 text-xl text-white flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedPost.tags.map((tag, index) => (
                        <motion.span 
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="bg-gradient-to-r from-primary/30 to-emerald-400/30 text-white border-2 border-primary/50 px-4 py-2 rounded-xl text-sm backdrop-blur-sm font-medium shadow-lg hover:shadow-primary/30 transition-all duration-300"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </DialogDescription>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700/50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push(`/post/${selectedPost?.id}`);
                  }}
                  className="bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium px-6 py-3 shadow-lg hover:shadow-primary/30"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  View Full Page
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
