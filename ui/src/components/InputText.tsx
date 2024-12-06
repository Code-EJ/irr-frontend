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
        marginTop: "15px",
      }}
    >
      <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
        <b style={{ fontSize: "15px", fontStyle: "bold" }}>{titulo}</b>
      </div>
      <input style={inputStyle} />
    </div>
  );
};
export default InputText;
