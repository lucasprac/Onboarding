'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirecionar para a página de boas-vindas
    window.location.href = '/welcome'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecionando...</div>
    </div>
  )
}