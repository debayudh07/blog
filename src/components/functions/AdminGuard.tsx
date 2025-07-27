'use client'

import { useAuth } from '@/app/_contexts/Authcontext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft } from 'lucide-react'

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const AdminGuard = ({ children, fallback, redirectTo = '/' }: AdminGuardProps) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl">Checking permissions...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
            <ShieldX className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 text-lg mb-6">
              You need administrator privileges to access this page.
            </p>
            <Button 
              onClick={() => router.push(redirectTo)} 
              className="bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary transition-all duration-300 font-medium px-6 py-3 shadow-lg hover:shadow-primary/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminOnly = ({ children, fallback = null }: AdminOnlyProps) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Admin Badge Component
export const AdminBadge = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
    >
      <ShieldX className="h-3 w-3 mr-1" />
      Admin
    </motion.div>
  );
};
