// src/app/vendor/products/new/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createProduct } from '@/app/actions/vendorActions'

export default function NewProductForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const result = await createProduct(formData)

    if (result.success) {
      setMessage({ text: result.message || 'Operación exitosa', type: 'success' })
      form.reset() 
    } else {
      setMessage({ text: result.error || 'Error al guardar', type: 'error' })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navegación y Cabecera */}
        <div className="mb-8">
          <Link href="/vendor/dashboard" className="text-zinc-400 hover:text-zinc-900 text-sm font-medium transition-colors mb-6 inline-flex items-center gap-2">
            <span>←</span> Volver a mi panel
          </Link>
          <h1 className="text-3xl font-light text-zinc-900 tracking-tight">Agregar <span className="font-medium">Producto</span></h1>
          <p className="text-zinc-500 text-sm mt-2">Sube un nuevo artículo al catálogo de tu tienda.</p>
        </div>

        {/* Alertas */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'} text-sm font-medium flex items-center gap-3`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        {/* Tarjeta del Formulario */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Nombre del Producto</label>
                <input type="text" name="name" required 
                  className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                  placeholder="Ej. Zapatillas Urbanas Modelo X" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Precio Normal ($)</label>
                <input type="number" step="0.01" name="price" required 
                  className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                  placeholder="49.99" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Precio de Oferta ($) <span className="text-zinc-400 font-normal">(Opcional)</span></label>
                <input type="number" step="0.01" name="offer_price" 
                  className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-emerald-900 placeholder:text-emerald-300" 
                  placeholder="39.99" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">URL de la Fotografía</label>
                <input type="url" name="image_url" 
                  className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400" 
                  placeholder="https://ejemplo.com/imagen.jpg" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Descripción del Producto</label>
                <textarea name="description" rows={4} 
                  className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400 resize-none" 
                  placeholder="Detalla las características, materiales, tallas disponibles..."></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-50">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto md:px-10 float-right bg-zinc-900 text-white font-medium py-3.5 px-4 rounded-xl hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 transition-all disabled:opacity-70 flex justify-center items-center shadow-sm"
              >
                {loading ? 'Publicando...' : 'Publicar Producto'}
              </button>
              <div className="clear-both"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}