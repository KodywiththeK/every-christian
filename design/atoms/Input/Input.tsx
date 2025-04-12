import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 인풋 변형 정의
const inputVariants = cva(
  // 기본 스타일
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      // 인풋 종류
      variant: {
        default: "border-gray-200 focus-visible:ring-[#1A365D]",
        error: "border-red-300 focus-visible:ring-red-500 bg-red-50",
        success: "border-green-300 focus-visible:ring-green-500 bg-green-50",
      },
      // 인풋 크기
      size: {
        default: "h-10",
        sm: "h-8 text-xs px-2.5",
        lg: "h-12 text-base px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

// 인풋 컴포넌트 props 타입
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

// 인풋 컴포넌트
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, leftElement, rightElement, type, ...props }, ref) => {
    // 좌우 요소가 있는 경우 래퍼 사용
    if (leftElement || rightElement) {
      return (
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{leftElement}</div>
          )}

          <input
            type={type}
            className={cn(inputVariants({ variant, size, className }), leftElement && "pl-10", rightElement && "pr-10")}
            ref={ref}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{rightElement}</div>
          )}
        </div>
      )
    }

    // 기본 인풋
    return <input type={type} className={cn(inputVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)

Input.displayName = "Input"

export { Input, inputVariants }

// 확장 고려:
// 1. 숫자 전용 인풋
// 2. 마스크 인풋 (전화번호, 카드번호 등)
// 3. 자동 크기 조절 인풋

