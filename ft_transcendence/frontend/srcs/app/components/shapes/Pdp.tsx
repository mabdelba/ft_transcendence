'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import alien from '../../../public/alien.svg';


type newType = {
  name: string;
  color: boolean;
  image?: string;
  handleClick?: any;
  router?: any;
  flag?: boolean;
};

function Pdp(props: newType) {
  const [userAvatar, setUserAvatar] = useState(alien);
  async function getUserAvatar(login: string) {
    if (login !== '') {
      try {
        const user = await axios.post(
          'http://localhost:3000/api/atari-pong/v1/user/avatar',
          { userLogin: login },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            responseType: 'blob',
          },
        );
        const imageBlob = URL.createObjectURL(user.data) as string;
        console.log('hello there', imageBlob);
        setUserAvatar(imageBlob);
      } catch (err) {
        // props.router.push('/');
        console.log(err);
      }
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
		if (!token) props.router.push('/');
		else {
			const decodedToken = JSON.parse(atob(token.split('.')[1]));
			const exp = decodedToken.exp;
			const current_time = Date.now() / 1000;
			if (exp < current_time) {
				localStorage.removeItem('jwtToken');
				props.router.push('/');
			}    else getUserAvatar(props.name);
    }
  }, [props.name]);

  const viewProfile = () => {
    props.router.push(`/profil/${props.name}`);
  };
  
  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center text-xs md:text-base 3xl:text-lg ${
        props.color ? 'blueShadow text-[#00B2FF]' : 'text-[#FF0742] redShadow'
      }`}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={props.router ? viewProfile : props.handleClick}
          className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] lg:w-[90px] lg:h-[90px] 2xl:w-[105px] 2xl:h-[105px] NeonShadowBord flex items-center justify-center overflow-hidden"
        >
          <Image src={props.image ? props.image : userAvatar} alt="profil" className="w-50 h-50 sm:w-[100px] " width="50" height="50" />
        </button>
        {!props.flag && props.name}
      </div>
    </div>
  );
}

export default Pdp;
