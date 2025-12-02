/**
 * Constantes compartilhadas da aplicação
 */

import { SelectOption } from '@/types'

// Opções para filtros
export const OFFICE_OPTIONS: SelectOption[] = [
  { value: 'sede1', label: 'Sede 1' },
  { value: 'sede2', label: 'Sede 2' },
  { value: 'sede3', label: 'Sede 3' }
]

export const POSITION_OPTIONS: SelectOption[] = [
  { value: 'cargo1', label: 'Cargo 1' },
  { value: 'cargo2', label: 'Cargo 2' },
  { value: 'cargo3', label: 'Cargo 3' }
]

export const SURVEY_TYPE_OPTIONS: SelectOption[] = [
  { value: '3days', label: '3 Dias' },
  { value: '15days', label: '15 Dias' },
  { value: '30days', label: '30 Dias' },
  { value: 'enps', label: 'eNPS' }
]

// Configurações de NPS
export const NPS_THRESHOLDS = {
  PROMOTER: 9,
  NEUTRAL: 7,
  DETRACTOR: 0
} as const

export const NPS_CLASSIFICATIONS = {
  PROMOTER: { label: 'Promotores', color: 'bg-green-500' },
  NEUTRAL: { label: 'Neutros', color: 'bg-yellow-500' },
  DETRACTOR: { label: 'Detratores', color: 'bg-red-500' }
} as const

// Configurações de escalas
export const SCALES = {
  NPS: { min: 0, max: 10 },
  INTEGRATION: { min: 1, max: 5 },
  MANUAL: { min: 1, max: 5 }
} as const

// Textos padrão
export const TEXTS = {
  LOADING: 'Carregando dados...',
  FILTERS: 'Filtros',
  CLEAR_FILTERS: 'Limpar filtros',
  SELECT_ALL: 'Todas as opções',
  NO_DATA: 'Nenhum dado encontrado',
  SHOWING_RESULTS: 'Mostrando {filtered} de {total} respostas'
} as const

// Placeholders
export const PLACEHOLDERS = {
  OFFICE: 'Todas as sedes',
  POSITION: 'Todos os cargos',
  SURVEY_TYPE: 'Todos os tipos',
  MULTI_SELECT: 'Selecione opções...'
} as const