import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const surveyType = searchParams.get('type') || '3days'

    const responses = await db.onboardingResponse.findMany({
      where: {
        surveyType: surveyType
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Generate CSV content
    const headers = [
      'ID',
      'Tipo de Pesquisa',
      'Sede',
      'Cargo',
      'Data de Resposta',
      ...getSurveyHeaders(surveyType)
    ]

    const csvContent = [
      headers.join(','),
      ...responses.map(response => {
        const baseData = [
          response.id,
          response.surveyType,
          response.office,
          response.position,
          new Date(response.createdAt).toLocaleDateString('pt-BR')
        ]

        const surveyData = getSurveyData(response.responses, surveyType)
        return [...baseData, ...surveyData].join(',')
      })
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="onboarding_${surveyType}_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    )
  }
}

function getSurveyHeaders(surveyType: string): string[] {
  switch (surveyType) {
    case '3days':
      return ['Manual Boas-vindas', 'NPS', 'Avaliação Integração', 'Expectativas']
    case '15days':
      return ['Responsabilidades Claras', 'Apoio Recebido', 'Integração Time', 'Processos Claros', 'NPS', 'Experiência']
    case '30days':
      return [
        'Ferramentas Adequadas',
        'Reconhecimento',
        'Treinamento',
        'Oportunidades Crescimento',
        'Opinião Valorizada',
        'Comunicação Gerencial',
        'NPS',
        'Experiência'
      ]
    default:
      return []
  }
}

function getSurveyData(responses: any, surveyType: string): string[] {
  switch (surveyType) {
    case '3days':
      return [
        responses.manualWelcome || '',
        responses.nps || '',
        responses.integration || '',
        `"${(responses.expectations || '').replace(/"/g, '""')}"`
      ]
    case '15days':
      return [
        responses.responsibilities || '',
        responses.support || '',
        responses.integration || '',
        responses.processes || '',
        responses.nps || '',
        `"${(responses.experience || '').replace(/"/g, '""')}"`
      ]
    case '30days':
      return [
        responses.tools || '',
        responses.recognition || '',
        responses.training || '',
        responses.growth || '',
        responses.opinion || '',
        responses.communication || '',
        responses.nps || '',
        `"${(responses.experience || '').replace(/"/g, '""')}"`
      ]
    default:
      return []
  }
}