// src/app/vendor/products/[id]/edit/page.tsx
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import EditProductForm from './EditProductForm'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Vista de Servidor: Busca los datos actuales del producto antes de mostrar el formulario
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    redirect('/vendor/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/vendor/dashboard" className="text-zinc-400 hover:text-zinc-900 text-sm font-medium transition-colors mb-6 inline-flex items-center gap-2">
            <span>←</span> Volver a mi panel
          </Link>
          <h1 className="text-3xl font-light text-zinc-900 tracking-tight">Editar <span className="font-medium">Producto</span></h1>
        </div>
        
        {/* Pasamos los datos del producto al componente de cliente */}
        <EditProductForm product={product} />
      </div>
    </div>
  )
}