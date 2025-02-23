import image from "../assets/imgs/background1.jpg";

const BackgroundImage = ({children}) => {
    return (<div
        className="h-full w-full flex justify-center items-center p-8"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </div>
)
}
export default BackgroundImage;