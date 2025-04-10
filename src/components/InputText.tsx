import { FieldConfig, useField, useFormikContext } from "formik";

const applyMask = (value, mask) => {
  let maskedValue = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "#") {
      if (value[valueIndex]) {
        maskedValue += value[valueIndex];
        valueIndex++;
      } else {
        break;
      }
    } else {
      maskedValue += mask[i];
    }
  }

  return maskedValue;
};

const InputText = ({ onChange, titulo, className, titleStyle, mask, ...props }) => {

  const [field, meta] = useField({
    name: props.name
  });
  const { setFieldValue } = useFormikContext();

  return (
    <div className="text-black flex flex-col mt-3.5">
      <div className="w-full flex mb-3.5">
        <b className={`text-3.5 font-bold ${titleStyle}`}>{titulo}</b>
      </div>
      <input
        className={`h-9 rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus:outline-none focus:shadow-xl ${className}`}
        {...props}
        {...field}
        // onChange={(event) => {
        //   setFieldValue(field.name, event.target.value);
        //   if (onChange) {
        //     onChange(event.target.value);
        //   }
        // }}
        onChange={(event) => {
          const rawValue = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
          const newValue = mask ? applyMask(rawValue, mask) : event.target.value;

          setFieldValue(field.name, newValue);
          if (onChange) {
            onChange(newValue); // Trigger the custom onChange handler with the masked value
          }
        }}
      />
    </div>
  );
};
export default InputText;
