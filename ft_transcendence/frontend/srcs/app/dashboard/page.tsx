import Profil from '../components/forms/Profil';
import Avatar from '../../public/avatar.svg';
import LastMatch from '../components/forms/LastMatch';
import NewGame from '../components/forms/NewGame';
import Achievement from '../components/shapes/Achievement';
import LatestAchiev from '../components/forms/LatestAchiev';

function Dashboard() {

  const firstName = 'Mohamed';
  const lastName = 'Abdelbar';
  const login = 'mabdelba';
  const matchPlayed = 12;
  const winPercent = 72;
  const level = 2;
  const percentage = 53;
  const online = true;

  return (
    <main className='w-screen h-screen font-Orbitron NeonShadow '>
      <div className='w-full h-[8%] pl-12 font-semibold flex justify-start items-center text-3xl'>
        Hello {firstName}!
      </div>
      <div className='w-full h-[84%] flex flex-row px-12 space-x-12'>
        <div className='h-full w-[60%] space-y-12  flex flex-col'>
          <div className='w-full h-[60%]'>
            <Profil
              avatar={Avatar}
              firstname={firstName}
              lastname={lastName}
              login={login}
              matchPlayed={matchPlayed}
              winPercent={winPercent}
              level={level}
              percentage={percentage}
              online={online}
            />
          </div>
          <div className='w-full h-[40%]'>
            <LastMatch matchPlayed={matchPlayed}/>
          </div>
        </div>
        <div className='h-full w-[40%] space-y-12  flex flex-col '>
          <div className='w-full h-[40%]'>
            <NewGame />
          </div>      
          <div className='w-full h-[60%]'>
            <LatestAchiev />
          </div>
        </div>
      </div>
      <div className='w-full h-[8%]'></div>
    </main>
  );
}

export default Dashboard;
