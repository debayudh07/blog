'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/functions/Navbar'
import PostList from '@/components/functions/Postlist'

// Mock data structure for posts and categories
const posts = [
  { id: 1, title: "Getting Started with React", content: "React is a popular JavaScript library for building user interfaces...", category: "Technology" },
  { id: 2, title: "10 Tips for Healthy Living", content: "Maintaining a healthy lifestyle is crucial for overall well-being...", category: "Health" },
  { id: 3, title: "Exploring the Streets of Tokyo", content: "Tokyo, the bustling capital of Japan, offers a unique blend of...", category: "Travel" },
  { id: 4, title: "The Future of AI", content: "Artificial Intelligence is rapidly evolving and shaping various industries...", category: "Technology" },
  { id: 5, title: "Delicious Vegan Recipes", content: "Vegan cuisine can be both nutritious and delicious. Here are some...", category: "Food" },
  { id: 6, title: "Mindfulness Meditation Techniques", content: "Practicing mindfulness can significantly reduce stress and improve...", category: "Lifestyle" },
  { id: 7, title: "Budget Travel Tips", content: "Traveling on a budget doesn't mean sacrificing experiences. Here are some tips...", category: "Travel" },
  { id: 8, title: "Cybersecurity Best Practices", content: "In an increasingly digital world, protecting your online presence is crucial...", category: "Technology" },
]

const categories = ["All", "Technology", "Health", "Travel", "Food", "Lifestyle"]



export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")




  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar />

     

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Post Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Featured Post</h2>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600">{posts[0].title}</h3>
            <p className="text-gray-600 mb-4">{posts[0].content}</p>
            <Link href={`/post/${posts[0].id}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
              Read more
            </Link>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-1 md:px-4 md:py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Posts Section */}
        <PostList  selectedCategory={selectedCategory} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">&copy; 2023 My Blog. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}