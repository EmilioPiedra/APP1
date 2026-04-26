// src/app/vendor/dashboard/DeleteProductButton.tsx
'use client'

import { useState } from 'react'
import { deleteProduct } from '@/app/actions/vendorActions'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return

    setIsDeleting(true)
    const result = await deleteProduct(productId)
    
    if (!result.success) {
      alert(result.error)
      setIsDeleting(false)
    }
    // Si tiene éxito, Next.js revalidará la ruta automáticamente gracias al revalidatePath
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-zinc-400 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Borrando...' : 'Borrar'}
    </button>
  )
}