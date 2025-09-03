/*eslint-disable*/
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from 'next/link';
import { LogOut, Shield, PenSquare, BookOpen } from 'lucide-react';
import { useAuth } from '@/app/_contexts/Authcontext';
import { AdminOnly, AdminBadge } from '@/components/functions/AdminGuard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toast, useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";



const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

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
        <DialogContent className="sm:max-w-[425px] bg-black/20 backdrop-blur-lg border border-black/20 shadow-2xl">
          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-black/40 backdrop-blur-lg p-4 md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-white">
              Welcome to My Blog
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/70">
              Login or create a new account to access all features.
            </p>

            <Tabs defaultValue="login" className="w-full mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/80"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/80"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="my-8">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email" className="text-white/80">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      required 
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-primary focus:ring-primary backdrop-blur-sm"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="password" className="text-white/80">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      required 
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-primary focus:ring-primary backdrop-blur-sm"
                    />
                  </LabelInputContainer>

                  <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-primary to-emerald-400 font-medium text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] mb-4"
                    type="submit"
                  >
                    Login &rarr;
                    <BottomGradient />
                  </button>

                  <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <button
                    onClick={handleGoogleLogin}
                    className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-white/10 backdrop-blur-sm px-4 font-medium text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                    type="button"
                  >
                    <IconBrandGoogle className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/80">
                      Continue with Google
                    </span>
                    <BottomGradient />
                  </button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="my-8">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="name" className="text-white/80">Username</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      required 
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-primary focus:ring-primary backdrop-blur-sm"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email" className="text-white/80">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      required 
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-primary focus:ring-primary backdrop-blur-sm"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="password" className="text-white/80">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a password" 
                      required 
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-primary focus:ring-primary backdrop-blur-sm"
                    />
                  </LabelInputContainer>

                  <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-primary to-emerald-400 font-medium text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] mb-4"
                    type="submit"
                  >
                    Sign up &rarr;
                    <BottomGradient />
                  </button>

                  <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <button
                    onClick={handleGoogleLogin}
                    className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-white/10 backdrop-blur-sm px-4 font-medium text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                    type="button"
                  >
                    <IconBrandGoogle className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/80">
                      Sign up with Google
                    </span>
                    <BottomGradient />
                  </button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:text-primary font-medium transition-colors duration-300"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-black/20 shadow-2xl"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <nav className="relative rounded-full border border-black/20 bg-black/20 backdrop-blur-lg shadow-2xl flex justify-between items-center space-x-4 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-emerald-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-semibold text-white">My Blog</span>
        </div>
        <div className="animate-pulse h-8 w-24 bg-white/10 rounded-full"></div>
      </nav>
    );
  }

  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-black/20 bg-black/20 backdrop-blur-lg shadow-2xl flex justify-between items-center space-x-4 px-8 py-6"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-emerald-400 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-lg">B</span>
        </div>
        <Link href="/" className="text-xl font-semibold text-white hover:text-primary transition-colors duration-300">
          My Blog
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {children}
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-white/80 text-sm font-medium">
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
      </div>
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-white/80 hover:text-white transition-colors duration-300"
    >
      {children}
    </a>
  );
};
