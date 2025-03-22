// eslint-disable-next-line react/prop-types
type ButtonProps = {
  titulo: string;
  className: string;
  type: "submit" | "reset" | "button" | undefined;
  onClick: any;
  disabled: boolean | undefined;
}

const Button = ({ titulo, className, type, disabled, ...rest }: ButtonProps) => {
  return (
    <button disabled={disabled} className={`inline-flex justify-center items-center px-5 py-2.5 h-10 font-bold rounded-2xl bg-green-950 shadow-xl cursor-pointer hover:bg-[#31b554] hover:border-none transition-transform duration-300 ease-in-out ${className}`}
      type={type} {...rest}>
      <h2> {titulo} </h2>
    </button>
  );
};
export default Button;
