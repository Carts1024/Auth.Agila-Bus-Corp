/* eslint-disable @typescript-eslint/no-unused-vars */
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

  // Try to extract token from response body
  let token: string | undefined;
  try {
    const parsed = JSON.parse(responseBody);
    token = parsed.token;
  } catch (e) {
    token = undefined;
  }

  // // Set JWT as HTTP-only cookie for all subdomains if present
  // if (token) {
  //   response.cookies.set('jwt', token, {
  //     httpOnly: true,
  //     secure: true,
  //     path: '/',
  //     sameSite: 'lax', // or 'none' if needed for cross-site
  //     domain: '.agilabuscorp.me', // Makes cookie available to all subdomains
  //     maxAge: 60 * 60 * 24, // 1 day
  //   });
  // }

  // Forward ALL cookie headers from gateway (optional, if needed)
  const cookies = gatewayRes.headers.getSetCookie();
  if (cookies && cookies.length > 0) {
    cookies.forEach(cookie => {
      response.headers.append('set-cookie', cookie);
    });
  }

  return response;
}
