import React, { useRef, useState, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DropdownOption {
  value: string | number
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string | number
  placeholder?: string
  onChange: (value: string | number) => void
  className?: string
  buttonClassName?: string
  menuClassName?: string
  disabled?: boolean
  multiple?: boolean
  searchable?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select option...',
  onChange,
  className,
  buttonClassName,
  menuClassName,
  disabled = false,
  multiple = false,
  searchable = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Filter options based on search
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  // Get selected option(s)
  const selectedOption = options.find(option => option.value === value)
  const selectedLabel = selectedOption?.label || placeholder

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return

    if (multiple) {
      // Handle multiple selection (would need array value type)
      console.warn('Multiple selection not fully implemented')
    } else {
      onChange(option.value)
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  const handleButtonClick = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen && searchable) {
      // Focus search input when opening
      setTimeout(() => {
        const searchInput = dropdownRef.current?.querySelector('input')
        if (searchInput) {
          searchInput.focus()
        }
      }, 100)
    }
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)} {...props}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-left bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm transition-colors duration-200',
          'hover:border-secondary-400 dark:hover:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'ring-2 ring-primary-500 border-primary-500',
          buttonClassName
        )}
      >
        <span className={cn(
          'block truncate',
          !selectedOption && 'text-secondary-500 dark:text-secondary-400'
        )}>
          {selectedOption?.icon && (
            <span className="inline-flex items-center mr-2">
              {selectedOption.icon}
            </span>
          )}
          {selectedLabel}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 text-secondary-400 transition-transform duration-200',
          isOpen && 'transform rotate-180'
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          'absolute z-50 w-full mt-1 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-lg max-h-60 overflow-auto',
          menuClassName
        )}>
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-secondary-200 dark:border-secondary-700">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-secondary-500 dark:text-secondary-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 text-left text-sm transition-colors duration-150',
                    'hover:bg-secondary-50 dark:hover:bg-secondary-700',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    value === option.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  )}
                >
                  <span className="flex items-center">
                    {option.icon && (
                      <span className="mr-2">
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
