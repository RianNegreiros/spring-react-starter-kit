import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authCookie = request.cookies.get('auth_token');

    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookie && { Cookie: `auth_token=${authCookie.value}` }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );
  }
}
