'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SurveyData {
  office: string
  position: string
  effectiveDate: string
  manualWelcome: string
  nps: string
  integration: string
  expectations: string
}

export default function Survey3DaysPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    office: '',
    position: '',
    effectiveDate: '',
    manualWelcome: '',
    nps: '',
    integration: '',
    expectations: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Carregar dados pré-preenchidos
    const savedData = localStorage.getItem('surveyData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setSurveyData(prev => ({
        ...prev,
        office: data.office,
        position: data.position,
        effectiveDate: data.effectiveDate
      }))
    } else {
      // Se não houver dados pré-preenchidos, redirecionar para a página inicial
      router.push('/survey')
    }
  }, [router])

  const likertOptions = [
    { value: '1', label: '1 - Muito ruim' },
    { value: '2', label: '2 - Ruim' },
    { value: '3', label: '3 - Regular' },
    { value: '4', label: '4 - Bom' },
    { value: '5', label: '5 - Excelente' }
  ]

  const npsOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i.toString(),
    label: i.toString()
  }))

  const updateSurveyData = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({ ...prev, [field]: value }))
  }

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      return surveyData.manualWelcome && surveyData.nps && surveyData.integration
    }
    if (currentStep === 1) {
      return surveyData.expectations.trim().length > 0
    }
    return false
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 1) {
        setCurrentStep(currentStep + 1)
      } else {
        submitSurvey()
      }
    } else {
      toast.error('Por favor, responda todas as perguntas antes de continuar.')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitSurvey = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/surveys/3days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      })

      if (response.ok) {
        toast.success('Pesquisa enviada com sucesso! Obrigado pelo seu feedback.')
        localStorage.removeItem('surveyData')
        router.push('/survey/thank-you')
      } else {
        throw new Error('Erro ao enviar pesquisa')
      }
    } catch (error) {
      toast.error('Erro ao enviar pesquisa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Manual de boas vindas</Label>
              <RadioGroup
                value={surveyData.manualWelcome}
                onValueChange={(value) => updateSurveyData('manualWelcome', value)}
                className="mt-3"
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`manual-${option.value}`} />
                    <Label htmlFor={`manual-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">
                De 0 a 10, qual a probabilidade de você recomendar a empresa como um bom lugar para trabalhar? (NPS do onboarding)
              </Label>
              <RadioGroup
                value={surveyData.nps}
                onValueChange={(value) => updateSurveyData('nps', value)}
                className="mt-3 grid grid-cols-6 gap-2"
              >
                {npsOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`nps-${option.value}`} />
                    <Label htmlFor={`nps-${option.value}`} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Avaliação da Integração</Label>
              <RadioGroup
                value={surveyData.integration}
                onValueChange={(value) => updateSurveyData('integration', value)}
                className="mt-3"
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`integration-${option.value}`} />
                    <Label htmlFor={`integration-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="expectations" className="text-base font-medium">
                Conte-nos a sua expectativa!
              </Label>
              <Textarea
                id="expectations"
                value={surveyData.expectations}
                onChange={(e) => updateSurveyData('expectations', e.target.value)}
                placeholder="Compartilhe suas expectativas sobre a empresa e sua experiência..."
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/survey')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pesquisa de Onboarding - 3 Dias
          </h1>
          <p className="text-gray-600">
            Avaliação inicial da experiência do colaborador
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Passo {currentStep + 1} de 2</span>
            <span className="text-sm text-gray-500">
              {currentStep === 0 && 'Avaliação Inicial'}
              {currentStep === 1 && 'Suas Expectativas'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Info card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-900">
                <strong>Sede:</strong> {surveyData.office.replace('sede', 'Sede ')} • 
                <strong> Cargo:</strong> {surveyData.position.replace('cargo', 'Cargo ')} • 
                <strong> Efetivação:</strong> {new Date(surveyData.effectiveDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 0 && 'Avaliação Inicial'}
              {currentStep === 1 && 'Suas Expectativas'}
            </CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Avalie seus primeiros dias na empresa'}
              {currentStep === 1 && 'Compartilhe suas expectativas conosco'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              <Button onClick={nextStep} disabled={loading}>
                {loading ? 'Enviando...' : currentStep === 1 ? 'Enviar Pesquisa' : 'Próximo'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}