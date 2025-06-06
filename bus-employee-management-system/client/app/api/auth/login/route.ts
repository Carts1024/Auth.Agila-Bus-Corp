import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const gatewayRes = await fetch(`${GATEWAY_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseBody = await gatewayRes.text();
  const response = new NextResponse(responseBody, {
    status: gatewayRes.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Forward ALL cookie headers
  const cookies = gatewayRes.headers.getSetCookie();
  if (cookies && cookies.length > 0) {
    cookies.forEach(cookie => {
      response.headers.append('set-cookie', cookie);
    });
  } else {
  }

  return response;
}
