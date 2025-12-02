'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SurveyData {
  office: string
  position: string
  effectiveDate: string
  // 3 days fields
  manualWelcome?: string
  integration?: string
  // 15 days fields
  responsibilities?: string
  support?: string
  processes?: string
  // 30 days fields
  tools?: string
  recognition?: string
  training?: string
  growth?: string
  opinion?: string
  communication?: string
  // Common fields
  nps?: string
  experience?: string
  expectations?: string
}

export default function DynamicSurveyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    office: '',
    position: '',
    effectiveDate: '',
    manualWelcome: '',
    integration: '',
    responsibilities: '',
    support: '',
    processes: '',
    tools: '',
    recognition: '',
    training: '',
    growth: '',
    opinion: '',
    communication: '',
    nps: '',
    experience: '',
    expectations: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const surveyType = (params.surveyType as string) || '3days'
  const office = searchParams.get('office') || ''
  const position = searchParams.get('position') || ''
  const effectiveDate = searchParams.get('effectiveDate') || ''

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

  useEffect(() => {
    // First try to get data from URL params
    if (office && position && effectiveDate) {
      setSurveyData(prev => ({
        ...prev,
        office,
        position,
        effectiveDate
      }))
    } else {
      // If no URL params, try to get from localStorage
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
        // If no data anywhere, redirect to survey start
        router.push('/survey')
      }
    }
  }, [office, position, effectiveDate, router])

  const updateSurveyData = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({ ...prev, [field]: value }))
  }

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (surveyType === '3days') {
        return surveyData.manualWelcome && surveyData.nps && surveyData.integration
      } else if (surveyType === '15days') {
        return surveyData.responsibilities && surveyData.support && surveyData.integration && surveyData.processes && surveyData.nps
      } else if (surveyType === '30days') {
        return surveyData.tools && surveyData.recognition && surveyData.training && surveyData.growth && surveyData.opinion && surveyData.communication && surveyData.nps
      }
    }
    if (currentStep === 1) {
      return (surveyData.experience || surveyData.expectations)?.trim().length > 0
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
    setIsLoading(true)
    try {
      const response = await fetch(`/api/surveys/${surveyType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      })

      if (response.ok) {
        toast.success('Pesquisa enviada com sucesso! Obrigado pelo seu feedback.')
        setTimeout(() => {
          router.push('/survey/thank-you')
        }, 2000)
      } else {
        throw new Error('Erro ao enviar pesquisa')
      }
    } catch (error) {
      toast.error('Erro ao enviar pesquisa. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {surveyType === '3days' && (
              <>
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
              </>
            )}

            {surveyType === '15days' && (
              <>
                <div>
                  <Label className="text-base font-medium">1. Você sente que compreende claramente suas responsabilidades e expectativas no cargo?</Label>
                  <RadioGroup
                    value={surveyData.responsibilities}
                    onValueChange={(value) => updateSurveyData('responsibilities', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`responsibilities-${option.value}`} />
                        <Label htmlFor={`responsibilities-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">2. O apoio recebido do seu gestor e colegas tem sido suficiente para realizar suas atividades?</Label>
                  <RadioGroup
                    value={surveyData.support}
                    onValueChange={(value) => updateSurveyData('support', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`support-${option.value}`} />
                        <Label htmlFor={`support-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">3. Você se sente integrado(a) e parte do time?</Label>
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

                <div>
                  <Label className="text-base font-medium">4. As informações sobre os processos e cultura da empresa são claras até o momento?</Label>
                  <RadioGroup
                    value={surveyData.processes}
                    onValueChange={(value) => updateSurveyData('processes', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`processes-${option.value}`} />
                        <Label htmlFor={`processes-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">5. De 0 a 10, qual a probabilidade de você recomendar a empresa como um bom lugar para trabalhar? (NPS do onboarding)</Label>
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
              </>
            )}

            {surveyType === '30days' && (
              <>
                <div>
                  <Label className="text-base font-medium">1. Você recebeu as ferramentas necessárias para realizar seu trabalho adequadamente?</Label>
                  <RadioGroup
                    value={surveyData.tools}
                    onValueChange={(value) => updateSurveyData('tools', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`tools-${option.value}`} />
                        <Label htmlFor={`tools-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">2. Você recebe elogios e reconhecimento pelo seu trabalho e resultados?</Label>
                  <RadioGroup
                    value={surveyData.recognition}
                    onValueChange={(value) => updateSurveyData('recognition', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`recognition-${option.value}`} />
                        <Label htmlFor={`recognition-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">3. Você recebe treinamento que o mantém preparado para suas tarefas?</Label>
                  <RadioGroup
                    value={surveyData.training}
                    onValueChange={(value) => updateSurveyData('training', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`training-${option.value}`} />
                        <Label htmlFor={`training-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">4. Você tem a oportunidade de aprender e crescer na empresa?</Label>
                  <RadioGroup
                    value={surveyData.growth}
                    onValueChange={(value) => updateSurveyData('growth', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`growth-${option.value}`} />
                        <Label htmlFor={`growth-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">5. Você acha que sua opinião é importante e que medidas serão tomadas com base nesta pesquisa?</Label>
                  <RadioGroup
                    value={surveyData.opinion}
                    onValueChange={(value) => updateSurveyData('opinion', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`opinion-${option.value}`} />
                        <Label htmlFor={`opinion-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">6. Você acha que sua gerência o mantém informado sobre questões importantes?</Label>
                  <RadioGroup
                    value={surveyData.communication}
                    onValueChange={(value) => updateSurveyData('communication', value)}
                    className="mt-3"
                  >
                    {likertOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`communication-${option.value}`} />
                        <Label htmlFor={`communication-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">7. De 0 a 10, qual a probabilidade de você recomendar a empresa como um bom lugar para trabalhar? (NPS do onboarding)</Label>
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
              </>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="experience" className="text-base font-medium">
                {surveyType === '3days' ? 'Conte-nos a sua expectativa!' : 'Conte como está sendo a sua experiência:'}
              </Label>
              <Textarea
                id="experience"
                value={surveyData.experience || surveyData.expectations || ''}
                onChange={(e) => updateSurveyData('experience', e.target.value)}
                placeholder="Compartilhe sua experiência na empresa..."
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getSurveyTitle = () => {
    switch (surveyType) {
      case '3days': return 'Pesquisa de Onboarding - 3 Dias'
      case '15days': return 'Pesquisa de Onboarding - 15 Dias'
      case '30days': return 'Pesquisa de Onboarding - 30 Dias'
      default: return 'Pesquisa de Onboarding'
    }
  }

  const getSurveyDescription = () => {
    switch (surveyType) {
      case '3days': return 'Avaliação inicial da experiência do colaborador'
      case '15days': return 'Avaliação do processo de integração e adaptação'
      case '30days': return 'Avaliação completa da experiência e desenvolvimento'
      default: return 'Avaliação da experiência do colaborador'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Enviando sua pesquisa...</h3>
            <p className="text-gray-600">Agradecemos seu feedback!</p>
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
              onClick={() => router.push('/survey')}
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
          {/* Informações do colaborador */}
          <Alert className="mb-6">
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <strong>Sede:</strong> {surveyData.office.replace('sede', 'Sede ')} • 
              <strong> Cargo:</strong> {surveyData.position.replace('cargo', 'Cargo ')} • 
              <strong> Efetivação:</strong> {new Date(surveyData.effectiveDate).toLocaleDateString('pt-BR')}
            </AlertDescription>
          </Alert>

          {/* Progresso */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Passo {currentStep + 1} de 2</span>
              <span className="text-sm text-gray-500">
                {currentStep === 0 ? 'Avaliação' : 'Suas Experiências'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{getSurveyTitle()}</CardTitle>
              <CardDescription>
                {currentStep === 0 ? 'Responda às perguntas abaixo' : 'Compartilhe suas experiências'}
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
                <Button onClick={nextStep} disabled={isLoading}>
                  {currentStep === 1 ? 'Enviar Pesquisa' : 'Próximo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}