import { useField, useFormikContext } from "formik";
import { inputStyle } from "./styles/InputStyle";

const InputText = ({ onChange, titulo, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  return (
    <div
      style={{
        color: "black",
        display: "flex",
        flexDirection: "column",
        marginTop: "15px",
      }}
    >
      <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
        <b style={{ fontSize: "15px", fontStyle: "bold" }}>{titulo}</b>
      </div>
      <input
        style={inputStyle}
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
