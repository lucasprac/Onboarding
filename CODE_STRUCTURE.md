# Estrutura do Código - Clean Code

Este documento descreve a organização e as melhores práticas aplicadas no projeto.

## 📁 Estrutura de Pastas

```
src/
├── types/           # Tipos e interfaces compartilhadas
├── constants/       # Constantes e configurações
├── utils/          # Utilitários e funções auxiliares
├── hooks/          # Hooks personalizados
├── components/
│   ├── ui/         # Componentes UI reutilizáveis
│   ├── dashboards/ # Componentes de dashboard
│   └── surveys/    # Componentes de pesquisa
└── app/            # Páginas e rotas da API
```

## 🏗️ Arquitetura

### 1. Tipos Compartilhados (`src/types/`)
- **`index.ts`**: Todas as interfaces e tipos TypeScript
- Benefícios: Reutilização, type safety, manutenção centralizada

### 2. Constantes (`src/constants/`)
- **`index.ts`**: Configurações, textos, opções de filtros
- Benefícios: Consistência, fácil manutenção, internacionalização

### 3. Utilitários (`src/utils/`)
- **`index.ts`**: Funções puras para cálculos e formatação
- Benefícios: Testabilidade, reutilização, separação de responsabilidades

### 4. Hooks Personalizados (`src/hooks/`)
- **`useSurveyData.ts`**: Lógica de API e filtragem
- **`index.ts`**: Barril para exportações
- Benefícios: Reutilização de lógica, testes isolados

## 🎯 Princípios Aplicados

### Single Responsibility Principle
- Cada componente/função tem uma única responsabilidade
- Exemplo: `MultiSelect` focado apenas na seleção múltipla

### DRY (Don't Repeat Yourself)
- Constantes centralizadas evitam repetição
- Utilitários reutilizáveis para cálculos comuns

### Separation of Concerns
- Lógica de negócio separada da UI
- API calls em hooks personalizados
- Formatação em utilitários

### Type Safety
- TypeScript estrito em todo o projeto
- Interfaces bem definidas
- Props tipadas

## 🧩 Componentes Refatorados

### MultiSelect
- **Antes**: Monolítico, difícil de manter
- **Depois**: Dividido em subcomponentes:
  - `MultiSelectTrigger`: Botão principal
  - `MultiSelectDropdown`: Menu de opções
  - `MultiSelectOption`: Item individual
  - `ClickOutsideOverlay`: Overlay para fechar

### Dashboard3Days
- **Antes**: Lógica misturada com UI
- **Depois**: 
  - Hook `useSurveyData` para lógica
  - Utilitários para cálculos
  - Constantes para textos e opções

## 📋 Padrões de Código

### Nomenclatura
- Componentes: PascalCase
- Funções/variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Arquivos: kebab-case

### Imports
- Agrupados por tipo (bibliotecas, componentes locais, utilitários)
- Alias `@/` para caminhos relativos

### Exportações
- Exportações nomeadas para utilitários
- Exportações default para componentes principais
- Barris (`index.ts`) para agrupar exportações

## 🔧 Ferramentas e Configurações

### ESLint
- Configurado para TypeScript
- Regras para clean code
- Apenas warnings de baixo impacto

### Estrutura de Dados
- Interfaces imutáveis
- Tipos explícitos
- Validação de entrada

## 🚀 Benefícios Alcançados

1. **Manutenibilidade**: Código mais fácil de entender e modificar
2. **Reutilização**: Componentes e funções podem ser usados em múltiplos lugares
3. **Testabilidade**: Lógica separada facilita testes unitários
4. **Performance**: Menos re-renders, melhor otimização
5. **Escalabilidade**: Arquitetura suporta crescimento do projeto

## 📝 Próximos Passos

1. Aplicar mesma refatoração nos outros dashboards
2. Criar testes unitários para utilitários
3. Adicionar documentação JSDoc
4. Implementar tratamento de erros centralizado
5. Adicionar sistema de internacionalização