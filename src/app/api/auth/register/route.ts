import { NextRequest, NextResponse } from 'next/server';

// Mock user storage - In production, use proper database
const mockUsers: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // In production: hash this!
      name,
    };

    mockUsers.push(newUser);

    // Generate mock token
    const token = `token-${Date.now()}-${Math.random()}`;

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token,
      },
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
