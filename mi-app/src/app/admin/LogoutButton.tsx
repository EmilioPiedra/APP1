// src/app/admin/LogoutButton.tsx
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://build-placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-placeholder-key'
  )

  const handleLogout = async () => {
    setLoading(true)
    // Esto destruye la sesión y limpia las cookies en el navegador
    await supabase.auth.signOut() 
    
    // Forzamos la recarga hacia el login para que el Middleware confirme la salida
    router.push('/login')
    router.refresh() 
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="text-zinc-400 hover:text-red-500 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? 'Saliendo...' : 'Cerrar Sesión'}
    </button>
  )
}