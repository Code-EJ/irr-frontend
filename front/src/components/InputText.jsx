import { useField, useFormikContext } from "formik";

const InputText = ({ onChange, titulo, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  return (
    <div className=" flex flex-col mt-3.5">
      <div className="w-full flex mb-3.5">
          <b className="text-3.5 font-bold">{titulo}</b>
      </div>
      <input className="w-72 h-9 rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow transition-transform duration-300 hover:shadow-xl focus:outline-none focus:shadow-xl"
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
