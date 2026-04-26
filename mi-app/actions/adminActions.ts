// app/actions/adminActions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Inicializamos el cliente de Supabase con permisos de administrador
// ¡OJO! Usamos el SERVICE_ROLE_KEY, no el ANON_KEY
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function createTenantStore(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const storeName = formData.get('storeName') as string
  const slug = formData.get('slug') as string

  try {
    // 1. Crear el usuario en auth.users (Admin API)
    // Esto crea el usuario SIN loguearlo en la sesión actual
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirmamos para que puedan entrar de una vez
    })

    if (authError) throw new Error(`Error en Auth: ${authError.message}`)
    
    const userId = authData.user.id

    // 2. Registrar el perfil (Tabla profiles)
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      full_name: fullName,
      role: 'vendor'
    })

    if (profileError) {
      // Rollback manual: Si falla el perfil, borramos el usuario para no dejar basura
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw new Error(`Error en Perfil: ${profileError.message}`)
    }

    // 3. Crear la tienda (Tabla stores)
    const { error: storeError } = await supabaseAdmin.from('stores').insert({
      owner_id: userId,
      name: storeName,
      slug: slug
    })

    if (storeError) {
      // Rollback manual
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw new Error(`Error en Tienda: ${storeError.message}`)
    }

    // Si todo salió bien, refrescamos la página para ver la nueva tienda
    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Tienda y usuario creados con éxito.' }

  } catch (error: any) {
    console.error("Fallo al crear tenant:", error)
    return { success: false, error: error.message }
  }
}