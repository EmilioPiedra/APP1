// src/app/vendor/products/[id]/edit/EditProductForm.tsx
'use client'

import { useState } from 'react'
import { updateProduct } from '@/app/actions/vendorActions'

export default function EditProductForm({ product }: { product: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const result = await updateProduct(product.id, formData)

    if (result.success) {
      setMessage({ text: result.message || 'Actualizado correctamente', type: 'success' })
    } else {
      setMessage({ text: result.error || 'Error al actualizar', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <>
      {message.text && (
        <div className={`p-4 mb-6 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'} text-sm font-medium flex items-center gap-3`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Nombre del Producto</label>
              <input type="text" name="name" defaultValue={product.name} required className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-zinc-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Precio Normal ($)</label>
              <input type="number" step="0.01" name="price" defaultValue={product.price} required className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-zinc-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Precio de Oferta ($)</label>
              <input type="number" step="0.01" name="offer_price" defaultValue={product.offer_price || ''} className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-emerald-900" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-2">URL de la Fotografía</label>
              <input type="url" name="image_url" defaultValue={product.image_url || ''} className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-zinc-900" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Descripción del Producto</label>
              <textarea name="description" rows={4} defaultValue={product.description || ''} className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 resize-none text-zinc-900"></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-50 flex justify-end">
            <button type="submit" disabled={loading} className="bg-zinc-900 text-white font-medium py-3.5 px-10 rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-70">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}