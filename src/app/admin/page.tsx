'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, UserPlus, UserMinus, Search, Crown, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminGuard, AdminBadge } from '@/components/functions/AdminGuard'
import { useAuth } from '@/app/_contexts/Authcontext'
import Navbar from '@/components/functions/Navbar'
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Admin configuration - Only this email can be admin
const AUTHORIZED_ADMIN_EMAIL = 'debayudhbasu@gmail.com'

interface UserData {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  provider: string;
}

export default function AdminPanel() {
  const { user, checkAdminStatus } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, userEmail: string, currentStatus: boolean) => {
    // Prevent changes to the authorized admin email
    if (userEmail === AUTHORIZED_ADMIN_EMAIL) {
      alert("Cannot modify admin status for the system administrator!");
      return;
    }

    if (userId === user?.uid) {
      alert("You cannot change your own admin status!");
      return;
    }

    setUpdating(userId);
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        isAdmin: !currentStatus
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdmin: !currentStatus } : u
      ));

      // Refresh admin status for current user
      await checkAdminStatus();
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status');
    } finally {
      setUpdating(null);
    }
  };

  const isAuthorizedAdmin = (email: string) => email === AUTHORIZED_ADMIN_EMAIL;

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
              <AdminBadge />
            </div>

            {/* Admin Notice */}
            <motion.div 
              className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-400">System Administrator Notice</h3>
                  <p className="text-amber-200 mt-1">
                    Only <span className="font-bold">{AUTHORIZED_ADMIN_EMAIL}</span> has permanent admin privileges. 
                    This status cannot be changed by any user.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-primary text-sm font-medium">Admin Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {users.filter(u => u.isAdmin).length}
                    <span className="text-sm text-gray-400 ml-1">/ {users.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-300">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((userData, index) => (
                  <motion.div
                    key={userData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className={`bg-gradient-to-r from-gray-800/80 to-gray-900/80 border transition-all duration-300 ${
                      isAuthorizedAdmin(userData.email) 
                        ? 'border-amber-500/50 hover:border-amber-400/50' 
                        : 'border-gray-700/50 hover:border-primary/30'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isAuthorizedAdmin(userData.email)
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                                : userData.isAdmin 
                                  ? 'bg-gradient-to-r from-red-600 to-red-700' 
                                  : 'bg-gradient-to-r from-gray-600 to-gray-700'
                            }`}>
                              {isAuthorizedAdmin(userData.email) ? (
                                <Crown className="h-6 w-6 text-white" />
                              ) : userData.isAdmin ? (
                                <Crown className="h-6 w-6 text-white" />
                              ) : (
                                <span className="text-white font-bold text-lg">
                                  {userData.username.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {userData.username}
                                </h3>
                                {isAuthorizedAdmin(userData.email) && (
                                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                    System Admin
                                  </span>
                                )}
                                {userData.isAdmin && !isAuthorizedAdmin(userData.email) && <AdminBadge />}
                                {userData.id === user?.uid && (
                                  <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400">{userData.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-500">
                                  Joined: {new Date(userData.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  via {userData.provider}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {userData.id !== user?.uid && !isAuthorizedAdmin(userData.email) && (
                              <Button
                                onClick={() => toggleAdminStatus(userData.id, userData.email, userData.isAdmin)}
                                disabled={updating === userData.id}
                                variant={userData.isAdmin ? "destructive" : "default"}
                                className={
                                  userData.isAdmin
                                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                    : "bg-gradient-to-r from-primary to-emerald-400 text-black hover:from-emerald-400 hover:to-primary"
                                }
                              >
                                {updating === userData.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : userData.isAdmin ? (
                                  <>
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Remove Admin
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Make Admin
                                  </>
                                )}
                              </Button>
                            )}
                            {isAuthorizedAdmin(userData.email) && (
                              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg px-4 py-2">
                                <span className="text-amber-400 text-sm font-medium flex items-center gap-2">
                                  <Crown className="h-4 w-4" />
                                  System Admin - Protected
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No users found matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminGuard>
  );
}
