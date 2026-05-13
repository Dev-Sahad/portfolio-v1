import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Note: No more import from @/utils/supabase/middleware

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Create the initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. Protect Routes
  
  // If user is logged in and tries to access home, go to dashboard
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If no user and trying to access protected pages (not home or auth), go to home
  if (!user && pathname !== '/' && !pathname.startsWith('/auth')) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (internal APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
