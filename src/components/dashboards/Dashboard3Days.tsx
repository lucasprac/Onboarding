'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import MultiSelect from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'
import { useSurveyData } from '@/hooks/useSurveyData'
import { 
  getNPSClassification, 
  formatDate, 
  truncateText, 
  formatOfficeName, 
  formatPositionName, 
  calculatePercentage 
} from '@/utils'
import { OFFICE_OPTIONS, POSITION_OPTIONS, TEXTS, PLACEHOLDERS } from '@/constants'

export default function Dashboard3Days() {
  const {
    filteredResponses,
    stats,
    filters,
    loading,
    error,
    setFilters,
    clearFilters
  } = useSurveyData({
    endpoint: '/api/surveys/3days'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{TEXTS.LOADING}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">{TEXTS.FILTERS}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            {TEXTS.CLEAR_FILTERS}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filtrar por Sede</label>
            <MultiSelect
              options={OFFICE_OPTIONS}
              selected={filters.selectedOffices}
              onChange={(selected) => setFilters({ selectedOffices: selected })}
              placeholder={PLACEHOLDERS.OFFICE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filtrar por Cargo</label>
            <MultiSelect
              options={POSITION_OPTIONS}
              selected={filters.selectedPositions}
              onChange={(selected) => setFilters({ selectedPositions: selected })}
              placeholder={PLACEHOLDERS.POSITION}
            />
          </div>
        </div>
        {(filters.selectedOffices.length > 0 || filters.selectedPositions.length > 0) && (
          <div className="mt-3 text-xs text-gray-600">
            Mostrando {filteredResponses.length} de {stats.totalResponses} respostas
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Integração Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageIntegration.toFixed(1)}/5</div>
            <Progress value={(stats.averageIntegration / 5) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Manual Boas-vindas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageManual.toFixed(1)}/5</div>
            <Progress value={(stats.averageManual / 5) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Respostas por Sede</CardTitle>
            <CardDescription>Distribuição das respostas por localização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.responsesByOffice).map(([office, count]) => (
                <div key={office} className="flex items-center justify-between">
                  <span className="capitalize">{formatOfficeName(office)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${calculatePercentage(count, stats.totalResponses)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Respostas por Cargo</CardTitle>
            <CardDescription>Distribuição das respostas por cargo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.responsesByPosition).map(([position, count]) => (
                <div key={position} className="flex items-center justify-between">
                  <span className="capitalize">{formatPositionName(position)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${calculatePercentage(count, stats.totalResponses)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
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
                    <Badge variant="outline">{formatOfficeName(response.office)}</Badge>
                    <Badge variant="outline" className="ml-2">{formatPositionName(response.position)}</Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(response.createdAt)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">NPS:</span> {response.responses.nps}/10
                  </div>
                  <div>
                    <span className="font-medium">Integração:</span> {response.responses.integration}/5
                  </div>
                  <div>
                    <span className="font-medium">Manual:</span> {response.responses.manualWelcome}/5
                  </div>
                </div>
                {response.responses.expectations && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Expectativas:</span> {truncateText(response.responses.expectations, 100)}...
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