/*eslint-disable*/
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, PenSquare, BookOpen, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/app/_contexts/Authcontext'
import { AdminOnly, AdminBadge } from '@/components/functions/AdminGuard'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Toast, useToast } from "@/components/ui/toast"

function AuthDialog() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const email = event.currentTarget.email.value;
      const password = event.currentTarget.password.value;
      await login(email, password);
      setIsOpen(false);
      showToast('Login successful!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Login failed', 'error');
    }
  }

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const username = (event.currentTarget['name'] as unknown as HTMLInputElement).value;
      const email = event.currentTarget.email.value;
      const password = event.currentTarget.password.value;
      await signup(username, email, password);
      setIsOpen(false);
      showToast('Account created successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Signup failed', 'error');
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setIsOpen(false);
      showToast('Google login successful!', 'success');
    } catch (error: any) {
      if (error.message !== 'Login cancelled by user.') {
        showToast(error.message || 'Google login failed', 'error');
      }
    }
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              className="bg-gradient-to-r from-primary to-emerald-400 text-black border-0 hover:from-emerald-400 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/30 font-medium"
            >
              Login / Signup
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold">Authentication</DialogTitle>
            <DialogDescription className="text-gray-400">
              Login or create a new account to access all features.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-primary data-[state=active]:text-black text-gray-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-primary data-[state=active]:text-black text-gray-300"
              >
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    required 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium"
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="button" 
                    onClick={handleGoogleLogin} 
                    variant="outline" 
                    className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                  >
                    Login with Google
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Username</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    required 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a password" 
                    required 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="button" 
                    onClick={handleGoogleLogin} 
                    variant="outline" 
                    className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                  >
                    Sign up with Google
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading, isAdmin } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuVariants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <nav className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-full mx-4 mt-4 sticky top-4 z-50 shadow-2xl">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-semibold text-white">My Blog</span>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse h-8 w-24 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-full mx-4 mt-4 sticky top-4 z-50 shadow-2xl">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-7 h-7 bg-gradient-to-r from-primary to-emerald-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-base">B</span>
            </div>
            <Link href="/" className="text-lg font-semibold text-white hover:text-primary transition-colors duration-300">
              My Blog
            </Link>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/" className="text-white/80 hover:text-white transition-colors duration-300 font-medium text-sm">
              Home
            </Link>
            <Link href="/viewpost" className="text-white/80 hover:text-white transition-colors duration-300 font-medium text-sm">
              Posts
            </Link>
            {user && (
              <>
                <AdminOnly>
                  <Link href="/createblog" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                    Create
                  </Link>
                </AdminOnly>
                <AdminOnly>
                  <Link href="/admin" className="text-orange-400/80 hover:text-orange-400 transition-colors duration-300 font-medium">
                    Admin
                  </Link>
                </AdminOnly>
              </>
            )}
          </motion.div>

          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white/70 text-sm font-medium">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                <AdminBadge />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/30 rounded-full px-4 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            ) : (
              <AuthDialog />
            )}
          </motion.div>
          <div className="md:hidden flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/40 backdrop-blur-lg border-t border-white/10 rounded-b-3xl mt-2 mx-4"
          >
            <div className="px-6 pt-4 pb-6 space-y-3">
              <Link href="/" className="block text-white/80 hover:text-white transition-colors duration-300 font-medium py-2">
                Home
              </Link>
              <Link href="/viewpost" className="block text-white/80 hover:text-white transition-colors duration-300 font-medium py-2">
                Posts
              </Link>
              {user ? (
                <>
                  <AdminOnly>
                    <Link href="/createblog" className="block text-white/80 hover:text-white transition-colors duration-300 font-medium py-2">
                      Create
                    </Link>
                  </AdminOnly>
                  <AdminOnly>
                    <Link href="/admin" className="block text-orange-400/80 hover:text-orange-400 transition-colors duration-300 font-medium py-2">
                      Admin
                    </Link>
                  </AdminOnly>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <motion.span 
                      className="block text-white/70 text-sm font-medium py-2 flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                      <AdminBadge />
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout} 
                        className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                </>
              ) : (
                <motion.div 
                  className="pt-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <AuthDialog />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;