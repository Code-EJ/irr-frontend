type CardPropsType = {
  children: any;
  width: number;
  className: string | null;
  bgColor: string | null;
}


const Card = ({ children, width, className, bgColor, ...rest }: CardPropsType) => {
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
