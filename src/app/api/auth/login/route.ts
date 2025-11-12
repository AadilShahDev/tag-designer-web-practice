import { NextRequest, NextResponse } from 'next/server';

// Mock authentication - In production, use proper auth with password hashing
const mockUsers = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    password: 'demo123', // In production: hash this!
    name: 'Demo User',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate mock token (in production, use proper JWT)
    const token = `token-${Date.now()}-${Math.random()}`;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
