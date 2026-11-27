import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "min-h-11 gap-2 bg-primary px-4 text-primary-foreground hover:bg-primary/90",
  secondary: "min-h-11 border border-border px-4 text-foreground hover:bg-accent",
  icon: "size-10 text-muted-foreground hover:bg-muted hover:text-foreground",
};

type ButtonProps = ComponentProps<"button"> & { variant?: keyof typeof variants };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
