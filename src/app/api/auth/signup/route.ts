// /app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongo'; // Adjust the path according to your project structure

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json(); // Parse the JSON request body

    const { db } = await connectToDatabase();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, user: email }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
