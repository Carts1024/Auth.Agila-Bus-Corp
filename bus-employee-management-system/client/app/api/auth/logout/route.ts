// /api/auth/logout
import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  const gatewayRes = await fetch(`${GATEWAY_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  const response = new NextResponse(await gatewayRes.text(), {
    status: gatewayRes.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Forward all set-cookie headers
  const cookies = gatewayRes.headers.getSetCookie();
  if (cookies && cookies.length > 0) {
    cookies.forEach(cookie => {
      response.headers.append('set-cookie', cookie);
    });
  }

  return response;
}