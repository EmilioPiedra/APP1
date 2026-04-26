// src/app/actions/vendorActions.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// 1. Cliente Admin (Para guardar en la base de datos con permisos máximos)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createProduct(formData: FormData) {
  try {
    // 2. Cliente SSR (Para leer las cookies de Next.js y saber quién está logueado)
    const cookieStore = await cookies()
    const supabaseSSR = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Requerido por el tipo, aunque no siempre seteamos cookies aquí
          },
        },
      }
    )

    // 3. Verificamos quién hace la petición leyendo su sesión real del navegador
    const { data: { user }, error: authError } = await supabaseSSR.auth.getUser()
    
    if (authError || !user) {
      console.error("Error de Auth:", authError)
      return { success: false, error: 'Sesión no válida o expirada.' }
    }

    // 4. Buscamos SU tienda específica
    const { data: store, error: storeError } = await supabaseAdmin
      .from('stores')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (storeError || !store) {
      return { success: false, error: 'No tienes una tienda asignada.' }
    }

    // 5. Extraemos los datos del formulario
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const offer_price_raw = formData.get('offer_price')
    const offer_price = offer_price_raw ? parseFloat(offer_price_raw as string) : null
    const image_url = formData.get('image_url') as string

    // 6. Insertamos el producto
    const { error: insertError } = await supabaseAdmin.from('products').insert({
      store_id: store.id,
      name,
      description,
      price,
      offer_price,
      image_url
    })

    if (insertError) throw insertError

    // Refrescamos el panel del vendor
    revalidatePath('/vendor/dashboard')
    
    return { success: true, message: '¡Producto publicado con éxito!' }

  } catch (error: any) {
    console.error("Error al crear producto:", error)
    return { success: false, error: error.message || 'Error interno del servidor.' }
  }
}

export async function deleteProduct(productId: string) {
  try {
    const cookieStore = await cookies()
    const supabaseSSR = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: { user } } = await supabaseSSR.auth.getUser()
    if (!user) return { success: false, error: 'No autorizado' }

    // Obtenemos la tienda del usuario
    const { data: store } = await supabaseAdmin.from('stores').select('id').eq('owner_id', user.id).single()
    if (!store) return { success: false, error: 'Tienda no encontrada' }

    // 🔒 Mitigación Anti-BOLA: Borramos el producto SOLO si el store_id coincide con el del dueño
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .match({ id: productId, store_id: store.id })

    if (error) throw error

    revalidatePath('/vendor/dashboard')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const supabaseSSR = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: { user } } = await supabaseSSR.auth.getUser()
    if (!user) return { success: false, error: 'No autorizado' }

    const { data: store } = await supabaseAdmin.from('stores').select('id').eq('owner_id', user.id).single()
    if (!store) return { success: false, error: 'Tienda no encontrada' }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const offer_price_raw = formData.get('offer_price')
    const offer_price = offer_price_raw ? parseFloat(offer_price_raw as string) : null
    const image_url = formData.get('image_url') as string

    // 🔒 Actualizamos SOLO si le pertenece a su tienda
    const { error } = await supabaseAdmin
      .from('products')
      .update({ name, description, price, offer_price, image_url })
      .match({ id: productId, store_id: store.id })

    if (error) throw error

    revalidatePath('/vendor/dashboard')
    return { success: true, message: 'Producto actualizado' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}