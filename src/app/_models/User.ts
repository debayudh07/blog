// Firebase Firestore types for User
export interface FirebaseUser {
  uid: string; // Firebase Auth UID
  username: string;
  email: string;
  createdAt: string; // ISO string
  photoURL?: string; // Profile picture URL
  provider?: 'email' | 'google'; // Authentication provider
}

// Type for creating a new user document in Firestore
export interface CreateFirebaseUser {
  username: string;
  email: string;
  createdAt: string;
  photoURL?: string;
  provider?: 'email' | 'google';
}

// Type for updating user information
export interface UpdateFirebaseUser {
  username?: string;
  photoURL?: string;
}
