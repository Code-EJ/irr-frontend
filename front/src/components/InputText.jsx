import { useField, useFormikContext } from "formik";

const InputText = ({ onChange, titulo, className, titleStyle, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  return (
    <div className="text-black flex flex-col mt-3.5">
      <div className="w-full flex mb-3.5">
        <b className={`text-3.5 font-bold ${titleStyle}`}>{titulo}</b>
      </div>
      <input
        className={`h-9 rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow transition-transform duration-300 hover:shadow-xl focus:outline-none focus:shadow-xl ${className}`}
        {...props}
        {...field}
        onChange={(event) => {
          setFieldValue(field.name, event.target.value);
          if (onChange) {
            onChange(event.target.value);
          }
        }}
      />
    </div>
  );
};
export default InputText;
