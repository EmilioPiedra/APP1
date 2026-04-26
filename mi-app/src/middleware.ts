// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. Empezamos a armar la respuesta
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Le damos al Middleware la capacidad de leer las cookies de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://build-placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Revisamos si el visitante tiene una sesión activa
  const { data: { user } } = await supabase.auth.getUser()

  // 4. LA REGLA DE ORO (Las paredes)
  // Si intentan entrar a cualquier ruta de /admin y no están logueados...
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    // Patada de regreso al login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 5. (Bono de usabilidad) Si YA estás logueado y por error vas a /login...
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    // Te metemos directo a tu panel para ahorrarte clics
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

// 6. ¿Dónde patrulla el guardia? 
// Le decimos que solo se active en /admin (y sus subcarpetas) y en /login
export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ],
}