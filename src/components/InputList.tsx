/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { SelectHTMLAttributes } from "react";
import { useField } from "formik";
type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  name: string;
  titulo?: string;
  titleStyle?: string;
  options: { value: string | number; name: string }[];
  onChange?: (value: string) => void;
};
export default function InputList({
  onChange,
  titulo,
  options,
  titleStyle = "",
  ...props
}: Props) {
  const [field, , helpers] = useField<string>(props.name);
  return (
    <div className="flex flex-col my-3 gap-2">
      <label htmlFor={props.name} className={titleStyle}>
        {titulo}
      </label>
      <select
        {...props}
        {...field}
        id={props.name}
        className="h-10 border rounded"
        onChange={(event) => {
          void helpers.setValue(event.target.value);
          onChange?.(event.target.value);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
