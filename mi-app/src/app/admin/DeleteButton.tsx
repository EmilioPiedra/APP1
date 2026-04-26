'use client'

import { deleteTenant } from '@/app/actions/adminActions'
import { useState } from 'react'

export default function DeleteButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro? Se borrará la tienda, el dueño y todos sus datos.')) return

    setLoading(true)
    const result = await deleteTenant(userId)
    if (!result.success) alert('Error: ' + result.error)
    setLoading(false)
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 transition-colors text-sm font-medium disabled:opacity-50"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}