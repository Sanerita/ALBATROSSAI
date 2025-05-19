// components/ui/Label.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ 
    className,
    children,
    required = false,
    disabled = false,
    size = 'md',
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }

    return (
      <label
        ref={ref}
        className={cn(
          'block font-medium text-gray-700',
          disabled && 'text-gray-400 cursor-not-allowed',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>
    )
  }
)

Label.displayName = 'Label'

export { Label }