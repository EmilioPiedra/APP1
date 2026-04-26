'use client'

import { useState } from 'react'
import { createTenantStore } from '@/app/actions/adminActions'
import Link from 'next/link'

export default function NewStoreForm() {
  const [loading, setLoading] = useState(false)
  // Cambiamos el estado para manejar mejor el tipo de mensaje (éxito o error)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const result = await createTenantStore(formData)

    if (result.success) {
      // Agregamos ?? '' para asegurar que siempre sea un string
      setMessage({ text: result.message ?? 'Tienda creada exitosamente', type: 'success' })
      form.reset() 
    } else {
      // Agregamos ?? '' para asegurar que siempre sea un string
      setMessage({ text: result.error ?? 'Error desconocido en el servidor', type: 'error' })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Navegación y Cabecera */}
        <div className="mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-zinc-900 text-sm font-medium transition-colors mb-6 inline-flex items-center gap-2">
            <span>←</span> Volver al panel
          </Link>
          <h1 className="text-3xl font-light text-zinc-900 tracking-tight">Nueva <span className="font-medium">Infraestructura</span></h1>
          <p className="text-zinc-500 text-sm mt-2">Registra un nuevo inquilino y configura su ecosistema inicial.</p>
        </div>

        {/* Mensaje de Alerta Moderno */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'} text-sm font-medium flex items-center gap-3`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        {/* Tarjeta del Formulario */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Sección 1: Datos del Dueño */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-5 pb-3 border-b border-zinc-50">
                Credenciales del Propietario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Nombre Completo</label>
                  <input type="text" name="fullName" required 
                    className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                    placeholder="Ej. Juan Pérez" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Correo Electrónico</label>
                  <input type="email" name="email" required 
                    className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                    placeholder="juan@correo.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Contraseña Inicial</label>
                  <input type="text" name="password" required minLength={6}
                    className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                    placeholder="Temporal123!" />
                </div>
              </div>
            </div>

            {/* Sección 2: Datos de la Tienda */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-5 pb-3 border-b border-zinc-50">
                Configuración del Entorno
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Nombre de la Tienda</label>
                  <input type="text" name="storeName" required 
                    className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                    placeholder="Ej. Tecno Ventas" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Identificador (Slug)</label>
                  <div className="flex shadow-sm rounded-xl">
                    <input type="text" name="slug" required pattern="[a-z0-9\-]+" title="Solo letras minúsculas, números y guiones"
                      className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 border-r-0 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400 z-10" 
                      placeholder="tecno-ventas" />
                    <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-zinc-200 bg-zinc-100/50 text-zinc-500 text-sm">
                      .tudominio.com
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Solo minúsculas y guiones. Sin espacios.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-zinc-900 text-white font-medium py-3.5 px-4 rounded-xl hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 transition-all disabled:opacity-70 flex justify-center items-center shadow-sm"
              >
                {loading ? (
                  <>
                    {/* Spinner SVG */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Desplegando ecosistema...
                  </>
                ) : 'Crear Tienda y Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}