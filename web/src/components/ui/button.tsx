import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-medium whitespace-nowrap shadow-none transition-colors duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground",
        outline:
          "border-border bg-card text-foreground hover:border-line-strong hover:bg-muted hover:text-foreground aria-expanded:border-border aria-expanded:bg-muted",
        secondary:
          "border-border/80 bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "border-danger-soft bg-[var(--danger-soft)] text-destructive hover:bg-[var(--danger-soft)] hover:text-destructive",
        link: "text-primary underline-offset-4 hover:text-primary-hover hover:underline",
      },
      size: {
        default:
          "h-9 min-w-[8.5rem] gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 min-w-0 gap-1 rounded-lg px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 min-w-[6.25rem] gap-1.5 rounded-lg px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-[8.5rem] gap-2 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9 min-w-0",
        "icon-xs":
          "size-7 min-w-0 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 min-w-0 rounded-lg",
        "icon-lg": "size-10 min-w-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
