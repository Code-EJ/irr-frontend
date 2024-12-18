import { buttonStyle } from "./styles/ButtonStyle";

const Button = ({ titulo, style, type, ...rest }) => {
  return (
    <button style={{ ...buttonStyle, ...style }} type={type} {...rest}>
      <h2 style={{ color: "white" }}> {titulo} </h2>
    </button>
  );
};
export default Button;
