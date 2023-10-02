
import Image from "next/image";
import redAchiev from "../../../public/redAchiev.svg";
import blueAchiev from "../../../public/blueAchiev.svg";


type newType = {
    name: string;
    color: boolean;
}

function Achievement(props: newType){


    return(
        <div className={`w-full h-full flex flex-col justify-center items-center text-xs 2xl:text-lg ${props.color? 'blueShadow text-[#00B2FF]': 'text-[#FF0742] redShadow'}`}>
            <Image src={props.color ? blueAchiev : redAchiev} alt="achievment" className="w-auto h-auto"/>
            {props.name}
        </div>
    );
}

export default Achievement;