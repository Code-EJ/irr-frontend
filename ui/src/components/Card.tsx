type CardProps = {
  children: any;
  width: string;
};

const Card = ({ children, width }: CardProps) => {
  return (
    <div
      style={{
        width: width,
        height: "fit-content",
        backgroundColor: "white",
        borderRadius: "40px",
        padding: "50px",
        color: "black",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
