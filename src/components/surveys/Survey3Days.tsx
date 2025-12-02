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
  manualWelcome: string
  nps: string
  integration: string
  expectations: string
}

export default function Survey3Days() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    office: '',
    position: '',
    manualWelcome: '',
    nps: '',
    integration: '',
    expectations: ''
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
      return surveyData.office && surveyData.position
    }
    if (currentStep === 1) {
      return surveyData.manualWelcome && surveyData.nps && surveyData.integration
    }
    if (currentStep === 2) {
      return surveyData.expectations.trim().length > 0
    }
    return false
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 2) {
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
      const response = await fetch('/api/surveys/3days', {
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
          manualWelcome: '',
          nps: '',
          integration: '',
          expectations: ''
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

      case 2:
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Passo {currentStep + 1} de 3</span>
          <span className="text-sm text-gray-500">
            {currentStep === 0 && 'Informações Básicas'}
            {currentStep === 1 && 'Avaliação Inicial'}
            {currentStep === 2 && 'Expectativas'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 0 && 'Informações Básicas'}
            {currentStep === 1 && 'Avaliação Inicial'}
            {currentStep === 2 && 'Suas Expectativas'}
          </CardTitle>
          <CardDescription>
            {currentStep === 0 && 'Precisamos saber um pouco mais sobre você'}
            {currentStep === 1 && 'Avalie seus primeiros dias na empresa'}
            {currentStep === 2 && 'Compartilhe suas expectativas conosco'}
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
              {currentStep === 2 ? 'Enviar Pesquisa' : 'Próximo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}