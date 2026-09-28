/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { HTMLAttributes } from "react";
type CardProps = HTMLAttributes<HTMLDivElement> & {
  width?: number;
  bgColor?: string | null;
};
export default function Card({
  children,
  width,
  className = "",
  bgColor,
  style,
  ...rest
}: CardProps) {
  return (
    <div
      className={"h-auto p-8 text-black bg-white " + className}
      style={{ width, backgroundColor: bgColor ?? undefined, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
