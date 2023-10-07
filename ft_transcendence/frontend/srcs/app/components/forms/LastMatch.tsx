import alien from '../../../public/alien.svg';
import { useEffect, useState } from 'react';
import Pdp from '../shapes/Pdp';
import axios from 'axios';

type newType = {
  matchPlayed: number;
  login: string;
};

function LastMatch(props: newType) {
  let [matchData, setMatchData] = useState<any>(null);
  let [userAvatar, setUserAvatar] = useState(alien);
  let [otherAvatar, setOtherAvatar] = useState(alien);
  function getMatch() {
    const lastMatchUrl = 'http://localhost:3000/api/atari-pong/v1/profile/last-match-played';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(lastMatchUrl, { userLogin: props.login }, config).then((res) => {
      setMatchData(res.data);
    }
    );
  }
  async function getUserAvatar(login: string, flag: boolean = true) {
    if (login !== '')
    {

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, },
        responseType: 'blob',
        body: { userLogin: login}
      };
      let user = await axios.post('http://localhost:3000/api/atari-pong/v1/user/avatar',{ userLogin: login }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, },
        responseType: 'blob',
      });
        const imageBlob = URL.createObjectURL(user.data) as string;
        flag ? setUserAvatar(imageBlob) : setOtherAvatar(imageBlob);
    }
  }
  useEffect(() => {
    getMatch();
    getUserAvatar(props.login);
  }, [props.login]);
  useEffect(() => {
    if (matchData && matchData.other)
    getUserAvatar(matchData.other, false);
  }, [matchData]);

  
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
      <div className="w-full h-[35%] flex justify-start items-center pl-10 text-sm lg:text-2xl">
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
            <Pdp name={myLogin} color={true} image={userAvatar} />
          </div>
          <div className="w-[34%] h-[55%]  NeonShadow text-sm lg:text-3xl flex flex-col justify-around items-center">
            <div>
              {myRes} - {oppRes}
            </div>
            <div>{expression}</div>
          </div>
          <div className="w-[15%] h-[67%] flex  justify-start items-start">
            <Pdp name={oppLogin} color={false} image={otherAvatar} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LastMatch;
