import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const gatewayRes = await fetch(`${GATEWAY_URL}/auth/request-password-reset`, {
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

  return response;
}
