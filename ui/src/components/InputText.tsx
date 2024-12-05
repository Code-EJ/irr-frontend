import { inputStyle } from "./styles/InputStyle";

type InputTextProps = {
  titulo: string;
};

const InputText = ({ titulo }: InputTextProps) => {
  return (
    <div
      style={{
        color: "black",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%", display: "flex" }}>
        <label> {titulo} </label>
      </div>
      <input style={inputStyle} />
    </div>
  );
};
export default InputText;
