/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { InputHTMLAttributes } from "react";
import { useField } from "formik";
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  name: string;
  titulo?: string;
  titleStyle?: string;
  mask?: string;
  onChange?: (value: string) => void;
};
export default function InputText({
  onChange,
  titulo,
  titleStyle = "",
  className = "",
  mask,
  ...props
}: Props) {
  const [field, meta, helpers] = useField<string>(props.name);
  return (
    <div className="text-black flex flex-col gap-2 my-3">
      <label className={titleStyle} htmlFor={props.id ?? props.name}>
        {titulo}
      </label>
      <input
        {...props}
        {...field}
        id={props.id ?? props.name}
        className={"h-10 px-3 rounded-md border border-green-900 " + className}
        aria-invalid={meta.touched && !!meta.error}
        aria-describedby={meta.error ? props.name + "-error" : undefined}
        onChange={(event) => {
          let value = event.target.value;
          if (mask) {
            const digits = value.replace(/\D/g, "");
            let index = 0;
            value = "";
            for (const char of mask) {
              if (index >= digits.length) break;
              value += char === "#" ? digits[index++] : char;
            }
          }
          void helpers.setValue(value);
          onChange?.(value);
        }}
      />
      {meta.touched && meta.error && (
        <span role="alert" id={props.name + "-error"} className="text-red-800">
          {meta.error}
        </span>
      )}
    </div>
  );
}
