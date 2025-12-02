'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, ChevronDown, X } from 'lucide-react'
import { SelectOption } from '@/types'
import { PLACEHOLDERS } from '@/constants'

interface MultiSelectProps {
  options: SelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export default function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = PLACEHOLDERS.MULTI_SELECT,
  className = '' 
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const handleRemove = (value: string) => {
    const newSelected = selected.filter(item => item !== value)
    onChange(newSelected)
  }

  const handleClearAll = () => {
    onChange([])
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const getSelectedLabels = (): string[] => {
    return selected.map(value => {
      const option = options.find(opt => opt.value === value)
      return option ? option.label : value
    })
  }

  const isOptionSelected = (value: string): boolean => {
    return selected.includes(value)
  }

  const getOptionLabel = (value: string): string => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <MultiSelectTrigger
        placeholder={placeholder}
        selectedLabels={getSelectedLabels()}
        onToggle={() => setIsOpen(!isOpen)}
        onRemoveItem={handleRemove}
      />
      
      {isOpen && (
        <>
          <MultiSelectDropdown
            options={options}
            selected={selected}
            onToggle={handleToggle}
            onClearAll={handleClearAll}
            onClose={() => setIsOpen(false)}
          />
          <ClickOutsideOverlay onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  )
}

interface MultiSelectTriggerProps {
  placeholder: string
  selectedLabels: string[]
  onToggle: () => void
  onRemoveItem: (value: string) => void
}

function MultiSelectTrigger({ 
  placeholder, 
  selectedLabels, 
  onToggle, 
  onRemoveItem 
}: MultiSelectTriggerProps) {
  return (
    <Button
      variant="outline"
      onClick={onToggle}
      className="w-full justify-between h-auto min-h-[40px] p-2"
      aria-expanded={false}
      aria-haspopup="listbox"
    >
      <div className="flex flex-wrap gap-1 flex-1">
        {selectedLabels.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          selectedLabels.map((label, index) => (
            <Badge 
              key={`${label}-${index}`} 
              variant="secondary" 
              className="mr-1 mb-1"
            >
              {label}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveItem(label)
                }}
                aria-label={`Remover ${label}`}
              />
            </Badge>
          ))
        )}
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )
}

interface MultiSelectDropdownProps {
  options: SelectOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClearAll: () => void
  onClose: () => void
}

function MultiSelectDropdown({ 
  options, 
  selected, 
  onToggle, 
  onClearAll, 
  onClose 
}: MultiSelectDropdownProps) {
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      <div className="p-2 border-b border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs"
        >
          Limpar todos
        </Button>
      </div>
      
      <div className="p-1" role="listbox">
        {options.map(option => (
          <MultiSelectOption
            key={option.value}
            option={option}
            isSelected={selected.includes(option.value)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

interface MultiSelectOptionProps {
  option: SelectOption
  isSelected: boolean
  onToggle: (value: string) => void
}

function MultiSelectOption({ option, isSelected, onToggle }: MultiSelectOptionProps) {
  return (
    <div
      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
      onClick={() => onToggle(option.value)}
      role="option"
      aria-selected={isSelected}
    >
      <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
        isSelected 
          ? 'bg-blue-600 border-blue-600' 
          : 'border-gray-300'
      }`}>
        {isSelected && (
          <Check className="h-3 w-3 text-white" />
        )}
      </div>
      <span className="text-sm">{option.label}</span>
    </div>
  )
}

interface ClickOutsideOverlayProps {
  onClick: () => void
}

function ClickOutsideOverlay({ onClick }: ClickOutsideOverlayProps) {
  return (
    <div 
      className="fixed inset-0 z-40" 
      onClick={onClick}
      aria-hidden="true"
    />
  )
}