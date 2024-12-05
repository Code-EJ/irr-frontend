import { buttonStyle } from "./styles/ButtonStyle";

type ButtonProps = {
  titulo: string;
  onClick: any;
};

const Button = ({ titulo, onClick }: ButtonProps) => {
  return (
    <button style={buttonStyle} onClick={() => onClick()}>
      <h2 style={{ color: "white" }}> {titulo} </h2>
    </button>
  );
};
export default Button;
