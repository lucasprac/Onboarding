'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import MultiSelect from '@/components/ui/multi-select'

interface SurveyResponse {
  id: string
  surveyType: string
  office: string
  position: string
  responses: any
  createdAt: string
}

interface NPSStats {
  totalResponses: number
  averageNPS: number
  promoters: number
  passives: number
  detractors: number
  npsScore: number
  responsesBySurvey: { [key: string]: { count: number; average: number } }
  responsesByOffice: { [key: string]: { count: number; average: number; promoters: number; passives: number; detractors: number } }
  trendData: { date: string; score: number; surveyType: string }[]
}

export default function ENPSDashboard() {
  const [allResponses, setAllResponses] = useState<SurveyResponse[]>([])
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([])
  const [selectedOffices, setSelectedOffices] = useState<string[]>([])
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const officeOptions = [
    { value: 'sede1', label: 'Sede 1' },
    { value: 'sede2', label: 'Sede 2' },
    { value: 'sede3', label: 'Sede 3' }
  ]

  const surveyOptions = [
    { value: '3dias', label: '3 Dias' },
    { value: '15dias', label: '15 Dias' },
    { value: '30dias', label: '30 Dias' }
  ]

  useEffect(() => {
    fetchAllResponses()
  }, [])

  useEffect(() => {
    filterResponses()
  }, [allResponses, selectedOffices, selectedSurveys])

  const fetchAllResponses = async () => {
    try {
      const [responses3Days, responses15Days, responses30Days] = await Promise.all([
        fetch('/api/surveys/3days').then(r => r.json()),
        fetch('/api/surveys/15days').then(r => r.json()),
        fetch('/api/surveys/30days').then(r => r.json())
      ])

      const allData = [
        ...responses3Days.map(r => ({ ...r, surveyType: '3dias' })),
        ...responses15Days.map(r => ({ ...r, surveyType: '15dias' })),
        ...responses30Days.map(r => ({ ...r, surveyType: '30dias' }))
      ]

      setAllResponses(allData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching responses:', error)
      setLoading(false)
    }
  }

  const filterResponses = () => {
    let filtered = allResponses

    if (selectedOffices.length > 0) {
      filtered = filtered.filter(r => selectedOffices.includes(r.office))
    }

    if (selectedSurveys.length > 0) {
      filtered = filtered.filter(r => selectedSurveys.includes(r.surveyType))
    }

    setFilteredResponses(filtered)
  }

  const calculateNPSStats = (): NPSStats => {
    if (filteredResponses.length === 0) {
      return {
        totalResponses: 0,
        averageNPS: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        npsScore: 0,
        responsesBySurvey: {},
        responsesByOffice: {},
        trendData: []
      }
    }

    const npsScores = filteredResponses.map(r => parseInt(r.responses.nps || '0'))
    const totalNPS = npsScores.reduce((sum, score) => sum + score, 0)
    const averageNPS = totalNPS / npsScores.length

    const promoters = npsScores.filter(score => score >= 9).length
    const passives = npsScores.filter(score => score >= 7 && score <= 8).length
    const detractors = npsScores.filter(score => score <= 6).length

    // NPS Score calculation: % Promoters - % Detractors
    const npsScore = ((promoters / npsScores.length) * 100) - ((detractors / npsScores.length) * 100)

    // Group by survey type
    const responsesBySurvey = filteredResponses.reduce((acc, response) => {
      const surveyType = response.surveyType
      const npsScore = parseInt(response.responses.nps || '0')
      
      if (!acc[surveyType]) {
        acc[surveyType] = { count: 0, total: 0 }
      }
      acc[surveyType].count++
      acc[surveyType].total += npsScore
      
      return acc
    }, {} as { [key: string]: { count: number; total: number } })

    // Convert to average
    Object.keys(responsesBySurvey).forEach(key => {
      responsesBySurvey[key] = {
        count: responsesBySurvey[key].count,
        average: responsesBySurvey[key].total / responsesBySurvey[key].count
      }
    })

    // Group by office
    const responsesByOffice = filteredResponses.reduce((acc, response) => {
      const office = response.office
      const npsScore = parseInt(response.responses.nps || '0')
      
      if (!acc[office]) {
        acc[office] = { count: 0, total: 0, promoters: 0, passives: 0, detractors: 0 }
      }
      acc[office].count++
      acc[office].total += npsScore
      
      if (npsScore >= 9) acc[office].promoters++
      else if (npsScore >= 7) acc[office].passives++
      else acc[office].detractors++
      
      return acc
    }, {} as { [key: string]: { count: number; total: number; promoters: number; passives: number; detractors: number } })

    // Convert to averages
    Object.keys(responsesByOffice).forEach(key => {
      const data = responsesByOffice[key]
      responsesByOffice[key] = {
        count: data.count,
        average: data.total / data.count,
        promoters: data.promoters,
        passives: data.passives,
        detractors: data.detractors
      }
    })

    // Trend data (group by date and survey type)
    const trendData = filteredResponses.map(response => ({
      date: new Date(response.createdAt).toLocaleDateString('pt-BR'),
      score: parseInt(response.responses.nps || '0'),
      surveyType: response.surveyType
    }))

    return {
      totalResponses: filteredResponses.length,
      averageNPS,
      promoters,
      passives,
      detractors,
      npsScore,
      responsesBySurvey,
      responsesByOffice,
      trendData
    }
  }

  const getNPSClassification = (score: number): { label: string; color: string; bgColor: string } => {
    if (score >= 50) return { label: 'Excelente', color: 'text-green-700', bgColor: 'bg-green-100' }
    if (score >= 20) return { label: 'Bom', color: 'text-blue-700', bgColor: 'bg-blue-100' }
    if (score >= 0) return { label: 'Regular', color: 'text-yellow-700', bgColor: 'bg-yellow-100' }
    return { label: 'Crítico', color: 'text-red-700', bgColor: 'bg-red-100' }
  }

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Tipo de Pesquisa', 'Sede', 'Cargo', 'NPS', 'Data'],
      ...filteredResponses.map(r => [
        r.id,
        r.surveyType,
        r.office,
        r.position,
        r.responses.nps,
        new Date(r.createdAt).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `enps_data_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = calculateNPSStats()
  const classification = getNPSClassification(stats.npsScore)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados...</div>
      </div>
    )
  }

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
              setSelectedSurveys([])
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
            <label className="block text-sm font-medium mb-2">Filtrar por Pesquisa</label>
            <MultiSelect
              options={surveyOptions}
              selected={selectedSurveys}
              onChange={setSelectedSurveys}
              placeholder="Todas as pesquisas"
            />
          </div>
        </div>
        {(selectedOffices.length > 0 || selectedSurveys.length > 0) && (
          <div className="mt-3 text-xs text-gray-600">
            Mostrando {filteredResponses.length} de {allResponses.length} respostas
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Main NPS Score */}
      <Card className={`border-2 ${classification.bgColor}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">eNPS do Onboarding</CardTitle>
          <CardDescription>Employee Net Promoter Score agregado</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold mb-2">{stats.npsScore.toFixed(0)}</div>
          <Badge className={`text-lg px-4 py-2 ${classification.bgColor} ${classification.color}`}>
            {classification.label}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">
            Baseado em {stats.totalResponses} respostas
          </p>
        </CardContent>
      </Card>

      {/* NPS Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Promotores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.promoters}</div>
            <div className="text-sm text-gray-600">
              {((stats.promoters / stats.totalResponses) * 100).toFixed(1)}% do total
            </div>
            <Progress value={(stats.promoters / stats.totalResponses) * 100} className="mt-2 bg-green-100">
              <div className="bg-green-500 h-2 rounded-full" />
            </Progress>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Neutros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.passives}</div>
            <div className="text-sm text-gray-600">
              {((stats.passives / stats.totalResponses) * 100).toFixed(1)}% do total
            </div>
            <Progress value={(stats.passives / stats.totalResponses) * 100} className="mt-2 bg-yellow-100">
              <div className="bg-yellow-500 h-2 rounded-full" />
            </Progress>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Detratores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.detractors}</div>
            <div className="text-sm text-gray-600">
              {((stats.detractors / stats.totalResponses) * 100).toFixed(1)}% do total
            </div>
            <Progress value={(stats.detractors / stats.totalResponses) * 100} className="mt-2 bg-red-100">
              <div className="bg-red-500 h-2 rounded-full" />
            </Progress>
          </CardContent>
        </Card>
      </div>

      {/* Analysis by Survey Type */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Tipo de Pesquisa</CardTitle>
          <CardDescription>NPS médio por período de onboarding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.responsesBySurvey).map(([surveyType, data]) => (
              <div key={surveyType} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium capitalize">
                    {surveyType === '3dias' ? '3 Dias' : surveyType === '15dias' ? '15 Dias' : '30 Dias'}
                  </h3>
                  <p className="text-sm text-gray-600">{data.count} respostas</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{data.average.toFixed(1)}</div>
                  <Badge variant="outline" className={getNPSClassification(((data.average / 10) * 100) - 50).color}>
                    {getNPSClassification(((data.average / 10) * 100) - 50).label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis by Office */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Sede</CardTitle>
          <CardDescription>NPS detalhado por localização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.responsesByOffice).map(([office, data]) => {
              const officeNPSScore = ((data.promoters / data.count) * 100) - ((data.detractors / data.count) * 100)
              const classification = getNPSClassification(officeNPSScore)
              
              return (
                <div key={office} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium capitalize">{office.replace('sede', 'Sede ')}</h3>
                    <div className="text-right">
                      <div className="text-xl font-bold">{officeNPSScore.toFixed(0)}</div>
                      <Badge variant="outline" className={classification.color}>
                        {classification.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-green-600">{data.promoters}</div>
                      <div className="text-gray-600">Promotores</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-yellow-600">{data.passives}</div>
                      <div className="text-gray-600">Neutros</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-600">{data.detractors}</div>
                      <div className="text-gray-600">Detratores</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Média NPS: {data.average.toFixed(1)}/10 • {data.count} respostas
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}