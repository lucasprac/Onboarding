import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      office, 
      position, 
      responsibilities, 
      support, 
      integration, 
      processes, 
      nps, 
      experience 
    } = body

    // Validate required fields
    if (!office || !position || !responsibilities || !support || !integration || !processes || !nps || !experience) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Save survey response
    const response = await db.onboardingResponse.create({
      data: {
        surveyType: '15days',
        office,
        position,
        responses: {
          responsibilities,
          support,
          integration,
          processes,
          nps,
          experience
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: response.id 
    })

  } catch (error) {
    console.error('Error saving 15 days survey:', error)
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
        surveyType: '15days'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(responses)

  } catch (error) {
    console.error('Error fetching 15 days surveys:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pesquisas' },
      { status: 500 }
    )
  }
}