const Card = ({ children, width }) => {
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
