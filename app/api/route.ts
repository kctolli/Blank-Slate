import { NextResponse } from 'next/server';

// This handles the GET request (e.g., when you visit the URL in your browser)
export async function GET() {
  return NextResponse.json({ 
    status: "success", 
    message: "API is online",
    timestamp: new Date().toISOString()
  });
}
