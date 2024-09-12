import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';
import { ObjectId } from 'mongodb';

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogposts');

    const blogData = await request.json();
    console.log('Received blog post data:', blogData);

    const result = await collection.insertOne(blogData);
    console.log('Inserted blog post with ID:', result.insertedId);

    return NextResponse.json({ message: 'Blog post saved successfully', id: result.insertedId }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Failed to save blog post', error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogposts');

    const posts = await collection.find().limit(10).toArray();
    console.log('Retrieved posts:', posts);

    return NextResponse.json({ message: 'Posts retrieved successfully', posts }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ message: 'Failed to retrieve posts', error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogposts');

    const { id, ...updateData } = await request.json();
    console.log('Updating blog post with ID:', id);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog post updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in PUT handler:', error);
    return NextResponse.json({ message: 'Failed to update blog post', error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogposts');

    const { id } = await request.json();
    console.log('Deleting blog post with ID:', id);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json({ message: 'Failed to delete blog post', error: getErrorMessage(error) }, { status: 500 });
  }
}