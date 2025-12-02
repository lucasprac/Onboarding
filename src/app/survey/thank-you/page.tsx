'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowLeft, Home } from 'lucide-react'

export default function ThankYouPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Obrigado!
          </h1>
          <p className="text-lg text-gray-600">
            Sua pesquisa foi enviada com sucesso.
          </p>
        </div>

        {/* Success Message */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Feedback Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Agradecemos por dedicar seu tempo para compartilhar sua experiência. 
                Seu feedback é fundamental para melhorarmos continuamente nosso processo de onboarding.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  Suas respostas são confidenciais e serão analisadas com cuidado 
                  pela equipe de RH para promover melhorias na experiência dos colaboradores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/welcome')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar para página inicial
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.close()}
            className="w-full"
          >
            Fechar janela
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Plataforma de Onboarding. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}