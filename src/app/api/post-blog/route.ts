import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(request: NextRequest) {
  try {
    const blogData = await request.json();
    console.log('Received blog post data:', blogData);

    // Add timestamp
    const blogPost = {
      ...blogData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'blogposts'), blogPost);
    console.log('Inserted blog post with ID:', docRef.id);

    return NextResponse.json({ message: 'Blog post saved successfully', id: docRef.id }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Failed to save blog post', error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');
    const limitParam = searchParams.get('limit');
    
    // If postId is provided, fetch a single post
    if (postId) {
      const docRef = doc(db, 'blogposts', postId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }
      
      const post = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      console.log('Retrieved single post:', post.id);
      return NextResponse.json({ message: 'Post retrieved successfully', post }, { status: 200 });
    }
    
    let q;
    if (userId) {
      // Get posts by specific user
      q = query(
        collection(db, 'blogposts'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitParam ? parseInt(limitParam) : 10)
      );
    } else {
      // Get all posts
      q = query(
        collection(db, 'blogposts'),
        orderBy('createdAt', 'desc'),
        limit(limitParam ? parseInt(limitParam) : 10)
      );
    }

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Retrieved posts:', posts.length);

    return NextResponse.json({ message: 'Posts retrieved successfully', posts }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ message: 'Failed to retrieve posts', error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    console.log('Updating blog post with ID:', id);

    // Add updated timestamp
    const updatedPost = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const docRef = doc(db, 'blogposts', id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    await updateDoc(docRef, updatedPost);

    return NextResponse.json({ message: 'Blog post updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in PUT handler:', error);
    return NextResponse.json({ message: 'Failed to update blog post', error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    console.log('Deleting blog post with ID:', id);

    const docRef = doc(db, 'blogposts', id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json({ message: 'Failed to delete blog post', error: getErrorMessage(error) }, { status: 500 });
  }
}