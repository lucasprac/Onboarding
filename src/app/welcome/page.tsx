'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, BarChart3, MessageSquare } from 'lucide-react'

export default function WelcomePage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const handleAdminClick = () => {
    window.location.href = '/admin'
  }

  const handleStartSurvey = () => {
    window.location.href = '/survey'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header com botão administrativo */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ON</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Onboarding Platform</h1>
            </div>
            <Button 
              onClick={handleAdminClick}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Administrativo</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo à Plataforma de Onboarding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Acompanhamos sua jornada na empresa para garantir uma experiência de integração 
            excepcional e ajudar no seu desenvolvimento profissional.
          </p>
          <Button 
            onClick={handleStartSurvey}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Começar Pesquisa
          </Button>
        </div>

        {/* Cards de informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Pesquisas Cronológicas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Acompanhamos sua evolução com pesquisas nos dias 3, 15 e 30 dias após sua efetivação.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Feedback Confidencial</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Suas respostas são 100% confidenciais e nos ajudam a melhorar continuamente.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Cultura de Integração</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Construímos um ambiente onde cada novo colaborador se sente valorizado e acolhido.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Seção de benefícios */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Como funciona sua jornada de onboarding?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">3 Dias</h3>
              <p className="text-gray-600">
                Avaliação inicial das primeiras impressões, recebimento do manual de boas-vindas 
                e integração inicial com a equipe.
              </p>
              <Badge variant="secondary" className="mt-3">Início da Jornada</Badge>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                15
              </div>
              <h3 className="text-xl font-semibold mb-2">15 Dias</h3>
              <p className="text-gray-600">
                Análise da adaptação às responsabilidades, apoio recebido e clareza dos processos 
                e cultura da empresa.
              </p>
              <Badge variant="secondary" className="mt-3">Adaptação</Badge>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                30
              </div>
              <h3 className="text-xl font-semibold mb-2">30 Dias</h3>
              <p className="text-gray-600">
                Avaliação completa da experiência, desenvolvimento profissional, reconhecimento 
                e oportunidades de crescimento.
              </p>
              <Badge variant="secondary" className="mt-3">Consolidação</Badge>
            </div>
          </div>
        </div>

        {/* Seção de importância */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Sua opinião transforma nossa cultura
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            Cada feedback recebido é fundamental para criarmos um ambiente de trabalho 
            onde todos possam prosperar e se desenvolver plenamente.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-90">Confidencial</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm opacity-90">Momentos Chave</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm opacity-90">Oportunidades de Melhoria</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Plataforma de Onboarding. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Construindo uma experiência de integração excepcional.
          </p>
        </div>
      </footer>
    </div>
  )
}