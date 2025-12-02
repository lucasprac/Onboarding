/**
 * Tipos compartilhados para a aplicação
 */

export interface SelectOption {
  value: string
  label: string
}

export interface SurveyResponse {
  id: string
  surveyType: string
  office: string
  position: string
  responses: SurveyResponses
  createdAt: string
}

export interface SurveyResponses {
  nps?: string
  integration?: string
  manualWelcome?: string
  expectations?: string
  [key: string]: string | undefined
}

export interface DashboardStats {
  totalResponses: number
  averageNPS: number
  averageIntegration: number
  averageManual: number
  responsesByOffice: Record<string, number>
  responsesByPosition: Record<string, number>
}

export interface NPSClassification {
  label: string
  color: string
}

export interface FilterState {
  selectedOffices: string[]
  selectedPositions: string[]
  selectedSurveyTypes?: string[]
}

export type DashboardPeriod = '3days' | '15days' | '30days' | 'enps'