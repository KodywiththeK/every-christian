import React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/design/atoms/Label/Label"
import { Input, type InputProps } from "@/design/atoms/Input/Input"
import { AlertCircle, CheckCircle } from "lucide-react"

// 폼 필드 컴포넌트 props 타입
export interface FormFieldProps extends Omit<InputProps, "variant"> {
  label?: string
  helperText?: string
  error?: string
  success?: string
  required?: boolean
  optional?: boolean
}

// 폼 필드 컴포넌트
const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, helperText, error, success, required, optional, className, ...props }, ref) => {
    // 인풋 변형 결정
    const inputVariant = error ? "error" : success ? "success" : "default"

    // 고유 ID 생성
    const fieldId = id || `field-${Math.random().toString(36).substring(2, 9)}`

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label htmlFor={fieldId} className={cn(error && "text-red-500", success && "text-green-500")}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
              {optional && <span className="text-gray-400 text-xs ml-1">(선택)</span>}
            </Label>
          </div>
        )}

        <Input
          id={fieldId}
          variant={inputVariant as any}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${fieldId}-error` : success ? `${fieldId}-success` : helperText ? `${fieldId}-helper` : undefined
          }
          rightElement={
            error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : undefined
          }
          ref={ref}
          {...props}
        />

        {error && (
          <p id={`${fieldId}-error`} className="text-xs text-red-500 mt-1">
            {error}
          </p>
        )}

        {!error && success && (
          <p id={`${fieldId}-success`} className="text-xs text-green-500 mt-1">
            {success}
          </p>
        )}

        {!error && !success && helperText && (
          <p id={`${fieldId}-helper`} className="text-xs text-gray-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = "FormField"

export { FormField }

// 확장 고려:
// 1. 다양한 인풋 타입 지원 (select, textarea, checkbox 등)
// 2. 폼 유효성 검사 통합
// 3. 커스텀 유효성 검사 함수 지원

