'use client';
import DiscloComp from '../components/shapes/DiscloComp';

function Achievements() {
  const Acquired = ['Facebook', 'Whatsapp', 'Instagram', 'Discord'];
  const Unacquired = [
    'achiev 1',
    'achiev 2',
    'Telegram',
    'Tik Tok',
    'YouTube',
    'Snapchat',
    'X',
    'Netflix',
    'Telegram',
    'Tik Tok',
    'YouTube',
    'Snapchat',
    'X',
    'Netflix',
    'Telegram',
    'Tik Tok',
    'YouTube',
    'Snapchat',
    'X',
    'Netflix',
  ];
  return (
    <main className="w-screen h-auto md:h-screen flex flex-col font-Orbitron min-h-[480px] min-w-[280px]">
      <div className="w-full h-12 md:h-[10%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
        All achievements
      </div>
      <div className="w-full h-auto flex flex-col px-0  md:px-12 space-y-8 md:space-y-12">
        <div className="w-full  h-auto ">
          <DiscloComp
            title="Acquired achievements"
            divArray={Acquired}
            textColor="text-white NeonShadow"
            Color={true}
            hoverColor="hover:text-[#00B2FF] hover:blueShadow"
            isFriend={false}
            image=""
          />
        </div>
        <div className="w-full h-auto ">
          <DiscloComp
            title="Unacquired achievements"
            divArray={Unacquired}
            textColor="white NeonShadow"
            Color={false}
            hoverColor="hover:text-[#FF0742] hover:redShadow"
            isFriend={false}
            image=""
          />
        </div>
      </div>
    </main>
  );
}

export default Achievements;
