// /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongo'; // Adjust path according to your project structure

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key'; // Use env variable for the secret

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json(); // Parse the JSON request body

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: '30d', // Token expiration
    });

    return NextResponse.json({ success: true, user: user.email, token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
