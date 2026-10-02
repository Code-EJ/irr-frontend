/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { ButtonHTMLAttributes } from "react";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  titulo?: string;
  action?: string;
  variant?: string;
};
export default function Button({
  titulo,
  children,
  className = "",
  type = "button",
  action: _action,
  variant,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={
        "button " +
        (variant === "secondary" ? "button-secondary " : "button-primary ") +
        className
      }
      {...rest}
    >
      {titulo ?? children}
    </button>
  );
}
