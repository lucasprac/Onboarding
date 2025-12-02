/**
 * Utilitários compartilhados da aplicação
 */

import { 
  SurveyResponse, 
  DashboardStats, 
  NPSClassification,
  FilterState 
} from '@/types'
import { 
  NPS_THRESHOLDS, 
  NPS_CLASSIFICATIONS, 
  SCALES 
} from '@/constants'

/**
 * Classifica uma pontuação NPS
 */
export const getNPSClassification = (score: number): NPSClassification => {
  if (score >= NPS_THRESHOLDS.PROMOTER) {
    return NPS_CLASSIFICATIONS.PROMOTER
  }
  if (score >= NPS_THRESHOLDS.NEUTRAL) {
    return NPS_CLASSIFICATIONS.NEUTRAL
  }
  return NPS_CLASSIFICATIONS.DETRACTOR
}

/**
 * Calcula estatísticas do dashboard
 */
export const calculateDashboardStats = (
  responses: SurveyResponse[]
): DashboardStats => {
  if (responses.length === 0) {
    return {
      totalResponses: 0,
      averageNPS: 0,
      averageIntegration: 0,
      averageManual: 0,
      responsesByOffice: {},
      responsesByPosition: {}
    }
  }

  const totalNPS = responses.reduce(
    (sum, r) => sum + parseInt(r.responses.nps || '0'), 
    0
  )
  
  const totalIntegration = responses.reduce(
    (sum, r) => sum + parseInt(r.responses.integration || '0'), 
    0
  )
  
  const totalManual = responses.reduce(
    (sum, r) => sum + parseInt(r.responses.manualWelcome || '0'), 
    0
  )

  const responsesByOffice = responses.reduce((acc, r) => {
    acc[r.office] = (acc[r.office] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const responsesByPosition = responses.reduce((acc, r) => {
    acc[r.position] = (acc[r.position] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalResponses: responses.length,
    averageNPS: totalNPS / responses.length,
    averageIntegration: totalIntegration / responses.length,
    averageManual: totalManual / responses.length,
    responsesByOffice,
    responsesByPosition
  }
}

/**
 * Filtra respostas com base nos filtros selecionados
 */
export const filterResponses = (
  responses: SurveyResponse[], 
  filters: FilterState
): SurveyResponse[] => {
  let filtered = responses

  if (filters.selectedOffices.length > 0) {
    filtered = filtered.filter(r => filters.selectedOffices.includes(r.office))
  }

  if (filters.selectedPositions.length > 0) {
    filtered = filtered.filter(r => filters.selectedPositions.includes(r.position))
  }

  if (filters.selectedSurveyTypes && filters.selectedSurveyTypes.length > 0) {
    filtered = filtered.filter(r => filters.selectedSurveyTypes.includes(r.surveyType))
  }

  return filtered
}

/**
 * Formata data para exibição
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

/**
 * Formata texto truncando com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Formata nome do cargo para exibição
 */
export const formatPositionName = (position: string): string => {
  return position.replace('cargo', 'Cargo ')
}

/**
 * Formata nome da sede para exibição
 */
export const formatOfficeName = (office: string): string => {
  return office.replace('sede', 'Sede ')
}

/**
 * Calcula percentual
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Valida se uma pontuação está dentro da escala
 */
export const isValidScore = (
  score: string | undefined, 
  scale: keyof typeof SCALES
): boolean => {
  if (!score) return false
  const numScore = parseInt(score)
  const scaleConfig = SCALES[scale]
  return numScore >= scaleConfig.min && numScore <= scaleConfig.max
}

/**
 * Gera texto de resultados filtrados
 */
export const getFilterResultsText = (
  filteredCount: number, 
  totalCount: number
): string => {
  return `Mostrando ${filteredCount} de ${totalCount} respostas`
}