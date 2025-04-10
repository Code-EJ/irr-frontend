import { useField, useFormikContext } from "formik";

const InputList = ({ onChange, titulo, options, titleStyle, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  return (
    <div className="text-black flex flex-col mt-3.5">
      <div className="w-full flex mb-3.5">
        <b className={`text-3.5 font-bold ${titleStyle}`}>{titulo}</b>
      </div>
      <select className="w-full h-9 rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow transition-transform duration-300 hover:shadow-lg focus:shadow-xl focus:outline-none"
        {...props}
        {...field}
        onChange={(event) => {
          console.log(field);

          setFieldValue(field.name, event.target.value);
          if (onChange) {
            onChange(event.target.value);
          }
        }}
      >
        {options.map(opt => (
          <option value={opt.value}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}
export default InputList;