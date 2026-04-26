// app/(admin)/stores/new/page.tsx
'use client'

import { useState } from 'react'
import { createTenantStore } from '@/../actions/adminActions'

export default function NewStoreForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    
    // Llamamos al Server Action
    const result = await createTenantStore(formData)

    if (result.success) {
      setMessage('✅ ' + result.message)
      e.currentTarget.reset() // Limpiamos el formulario
    } else {
      setMessage('❌ Error: ' + result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nueva Tienda</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre Completo del Cliente</label>
          <input type="text" name="fullName" required className="w-full p-2 border rounded" placeholder="Juan Pérez" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input type="email" name="email" required className="w-full p-2 border rounded" placeholder="juan@correo.com" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña Inicial</label>
          <input type="text" name="password" required className="w-full p-2 border rounded" placeholder="Temporal123!" />
          <p className="text-xs text-gray-500 mt-1">Debe tener al menos 6 caracteres.</p>
        </div>

        <hr className="my-4" />

        <div>
          <label className="block text-sm font-medium mb-1">Nombre de la Tienda</label>
          <input type="text" name="storeName" required className="w-full p-2 border rounded" placeholder="Tecno Ventas" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input type="text" name="slug" required className="w-full p-2 border rounded" placeholder="tecno-ventas" />
          <p className="text-xs text-gray-500 mt-1">Sin espacios, solo minúsculas y guiones.</p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creando infraestructura...' : 'Crear Tienda y Usuario'}
        </button>
      </form>
    </div>
  )
}