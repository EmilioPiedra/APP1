// app/actions/adminActions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// 1. Definimos el tipo de respuesta para que TypeScript no se queje en el frontend
type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
}

// En src/app/actions/adminActions.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://build-placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export async function createTenantStore(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const storeName = formData.get('storeName') as string
  const slug = formData.get('slug') as string

  try {
    // 1. Crear el usuario en auth.users (Admin API)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }
    
    const userId = authData.user.id

    // 2. Registrar el perfil (Tabla profiles)
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      full_name: fullName,
      role: 'vendor'
    })

    if (profileError) {
      // Rollback: Borramos el usuario si falla la creación del perfil
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return { success: false, error: `Error en Perfil: ${profileError.message}` }
    }

    // 3. Crear la tienda (Tabla stores)
    const { error: storeError } = await supabaseAdmin.from('stores').insert({
      owner_id: userId,
      name: storeName,
      slug: slug
    })

    if (storeError) {
      // Rollback: Borramos el usuario si falla la creación de la tienda
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return { success: false, error: `Error en Tienda: ${storeError.message}` }
    }

    // Refrescamos la ruta del panel para que aparezca la nueva tienda
    revalidatePath('/admin')
    
    return { 
      success: true, 
      message: 'Tienda y usuario creados con éxito.' 
    }

  } catch (error: any) {
    console.error("Fallo al crear tenant:", error)
    return { 
      success: false, 
      error: error.message || 'Ocurrió un error inesperado en el servidor.' 
    }
  }
}

export async function deleteTenant(userId: string) {
  try {
    // 1. Al borrar el usuario de Auth con la Admin API, 
    // el ON DELETE CASCADE que pusimos en SQL se encargará de 
    // borrar automáticamente su perfil y sus tiendas.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) throw error

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar tenant:", error)
    return { success: false, error: error.message }
  }
}