import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 배지 변형 정의
const badgeVariants = cva(
  // 기본 스타일
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      // 배지 종류
      variant: {
        default: "bg-[#1A365D] text-white hover:bg-[#15294A]",
        outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        error: "bg-red-500 text-white hover:bg-red-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
      },
      // 배지 크기
      size: {
        default: "h-6",
        sm: "h-5 text-[10px] px-2",
        lg: "h-7 text-sm px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

// 배지 컴포넌트 props 타입
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// 배지 컴포넌트
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <div className={cn(badgeVariants({ variant, size, className }))} ref={ref} {...props}>
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </div>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }

// 확장 고려:
// 1. 카운터 배지
// 2. 제거 가능한 배지
// 3. 애니메이션 배지

