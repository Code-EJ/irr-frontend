import { Children } from "react";
import Image from "../assets/background1.jpg";

const BackgroundImage = ({children}) => {
    return (<div
        className="h-full w-full flex justify-center items-center p-8"
        style={{
          backgroundImage: `url(${Image})`,
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