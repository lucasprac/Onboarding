'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SurveyData {
  office: string
  position: string
  effectiveDate: string
}

export default function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    office: '',
    position: '',
    effectiveDate: ''
  })
  const [selectedSurvey, setSelectedSurvey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const offices = [
    { value: 'sede1', label: 'Sede 1' },
    { value: 'sede2', label: 'Sede 2' },
    { value: 'sede3', label: 'Sede 3' }
  ]

  const positions = [
    { value: 'cargo1', label: 'Cargo 1' },
    { value: 'cargo2', label: 'Cargo 2' },
    { value: 'cargo3', label: 'Cargo 3' }
  ]

  const surveyOptions = [
    { value: '3days', label: 'Pesquisa de 3 Dias', description: 'Para recém-efetivados' },
    { value: '15days', label: 'Pesquisa de 15 Dias', description: 'Para colaboradores em adaptação' },
    { value: '30days', label: 'Pesquisa de 30 Dias', description: 'Para colaboradores experientes' }
  ]

  const updateSurveyData = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({ ...prev, [field]: value }))
  }

  const calculateDaysSinceEffective = () => {
    if (!surveyData.effectiveDate) return 0
    
    const effectiveDate = new Date(surveyData.effectiveDate)
    const today = new Date()
    
    // Set both times to midnight to avoid partial day issues
    effectiveDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    
    const diffTime = today.getTime() - effectiveDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  const determineSurveyType = () => {
    const daysSince = calculateDaysSinceEffective()
    
    if (daysSince === 3) return '3days'
    if (daysSince === 15) return '15days'
    if (daysSince === 30) return '30days'
    
    return null // Data não corresponde a nenhuma pesquisa padrão
  }

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      return surveyData.office && surveyData.position && surveyData.effectiveDate
    }
    if (currentStep === 1) {
      return selectedSurvey
    }
    return false
  }

  const nextStep = () => {
    if (!validateCurrentStep()) {
      toast.error('Por favor, preencha todos os campos antes de continuar.')
      return
    }

    if (currentStep === 0) {
      // Verifica se corresponde a alguma pesquisa padrão
      const surveyType = determineSurveyType()
      if (surveyType) {
        // Salva dados no localStorage antes de redirecionar
        localStorage.setItem('surveyData', JSON.stringify(surveyData))
        
        // Direciona automaticamente para a pesquisa correta
        setIsLoading(true)
        setTimeout(() => {
          router.push(`/survey/${surveyType}?office=${surveyData.office}&position=${surveyData.position}&effectiveDate=${surveyData.effectiveDate}`)
        }, 1000)
        return
      } else {
        // Mostra passo de seleção de pesquisa
        setCurrentStep(1)
      }
    } else if (currentStep === 1) {
      // Salva dados no localStorage antes de redirecionar
      localStorage.setItem('surveyData', JSON.stringify(surveyData))
      
      // Inicia a pesquisa selecionada
      setIsLoading(true)
      setTimeout(() => {
        router.push(`/survey/${selectedSurvey}?office=${surveyData.office}&position=${surveyData.position}&effectiveDate=${surveyData.effectiveDate}`)
      }, 1000)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBackToWelcome = () => {
    router.push('/welcome')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="office" className="text-base font-medium">Sede</Label>
              <Select value={surveyData.office} onValueChange={(value) => updateSurveyData('office', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione sua sede" />
                </SelectTrigger>
                <SelectContent>
                  {offices.map((office) => (
                    <SelectItem key={office.value} value={office.value}>
                      {office.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="position" className="text-base font-medium">Cargo</Label>
              <Select value={surveyData.position} onValueChange={(value) => updateSurveyData('position', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effectiveDate" className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Quando você foi efetivado?
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={surveyData.effectiveDate}
                onChange={(e) => updateSurveyData('effectiveDate', e.target.value)}
                className="mt-2"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {surveyData.effectiveDate && (
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  {calculateDaysSinceEffective() === 0 ? (
                    <span>Você foi efetivado hoje! Bem-vindo!</span>
                  ) : calculateDaysSinceEffective() === 1 ? (
                    <span>Você foi efetivado ontem!</span>
                  ) : (
                    <span>Você foi efetivado há {calculateDaysSinceEffective()} dias.</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">
                Qual pesquisa de onboarding você deseja fazer?
              </Label>
              <RadioGroup
                value={selectedSurvey}
                onValueChange={setSelectedSurvey}
                className="space-y-4"
              >
                {surveyOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return 'Informações Básicas'
      case 1: return 'Seleção de Pesquisa'
      default: return ''
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 0: return 'Precisamos saber um pouco mais sobre você'
      case 1: return 'Escolha a pesquisa que deseja responder'
      default: return ''
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Preparando sua pesquisa...</h3>
            <p className="text-gray-600">Estamos direcionando você para a pesquisa adequada.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ON</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Pesquisa de Onboarding</h1>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleBackToWelcome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Passo {currentStep + 1} de {determineSurveyType() && currentStep === 0 ? '1' : '2'}</span>
              <span className="text-sm text-gray-500">{getStepTitle()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentStep + 1) / (determineSurveyType() && currentStep === 0 ? 1 : 2)) * 100}%` 
                }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{getStepTitle()}</CardTitle>
              <CardDescription>{getStepDescription()}</CardDescription>
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
                <Button onClick={nextStep} disabled={isLoading}>
                  {currentStep === 0 && determineSurveyType() ? 'Ir para Pesquisa' : 
                   currentStep === 1 ? 'Iniciar Pesquisa' : 'Próximo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}