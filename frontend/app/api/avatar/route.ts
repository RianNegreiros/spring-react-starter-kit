import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authCookie = request.cookies.get('auth_token');

    const response = await fetch(`${BACKEND_URL}/api/avatar`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(authCookie && { Cookie: `auth_token=${authCookie.value}` }),
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_token');

    const response = await fetch(`${BACKEND_URL}/api/avatar`, {
      method: 'DELETE',
      headers: {
        ...(authCookie && { Cookie: `auth_token=${authCookie.value}` }),
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
