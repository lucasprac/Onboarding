'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Dashboard3Days from '@/components/dashboards/Dashboard3Days'
import Dashboard15Days from '@/components/dashboards/Dashboard15Days'
import Dashboard30Days from '@/components/dashboards/Dashboard30Days'
import ENPSDashboard from '@/components/dashboards/ENPSDashboard'
import { LogOut, BarChart3, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticação
    const auth = localStorage.getItem('adminAuthenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin')
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    toast.success('Logout realizado com sucesso!')
    router.push('/welcome')
  }

  const handleExport = async (surveyType: string) => {
    try {
      const response = await fetch(`/api/export?type=${surveyType}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `onboarding_${surveyType}_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Dados exportados com sucesso!')
      } else {
        toast.error('Erro ao exportar dados')
      }
    } catch (error) {
      toast.error('Erro ao exportar dados')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Acesso não autorizado. Redirecionando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header administrativo */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Análise de Dados de Onboarding</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/welcome')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Ver Site</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard-3days" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard-3days" className="text-sm">
              Análise 3 Dias
            </TabsTrigger>
            <TabsTrigger value="dashboard-15days" className="text-sm">
              Análise 15 Dias
            </TabsTrigger>
            <TabsTrigger value="dashboard-30days" className="text-sm">
              Análise 30 Dias
            </TabsTrigger>
            <TabsTrigger value="enps" className="text-sm">
              eNPS
            </TabsTrigger>
            <TabsTrigger value="export" className="text-sm">
              Exportar Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard-3days" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Dados - Pesquisa 3 Dias</CardTitle>
                <CardDescription>
                  Dashboard com métricas e insights da pesquisa de 3 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dashboard3Days />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard-15days" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Dados - Pesquisa 15 Dias</CardTitle>
                <CardDescription>
                  Dashboard com métricas e insights da pesquisa de 15 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dashboard15Days />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard-30days" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Dados - Pesquisa 30 Dias</CardTitle>
                <CardDescription>
                  Dashboard com métricas e insights da pesquisa de 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dashboard30Days />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enps" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>eNPS do Onboarding</CardTitle>
                <CardDescription>
                  Employee Net Promoter Score agregado de todas as pesquisas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ENPSDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Dados</CardTitle>
                <CardDescription>
                  Exporte os dados das pesquisas para análise externa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Pesquisa 3 Dias</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Exporte todos os dados da pesquisa de 3 dias em formato CSV
                    </p>
                    <Button 
                      onClick={() => handleExport('3days')}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Exportar CSV
                    </Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Pesquisa 15 Dias</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Exporte todos os dados da pesquisa de 15 dias em formato CSV
                    </p>
                    <Button 
                      onClick={() => handleExport('15days')}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Exportar CSV
                    </Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Pesquisa 30 Dias</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Exporte todos os dados da pesquisa de 30 dias em formato CSV
                    </p>
                    <Button 
                      onClick={() => handleExport('30days')}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Exportar CSV
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}