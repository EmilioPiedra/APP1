import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Obtenemos al usuario
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. REGLA PARA USUARIOS NO LOGUEADOS
  // Si no hay sesión e intenta entrar a áreas protegidas -> Al login
  if (!user && (path.startsWith('/admin') || path.startsWith('/vendor'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. REGLA PARA USUARIOS LOGUEADOS (Evitar bucles y redirigir por rol)
  if (user) {
    // Consultamos el rol solo si es necesario (cuando está en login o en el área contraria)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const role = profile?.role

    // Si ya está logueado e intenta ir al /login -> Redirigir a su panel correspondiente
    if (path === '/login') {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
      return NextResponse.redirect(new URL('/vendor/dashboard', request.url))
    }

    // Protección cruzada: Si es vendor e intenta entrar a /admin
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/vendor/dashboard', request.url))
    }

    // Protección cruzada: Si es admin e intenta entrar a /vendor
    if (path.startsWith('/vendor') && role !== 'vendor') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}

// Actualizamos el matcher para incluir las rutas de vendor
export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*',
    '/login'
  ],
}