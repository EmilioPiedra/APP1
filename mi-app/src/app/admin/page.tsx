// src/app/admin/page.tsx
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import LogoutButton from './LogoutButton'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminDashboard() {
  const { data: stores } = await supabaseAdmin
    .from('stores')
    .select('*, profiles(id, full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Superior */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-2">Plataforma</p>
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">Gestión de <span className="font-medium">Tiendas</span></h1>
          </div>
          <Link 
            href="/admin/stores/new" 
            className="bg-zinc-900 text-zinc-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm"
          >
            Nueva Infraestructura
          </Link>
        </header>

        {/* Lista de Tiendas */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-50">
                  <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Identidad / Slug</th>
                  <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Dueño</th>
                  <th className="px-8 py-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 text-black">
                {stores?.map((store) => (
                  <tr key={store.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-medium text-zinc-900">{store.name}</div>
                      <div className="text-zinc-400 text-sm font-mono mt-1">{store.slug}.tudominio.com</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-zinc-600 text-sm">
                        {/* @ts-ignore */}
                        {store.profiles?.full_name || 'Sin nombre'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right space-x-6">
                      <button className="text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-medium">Editar</button>
                      {/* @ts-ignore */}
                      <DeleteButton userId={store.profiles?.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {stores?.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-400 italic text-sm">No hay ecosistemas activos actualmente.</p>
            </div>
          )}
        </div>
        <LogoutButton />
        {/* Footer de Estado */}
        <footer className="mt-8 flex justify-between items-center px-2">
          <p className="text-zinc-400 text-xs italic">
            Total de despliegues: <span className="text-zinc-900 font-medium">{stores?.length || 0}</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-zinc-400 text-xs font-medium">Sistemas Operativos</p>
          </div>
        </footer>
      </div>
    </div>
  )
}