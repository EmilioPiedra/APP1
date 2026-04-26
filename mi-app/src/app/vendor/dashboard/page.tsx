import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
import LogoutButton from "../../admin/LogoutButton"
import DeleteProductButton from './DeleteProductButton'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simulamos obtener el usuario actual (En tu app real esto viene de auth.getUser())
// Por ahora buscaremos la primera tienda para que veas el diseño
export default async function VendorDashboard() {
  // 1. Obtener la tienda del vendor actual
  const { data: stores } = await supabaseAdmin.from('stores').select('*').limit(1)
  const myStore = stores?.[0]

  if (!myStore) {
    return <div className="p-10 text-center">No tienes una tienda asignada.</div>
  }

  // 2. Obtener productos de esta tienda
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('store_id', myStore.id)
    .order('created_at', { ascending: false })

  // 3. Calcular Top Productos (Ejemplo rápido)
  const topSearched = products ? [...products].sort((a, b) => b.search_count - a.search_count).slice(0, 3) : []

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-2">Mi Tienda</p>
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">{myStore.name}</h1>
          </div>
          <Link href="/vendor/products/new" className="bg-zinc-900 text-zinc-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm">
            + Nuevo Producto
          </Link>
        </header>
        <LogoutButton />
        {/* Panel de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-zinc-400 text-sm font-medium mb-1">Total Productos</h3>
            <p className="text-3xl font-light text-zinc-900">{products?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm md:col-span-2">
            <h3 className="text-zinc-400 text-sm font-medium mb-3">🔥 Más Buscados</h3>
            <div className="flex gap-4">
              {topSearched.map(p => (
                <div key={p.id} className="bg-zinc-50 px-4 py-2 rounded-lg text-sm border border-zinc-100 flex-1">
                  <span className="font-medium text-zinc-800 block truncate">{p.name}</span>
                  <span className="text-zinc-400 text-xs">{p.search_count} búsquedas</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-50 bg-zinc-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Precio Normal</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Precio Oferta</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products?.map((product) => (
                <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{product.name}</div>
                    <div className="text-zinc-400 text-xs mt-1 truncate max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">${product.price}</td>
                  <td className="px-6 py-4">
                    {product.offer_price ? (
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                        ${product.offer_price}
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link href={`/vendor/products/${product.id}/edit`} className="text-zinc-400 hover:text-blue-600 text-sm font-medium transition-colors">
                      Editar
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products?.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-sm">
              Tu inventario está vacío. Agrega tu primer producto.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}