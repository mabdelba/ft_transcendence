'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type newType = {
  name: string;
  color: boolean;
  image: string;
  handleClick?: any;
};

function Pdp(props: newType) {
  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center text-xs md:text-base 3xl:text-lg ${
        props.color ? 'blueShadow text-[#00B2FF]' : 'text-[#FF0742] redShadow'
      }`}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={props.handleClick}
          className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] lg:w-[90px] lg:h-[90px] 2xl:w-[105px] 2xl:h-[105px] NeonShadowBord flex items-center justify-center"
        >
          <Image src={props.image} alt="profil" className="w-auto h-auto" width="50" height="50" />
        </button>
        {props.name}
      </div>
    </div>
  );
}

export default Pdp;
