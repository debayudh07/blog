// This is a utility script to manually set admin users
// Run this in the browser console or as a Node.js script

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Admin configuration - Only this email can be admin
const ADMIN_EMAIL = 'debayudhbasu@gmail.com';

/**
 * Check if an email is authorized to be admin
 * @param email - The email to check
 * @returns boolean
 */
export const isAuthorizedAdmin = (email: string): boolean => {
  return email === ADMIN_EMAIL;
};

/**
 * Function to set debayudhbasu@gmail.com as admin (automatic)
 * This function ensures the designated admin email has admin privileges
 * @param userEmail - The user's email to verify
 * @param userId - The Firebase UID of the user
 * @returns Promise<boolean> - Returns true if user was set as admin
 */
export const ensureAdminPrivileges = async (userEmail: string, userId: string): Promise<boolean> => {
  if (!isAuthorizedAdmin(userEmail)) {
    console.log(`Email ${userEmail} is not authorized for admin privileges`);
    return false;
  }

  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      isAdmin: true,
      adminSince: new Date().toISOString()
    });
    console.log(`Admin privileges confirmed for ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error setting admin privileges:', error);
    throw error;
  }
};

/**
 * Function to remove admin privileges (only works for non-authorized emails)
 * The designated admin email cannot have privileges removed
 * @param userEmail - The user's email
 * @param userId - The Firebase UID of the user to remove admin from
 * @returns Promise<void>
 */
export const removeUserAdmin = async (userEmail: string, userId: string): Promise<void> => {
  if (isAuthorizedAdmin(userEmail)) {
    console.log(`Cannot remove admin privileges from authorized admin: ${userEmail}`);
    return;
  }

  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      isAdmin: false
    });
    console.log(`Admin privileges removed from user ${userEmail}`);
  } catch (error) {
    console.error('Error removing admin privileges:', error);
    throw error;
  }
};

// Example usage (automatic for debayudhbasu@gmail.com):
// When debayudhbasu@gmail.com logs in, they automatically get admin privileges

// Instructions:
// 1. Only debayudhbasu@gmail.com can be admin
// 2. Admin privileges are automatically granted when this email logs in
// 3. Other users cannot create posts or delete posts
// 4. The system automatically ensures the authorized email has admin privileges
