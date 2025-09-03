/*eslint-disable*/
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/app/_contexts/Authcontext'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/functions/NavbarNew'
import DarkVeil from '@/components/ui/darkveil'
import Link from 'next/link'

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

export default function PostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post-blog?postId=${params.id}`, {
          method: 'GET',
        });
        const data = await response.json();

        if (response.ok) {
          setPost(data.post);
        } else {
          setError(data.message || 'Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: `Check out this post: ${post?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
        {/* DarkVeil Background */}
        <div className="absolute inset-0 z-0">
          <DarkVeil 
            hueShift={42}
            speed={2.5}
            noiseIntensity={0.02}
            scanlineIntensity={0.1}
            scanlineFrequency={1}
            warpAmount={1.7}
            resolutionScale={1}
          />
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8 pt-24">
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
              <p className="text-gray-300 text-xl">Loading post...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
        {/* DarkVeil Background */}
        <div className="absolute inset-0 z-0">
          <DarkVeil 
            hueShift={42}
            speed={2.5}
            noiseIntensity={0.02}
            scanlineIntensity={0.1}
            scanlineFrequency={1}
            warpAmount={1.7}
            resolutionScale={1}
          />
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8 pt-24">
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
                <p className="text-gray-400 text-lg mb-6">{error || 'Post not found'}</p>
                <Button 
                  onClick={() => router.back()} 
                className="bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium px-6 py-3 shadow-lg hover:shadow-primary/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      {/* DarkVeil Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil 
          hueShift={42}
          speed={2.5}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          scanlineFrequency={1}
          warpAmount={1.7}
          resolutionScale={1}
        />
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="text-lg">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-lg">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span className="bg-gradient-to-r from-primary to-emerald-400 text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  {post.category}
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                onClick={handleShare}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-700/30"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </motion.div>
          </motion.header>

          {/* Featured Image */}
          {post.images && post.images.length > 0 && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <img 
                src={post.images[0]} 
                alt={post.title} 
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl border-2 border-gray-700/30 shadow-2xl" 
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-gray-700/30 shadow-2xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div 
              className="prose prose-invert prose-xl lg:prose-2xl max-w-none text-gray-100 leading-relaxed"
              style={{ fontSize: '1.2rem', lineHeight: '1.9' }}
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </motion.div>

          {/* Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <motion.div 
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/40 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="font-bold mb-6 text-2xl text-white flex items-center">
                <span className="w-3 h-3 bg-primary rounded-full mr-4"></span>
                Related Tags
              </h3>
              <div className="flex flex-wrap gap-4">
                {post.tags.map((tag, index) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-r from-primary/30 to-emerald-400/30 text-white border-2 border-primary/50 px-6 py-3 rounded-xl text-lg backdrop-blur-sm font-medium shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link href="/viewpost">
              <Button 
                className="bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium px-8 py-4 text-lg shadow-lg hover:shadow-primary/30"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                View All Posts
              </Button>
            </Link>
          </motion.div>
        </article>
      </main>
      </div>
    </div>
  );
}
