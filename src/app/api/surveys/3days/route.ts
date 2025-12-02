import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { office, position, manualWelcome, nps, integration, expectations } = body

    // Validate required fields
    if (!office || !position || !manualWelcome || !nps || !integration || !expectations) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Save survey response
    const response = await db.onboardingResponse.create({
      data: {
        surveyType: '3days',
        office,
        position,
        responses: {
          manualWelcome,
          nps,
          integration,
          expectations
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: response.id 
    })

  } catch (error) {
    console.error('Error saving 3 days survey:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar pesquisa' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const responses = await db.onboardingResponse.findMany({
      where: {
        surveyType: '3days'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(responses)

  } catch (error) {
    console.error('Error fetching 3 days surveys:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pesquisas' },
      { status: 500 }
    )
  }
}