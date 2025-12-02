/**
 * Hook personalizado para gerenciar dados de pesquisas
 */

import { useState, useEffect } from 'react'
import { SurveyResponse, FilterState, DashboardStats } from '@/types'
import { filterResponses, calculateDashboardStats } from '@/utils'

interface UseSurveyDataOptions {
  endpoint: string
  initialFilters?: Partial<FilterState>
}

interface UseSurveyDataReturn {
  responses: SurveyResponse[]
  filteredResponses: SurveyResponse[]
  stats: DashboardStats
  filters: FilterState
  loading: boolean
  error: string | null
  setFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void
  refetch: () => Promise<void>
}

export const useSurveyData = ({
  endpoint,
  initialFilters = {}
}: UseSurveyDataOptions): UseSurveyDataReturn => {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<FilterState>({
    selectedOffices: [],
    selectedPositions: [],
    selectedSurveyTypes: [],
    ...initialFilters
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`)
      }
      
      const data = await response.json()
      setResponses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Error fetching survey data:', err)
    } finally {
      setLoading(false)
    }
  }

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFiltersState({
      selectedOffices: [],
      selectedPositions: [],
      selectedSurveyTypes: []
    })
  }

  const refetch = async () => {
    await fetchData()
  }

  // Efeito para buscar dados iniciais
  useEffect(() => {
    fetchData()
  }, [endpoint])

  // Efeito para aplicar filtros
  useEffect(() => {
    const filtered = filterResponses(responses, filters)
    setFilteredResponses(filtered)
  }, [responses, filters])

  // Calcular estatísticas
  const stats = calculateDashboardStats(filteredResponses)

  return {
    responses,
    filteredResponses,
    stats,
    filters,
    loading,
    error,
    setFilters,
    clearFilters,
    refetch
  }
}