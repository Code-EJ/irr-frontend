const Card = ({ children, width, className, bgColor, ...rest }) => {
  // PADRAO DE BORDAS: rounded-[40px]
  return (
    <div
      className={`h-auto p-14 text-black ${className} ${bgColor? `bg-[${bgColor}]` : 'bg-white'}`}
      style={{ width: width }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
