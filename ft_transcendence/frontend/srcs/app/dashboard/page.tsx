import Profil from '../components/forms/Profil';
import Avatar from '../../public/avatar.svg';

function Dashboard() {
  return (
    <main className='w-screen h-screen flex justify-center items-center font-Orbitron NeonShadow'>
      <div className='w-1/3 h-1/3'>
        <Profil  avatar={Avatar}
          firstname='Mohamed'
          lastname='Boundagani' 
          login='ahel-bah' 
          online={true} 
          matchPlayed={0}
          winPercent={70}
          level={2}
          percentage={53}
        />
      </div>
    </main>
  );
}

export default Dashboard;
