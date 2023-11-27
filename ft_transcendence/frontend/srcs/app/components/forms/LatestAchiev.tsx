import Achievement from '../shapes/Achievement';
import Image from 'next/image';
import NoAchiev from '../../../public/noAchiev.svg';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User, context } from '../../../context/context';

type newType = {
  login: string;
  myProfile?: boolean;
  router: any;
};

function LatestAchiev(props: newType) {
  let limiter = 1;
  const [achievement, setAchievement] = useState<any>(null);
  const {user, setUser} = useContext(context);

  async function getAchievements() {

    if((!props.myProfile && !user.matchData) || props.myProfile){ 
    const lastAchievUrl = 'http://e3r8p14.1337.ma:3000/api/atari-pong/v1/profile/last-achievement';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(lastAchievUrl, { userLogin: props.login }, config)
      .then((res) => {
        if(!props.myProfile){
          const _user : User = user;
          _user.LatestAchievs = res.data[0];
          setUser(_user);
        }
        setAchievement(res.data[0]);
      })
      .catch((err) => {
        // console.log(err);
      });
    }
    else
      setAchievement(user.LatestAchievs);
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
			}
    else getAchievements();
    }
  }, [props.login]);
  const divArray = achievement?.achievements?.map((achiev: any) => achiev.name) || [];
  if (divArray[0] == null) limiter = 0;
  return (
    <div className="h-full w-full flex flex-col NeonShadowBord">
      <div className="w-full h-1/4 flex xl:justify-start justify-center xl:pl-10 items-center text-sm base:text-base 2xl:text-2xl">
        Latest achievements
      </div>
      {
        !achievement ?
        <div className=" flex flex-col space-y-2 w-full h-[80%] items-center justify-center">
        <h1>Loading</h1>
        <div className="spinner"></div>
        </div> 
      :
        limiter == 0 ? (
        <div className="w-full h-1/2 flex flex-col text-2xl justify-center items-center">
          <Image src={NoAchiev} alt="Achievement" />
          No achievements
        </div>
      ) :
       (
        <div className="w-full h-3/4 px-1 xl:px-10 pb-10 grid grid-rows-2 grid-cols-3  gap-1 2xl:gap-4">
          {divArray.map((divName: any) => (
            <div key={divName}>
              <Achievement name={divName} color={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestAchiev;
