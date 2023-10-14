import alien from '../../../public/alien.svg';
import { useEffect, useState } from 'react';
import Pdp from '../shapes/Pdp';
import axios from 'axios';

type newType = {
  matchPlayed: number;
  login: string;
  router: any;
};

function LastMatch(props: newType) {
  const [matchData, setMatchData] = useState<any>(null);

  async function getMatch() {
    const lastMatchUrl = 'http://localhost:3000/api/atari-pong/v1/profile/last-match-played';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const res = await axios.post(lastMatchUrl, { userLogin: props.login }, config);
      setMatchData(res.data);
    } catch (err) {
      console.log(err);
      // props.router.push('/');
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
			} else {
      getMatch();
    }
    }
  }, [props.login]);


  const myLogin = matchData ? matchData.me : '';
  const oppLogin = matchData ? matchData.other : '';
  const myRes = matchData ? matchData.myScore : 0;
  const oppRes = matchData ? matchData.otherScore : 0;
  let expression = 'You Won!';
  if (oppRes == myRes) expression = 'Draw!';
  else if (oppRes > myRes) expression = 'You Lost!';
  let play = false;
  if (props.matchPlayed == 0) play = true;

  return (
    <div className="w-full h-full  flex flex-col NeonShadowBord">
      <div className="w-full h-[35%] flex justify-start items-center pl-10 text-sm base:text-base 2xl:text-2xl">
        <h1>Last match stats</h1>
      </div>
      {play ? (
        <div className="w-full h-[45%] flex justify-center items-center text-base lg:text-3xl">
          No matches played yet
        </div>
      ) : (
        <div className="w-full h-[65%]  flex flex-row ">
          <div className="h-full w-[18%]"></div>
          <div className="w-[15%] h-[67%] flex flex-col justify-start items-end ">
            <Pdp name={myLogin} color={true} />
          </div>
          <div className="w-[34%] h-[55%]  NeonShadow text-sm base:text-base 2xl:text-2xl flex flex-col justify-around items-center">
            <div>
              {myRes} - {oppRes}
            </div>
            <div>{expression}</div>
          </div>
          <div className="w-[15%] h-[67%] flex  justify-start items-start">
            <Pdp name={oppLogin} color={false}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default LastMatch;
