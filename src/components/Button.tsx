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
  variant: _variant,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={
        "inline-flex justify-center items-center px-5 py-2.5 font-bold rounded-xl bg-green-950 text-white shadow hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed " +
        className
      }
      {...rest}
    >
      {titulo ?? children}
    </button>
  );
}
