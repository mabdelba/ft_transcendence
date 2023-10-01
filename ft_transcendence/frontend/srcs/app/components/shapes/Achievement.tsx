
import Image from "next/image";
import blueAchiev from "../../../public/blueAchiev.svg";


type newType = {
    name: string;
}

function Achievement(props: newType){


    return(
        <div className="w-full h-full flex flex-col justify-center items-center text-xs lg:text-lg blueShadow text-[#00B2FF]">
            <Image src={ blueAchiev } alt="achievment"/>
             {props.name}
        </div>
    );
}

export default Achievement;