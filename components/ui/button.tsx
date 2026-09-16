import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "onDark";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "default" | "sm";
}

const variants: Record<Variant, string> = {
  primary: "btn-p",
  secondary: "btn-s",
  onDark: "btn-on-dark",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn("btn", variants[variant], size === "sm" && "btn-sm", className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: "default" | "sm";
}

export function LinkButton({ className, variant = "secondary", size = "default", ...props }: LinkButtonProps) {
  return (
    <a
      className={cn("btn", variants[variant], size === "sm" && "btn-sm", className)}
      {...props}
    />
  );
}
