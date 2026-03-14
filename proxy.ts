import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const playerId = request.cookies.get('player_id')?.value;
  const isGamePage = pathname.startsWith('/game');

  if (isGamePage && !playerId) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('callback', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/:path*'],
};

export default proxy;
