import { useRouter } from "next/navigation";
import { useContext } from "react";
import { User, context } from "../../../context/context";


function InviteToast() {
  const router = useRouter();
  const {user, setUser} = useContext(context);
  
  function handlAccept() {
    const _user : User = user;
    _user.gameType = 'private';
    setUser(_user);
    router.push('/queue');
  }

  function handlCancel() {
    console.log('cancel');
  }

  return (
    <div className="toast font-Orbitron">
      <div className="toast__content">
        <div className="toast__content__title flex justify-center">
          you got invited to a game
        </div>
        <div className="flex flex-row content-center justify-evenly my-3">
        <button onClick={handlAccept} className="NeonShadow p-1 items-center justify-center NBord blueShadowBord hover:bg-white hover:text-black duration-300">Accept</button>
        <button onClick={handlCancel} className="NeonShadow p-1 items-center justify-center NBord redShadowBord hover:bg-white hover:text-black duration-300">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default InviteToast;