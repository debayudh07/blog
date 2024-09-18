'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, X, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function PostViewer() {
  const [posts, setPosts] = useState<{ id: number, title: string, content: string, likes: number, image: string }[]>([])
  const [selectedPost, setSelectedPost] = useState<{ id: number, title: string, content: string, likes: number, image: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Fetching data with GET method
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post-blog', {
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
      }
    }

    fetchPosts()
  }, [])

  const handleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/post-blog', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content type is set
        },
        body: JSON.stringify({ id }), // Sending the ID in the request body
      });
  
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id)); // Remove the deleted post from state
        console.log('Post deleted successfully');
      } else {
        const errorData = await response.json(); // Parse error message from server
        console.error('Failed to delete post:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openModal = (post: { id: number, title: string, content: string, likes: number, image: string }) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Post Viewer</h1>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <img src={post.image} alt={post.title} className="mb-4 w-full h-48 object-cover rounded-lg" />
                  <p>{post.content.substring(0, 100)}...</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => handleLike(post.id)}>
                      <Heart className="mr-2 h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" onClick={() => openModal(post)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View Full Post
                    </Button>
                  </div>
                  <Button variant="ghost" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <img src={selectedPost?.image} alt={selectedPost?.title} className="mb-4 w-full h-48 object-cover rounded-lg" />
            {selectedPost?.content}
          </DialogDescription>
          <div className="flex justify-between items-center mt-4">
            <Button variant="ghost" onClick={() => selectedPost && handleLike(selectedPost.id)}>
              <Heart className="mr-2 h-4 w-4" />
              {selectedPost?.likes}
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
