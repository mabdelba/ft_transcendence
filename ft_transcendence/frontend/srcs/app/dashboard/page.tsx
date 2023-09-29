import Profil from '../components/forms/Profil';
import Avatar from '../../public/avatar.svg';
import LastMatch from '../components/forms/LastMatch';
import NewGame from '../components/forms/NewGame';

function Dashboard() {

  const firstName = 'Mohamed';
  const lastName = 'Abdelbar';
  const login = 'mabdelba';
  const matchPlayed = 17;
  const winPercent = 72;
  const level = 2;
  const percentage = 53;
  const online = true;
  return (
    <main className='w-screen h-screen flex justify-center items-center font-Orbitron NeonShadow '>
      <div className='w-full lg:w-2/3 2xl:w-1/3 h-1/3 min-w-[280px] min-h-[400px]'>
        <Profil  avatar={Avatar}
          firstname={firstName}
          lastname={lastName} 
          login={login} 
          online={online} 
          matchPlayed={matchPlayed}
          winPercent={winPercent}
          level={level}
          percentage={percentage}
        />
        {/* <LastMatch />
        <NewGame /> */}
      </div>
    </main>
  );
}

export default Dashboard;
