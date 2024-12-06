import { buttonStyle } from "./styles/ButtonStyle";

type ButtonProps = {
  titulo: string;
  onClick: any;
  style?: object;
};

const Button = ({ titulo, onClick, style }: ButtonProps) => {
  return (
    <button style={{ ...buttonStyle, ...style }} onClick={() => onClick()}>
      <h2 style={{ color: "white" }}> {titulo} </h2>
    </button>
  );
};
export default Button;
