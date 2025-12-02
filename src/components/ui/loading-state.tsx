/**
 * Componente de estado de carregamento reutilizável
 */

import { Loader2 } from 'lucide-react'
import { TEXTS } from '@/constants'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ 
  message = TEXTS.LOADING, 
  size = 'md',
  className = '' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-16',
    md: 'h-64',
    lg: 'h-96'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={`animate-spin ${iconSizes[size]}`} />
        <div className={textSizes[size]}>{message}</div>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ message, onRetry, className = '' }: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
      <div className="text-lg text-red-500 mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  message?: string
  className?: string
}

export function EmptyState({ 
  message = TEXTS.NO_DATA, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="text-lg text-gray-500">{message}</div>
    </div>
  )
}