import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      office, 
      position, 
      tools, 
      recognition, 
      training, 
      growth, 
      opinion, 
      communication, 
      nps, 
      experience 
    } = body

    // Validate required fields
    if (!office || !position || !tools || !recognition || !training || !growth || !opinion || !communication || !nps || !experience) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Save survey response
    const response = await db.onboardingResponse.create({
      data: {
        surveyType: '30days',
        office,
        position,
        responses: {
          tools,
          recognition,
          training,
          growth,
          opinion,
          communication,
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
    console.error('Error saving 30 days survey:', error)
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
        surveyType: '30days'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(responses)

  } catch (error) {
    console.error('Error fetching 30 days surveys:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pesquisas' },
      { status: 500 }
    )
  }
}