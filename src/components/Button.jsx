// eslint-disable-next-line react/prop-types
const Button = ({ titulo, className, type, ...rest }) => {
  return (
    <button 
      className={`inline-flex justify-center items-center px-5 py-2.5 h-10 font-bold rounded-2xl bg-green-950 shadow-xl cursor-pointer hover:bg-[#31b554] hover:border-none transition-transform duration-300 ease-in-out ${className}`}
      type={type} 
      {...rest}
    >
      <h2> {titulo} </h2>
    </button>
  );
};
export default Button;
