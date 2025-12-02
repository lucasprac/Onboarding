'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import MultiSelect from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'

interface SurveyResponse {
  id: string
  surveyType: string
  office: string
  position: string
  responses: any
  createdAt: string
}

interface DashboardStats {
  totalResponses: number
  averageNPS: number
  averageTools: number
  averageRecognition: number
  averageTraining: number
  averageGrowth: number
  averageOpinion: number
  averageCommunication: number
  responsesByOffice: { [key: string]: number }
  responsesByPosition: { [key: string]: number }
}

export default function Dashboard30Days() {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([])
  const [selectedOffices, setSelectedOffices] = useState<string[]>([])
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const officeOptions = [
    { value: 'sede1', label: 'Sede 1' },
    { value: 'sede2', label: 'Sede 2' },
    { value: 'sede3', label: 'Sede 3' }
  ]

  const positionOptions = [
    { value: 'cargo1', label: 'Cargo 1' },
    { value: 'cargo2', label: 'Cargo 2' },
    { value: 'cargo3', label: 'Cargo 3' }
  ]

  useEffect(() => {
    fetchResponses()
  }, [])

  useEffect(() => {
    filterResponses()
  }, [responses, selectedOffices, selectedPositions])

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/surveys/30days')
      const data = await response.json()
      setResponses(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching responses:', error)
      setLoading(false)
    }
  }

  const filterResponses = () => {
    let filtered = responses

    if (selectedOffices.length > 0) {
      filtered = filtered.filter(r => selectedOffices.includes(r.office))
    }

    if (selectedPositions.length > 0) {
      filtered = filtered.filter(r => selectedPositions.includes(r.position))
    }

    setFilteredResponses(filtered)
  }

  const calculateStats = (): DashboardStats => {
    if (filteredResponses.length === 0) {
      return {
        totalResponses: 0,
        averageNPS: 0,
        averageTools: 0,
        averageRecognition: 0,
        averageTraining: 0,
        averageGrowth: 0,
        averageOpinion: 0,
        averageCommunication: 0,
        responsesByOffice: {},
        responsesByPosition: {}
      }
    }

    const totalNPS = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.nps || '0'), 0)
    const totalTools = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.tools || '0'), 0)
    const totalRecognition = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.recognition || '0'), 0)
    const totalTraining = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.training || '0'), 0)
    const totalGrowth = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.growth || '0'), 0)
    const totalOpinion = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.opinion || '0'), 0)
    const totalCommunication = filteredResponses.reduce((sum, r) => sum + parseInt(r.responses.communication || '0'), 0)

    const responsesByOffice = filteredResponses.reduce((acc, r) => {
      acc[r.office] = (acc[r.office] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const responsesByPosition = filteredResponses.reduce((acc, r) => {
      acc[r.position] = (acc[r.position] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    return {
      totalResponses: filteredResponses.length,
      averageNPS: totalNPS / filteredResponses.length,
      averageTools: totalTools / filteredResponses.length,
      averageRecognition: totalRecognition / filteredResponses.length,
      averageTraining: totalTraining / filteredResponses.length,
      averageGrowth: totalGrowth / filteredResponses.length,
      averageOpinion: totalOpinion / filteredResponses.length,
      averageCommunication: totalCommunication / filteredResponses.length,
      responsesByOffice,
      responsesByPosition
    }
  }

  const getNPSClassification = (score: number): { label: string; color: string } => {
    if (score >= 9) return { label: 'Promotores', color: 'bg-green-500' }
    if (score >= 7) return { label: 'Neutros', color: 'bg-yellow-500' }
    return { label: 'Detratores', color: 'bg-red-500' }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados...</div>
      </div>
    )
  }

  const overallAverage = (stats.averageTools + stats.averageRecognition + stats.averageTraining + 
                         stats.averageGrowth + stats.averageOpinion + stats.averageCommunication) / 6

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Filtros</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOffices([])
              setSelectedPositions([])
            }}
            className="text-xs"
          >
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filtrar por Sede</label>
            <MultiSelect
              options={officeOptions}
              selected={selectedOffices}
              onChange={setSelectedOffices}
              placeholder="Todas as sedes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filtrar por Cargo</label>
            <MultiSelect
              options={positionOptions}
              selected={selectedPositions}
              onChange={setSelectedPositions}
              placeholder="Todos os cargos"
            />
          </div>
        </div>
        {(selectedOffices.length > 0 || selectedPositions.length > 0) && (
          <div className="mt-3 text-xs text-gray-600">
            Mostrando {filteredResponses.length} de {responses.length} respostas
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NPS Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageNPS.toFixed(1)}</div>
            <Badge className={`mt-1 ${getNPSClassification(stats.averageNPS).color}`}>
              {getNPSClassification(stats.averageNPS).label}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAverage.toFixed(1)}/5</div>
            <Progress value={overallAverage * 20} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Desenvolvimento</CardTitle>
            <CardDescription>Avaliação dos principais aspectos de desenvolvimento e suporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Ferramentas Adequadas</span>
                  <span className="text-sm font-medium">{stats.averageTools.toFixed(1)}/5</span>
                </div>
                <Progress value={(stats.averageTools / 5) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Reconhecimento</span>
                  <span className="text-sm font-medium">{stats.averageRecognition.toFixed(1)}/5</span>
                </div>
                <Progress value={(stats.averageRecognition / 5) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Treinamento</span>
                  <span className="text-sm font-medium">{stats.averageTraining.toFixed(1)}/5</span>
                </div>
                <Progress value={(stats.averageTraining / 5) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cultura e Comunicação</CardTitle>
            <CardDescription>Avaliação dos aspectos culturais e de comunicação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Oportunidades de Crescimento</span>
                  <span className="text-sm font-medium">{stats.averageGrowth.toFixed(1)}/5</span>
                </div>
                <Progress value={(stats.averageGrowth / 5) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Opinião Valorizada</span>
                  <span className="text-sm font-medium">{stats.averageOpinion.toFixed(1)}/5</span>
                </div>
                <Progress value={(stats.averageOpinion / 5) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Comunicação Gerencial</span>
                  <span className="text-sm font-medium">{stats.averageCommunication.toFixed(1)}/5</span>
                </div>
                <Progress value={(stats.averageCommunication / 5) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Recentes</CardTitle>
          <CardDescription>Últimas pesquisas respondidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredResponses.slice(0, 10).map((response) => (
              <div key={response.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge variant="outline">{response.office.replace('sede', 'Sede ')}</Badge>
                    <Badge variant="outline" className="ml-2">{response.position.replace('cargo', 'Cargo ')}</Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(response.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">NPS:</span> {response.responses.nps}/10
                  </div>
                  <div>
                    <span className="font-medium">Ferramentas:</span> {response.responses.tools}/5
                  </div>
                </div>
                {response.responses.experience && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Experiência:</span> {response.responses.experience.substring(0, 100)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}