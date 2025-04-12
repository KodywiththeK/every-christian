import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Label 변형 정의
const labelVariants = cva(
  // 기본 스타일
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      // Label 종류
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

// Label 컴포넌트 props 타입
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {}

// Label 컴포넌트
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, variant, children, ...props }, ref) => {
  return (
    <label className={cn(labelVariants({ variant, className }))} ref={ref} {...props}>
      {children}
    </label>
  )
})
Label.displayName = "Label"

export { Label, labelVariants }

