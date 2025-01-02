const Card = ({ children, width, className }) => {
  // PADRAO DE BORDAS: rounded-[40px]
  return (
    <div
      className={`bg-white h-auto p-14 text-black ${className}`}
      style={{width: width}}
    >
      {children}
    </div>
  );
};

export default Card;
