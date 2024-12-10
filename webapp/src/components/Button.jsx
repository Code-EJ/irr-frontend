import { buttonStyle } from "./styles/ButtonStyle";

const Button = ({ titulo, onClick, style }) => {
  return (
    <button style={{ ...buttonStyle, ...style }} onClick={() => onClick()}>
      <h2 style={{ color: "white" }}> {titulo} </h2>
    </button>
  );
};
export default Button;
