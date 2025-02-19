import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
        link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline dark:text-blue-400",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
        yellow: "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400",
        dark: "bg-black text-white hover:bg-gray-900 focus:ring-gray-600",
        white: "bg-white text-black border border-gray-300 hover:bg-gray-100 focus:ring-gray-400",
        outline: "border border-gray-400 text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
