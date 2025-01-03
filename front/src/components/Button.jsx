const Button = ({ titulo, className, type, ...rest }) => {
  return (
    <button className={`inline-flex justify-center items-center px-5 py-2.5 h-10 font-bold text-white rounded-lg bg-[#5d8a69] shadow-xl cursor-pointer hover:bg-[#31b554] transition-shadow transition-transform duration-300 ease-in-out ${className}`}
      type={type} {...rest}>
      <h2> {titulo} </h2>
    </button>
  );
};
export default Button;
