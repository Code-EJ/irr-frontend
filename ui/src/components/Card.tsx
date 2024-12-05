type CardProps = {
  children: any;
};

const Card = ({ children }: CardProps) => {
  return (
    <div
      style={{
        width: "500px",
        height: "fit-content",
        backgroundColor: "white",
        borderRadius: "50px",
        padding: "50px",
        color: "black",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
