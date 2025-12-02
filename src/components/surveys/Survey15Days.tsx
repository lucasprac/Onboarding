'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface SurveyData {
  office: string
  position: string
  responsibilities: string
  support: string
  integration: string
  processes: string
  nps: string
  experience: string
}

export default function Survey15Days() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    office: '',
    position: '',
    responsibilities: '',
    support: '',
    integration: '',
    processes: '',
    nps: '',
    experience: ''
  })

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

  const likertOptions = [
    { value: '1', label: '1 - Discordo totalmente' },
    { value: '2', label: '2 - Discordo' },
    { value: '3', label: '3 - Neutro' },
    { value: '4', label: '4 - Concordo' },
    { value: '5', label: '5 - Concordo totalmente' }
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
      return surveyData.office && surveyData.position
    }
    if (currentStep === 1) {
      return surveyData.responsibilities && surveyData.support && surveyData.integration
    }
    if (currentStep === 2) {
      return surveyData.processes && surveyData.nps
    }
    if (currentStep === 3) {
      return surveyData.experience.trim().length > 0
    }
    return false
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
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
    try {
      const response = await fetch('/api/surveys/15days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      })

      if (response.ok) {
        toast.success('Pesquisa enviada com sucesso! Obrigado pelo seu feedback.')
        // Reset form
        setSurveyData({
          office: '',
          position: '',
          responsibilities: '',
          support: '',
          integration: '',
          processes: '',
          nps: '',
          experience: ''
        })
        setCurrentStep(0)
      } else {
        throw new Error('Erro ao enviar pesquisa')
      }
    } catch (error) {
      toast.error('Erro ao enviar pesquisa. Tente novamente.')
    }
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
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                1. Você sente que compreende claramente suas responsabilidades e expectativas no cargo?
              </Label>
              <RadioGroup
                value={surveyData.responsibilities}
                onValueChange={(value) => updateSurveyData('responsibilities', value)}
                className="mt-3"
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`resp-${option.value}`} />
                    <Label htmlFor={`resp-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">
                2. O apoio recebido do seu gestor e colegas tem sido suficiente para realizar suas atividades?
              </Label>
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
              <Label className="text-base font-medium">
                3. Você se sente integrado(a) e parte do time?
              </Label>
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

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                4. As informações sobre os processos e cultura da empresa são claras até o momento?
              </Label>
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
              <Label className="text-base font-medium">
                5. De 0 a 10, qual a probabilidade de você recomendar a empresa como um bom lugar para trabalhar? (NPS do onboarding)
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
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="experience" className="text-base font-medium">
                6. Conte como está sendo a sua experiência:
              </Label>
              <Textarea
                id="experience"
                value={surveyData.experience}
                onChange={(e) => updateSurveyData('experience', e.target.value)}
                placeholder="Compartilhe sua experiência até o momento..."
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Passo {currentStep + 1} de 4</span>
          <span className="text-sm text-gray-500">
            {currentStep === 0 && 'Informações Básicas'}
            {currentStep === 1 && 'Adaptação e Integração'}
            {currentStep === 2 && 'Processos e NPS'}
            {currentStep === 2 && 'Experiência'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 0 && 'Informações Básicas'}
            {currentStep === 1 && 'Adaptação e Integração'}
            {currentStep === 2 && 'Processos e NPS'}
            {currentStep === 3 && 'Sua Experiência'}
          </CardTitle>
          <CardDescription>
            {currentStep === 0 && 'Precisamos saber um pouco mais sobre você'}
            {currentStep === 1 && 'Avalie sua adaptação à equipe e responsabilidades'}
            {currentStep === 2 && 'Avalie os processos e sua satisfação'}
            {currentStep === 3 && 'Compartilhe sua experiência conosco'}
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
            <Button onClick={nextStep}>
              {currentStep === 3 ? 'Enviar Pesquisa' : 'Próximo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}