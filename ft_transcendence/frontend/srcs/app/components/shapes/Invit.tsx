import close from '../../../public/close.svg';
import Image from 'next/image';
import Pdp from './Pdp';
import SimpleButton from '../buttons/simpleButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type newType = {
  closeModal?: any;
  avatar?: any;
  login: string;
  accept: any;
  delete: any;
};

function Invit(props: newType) {
  return (
    <div className="h-full w-full flex flex-col font-Orbitron NeonShadow">
      <div className="flex justify-end items-center h-[15%] w-full ">
        <button type="button" onClick={props.closeModal}>
          <Image src={close} alt="close" className="w-10 h-10" />
        </button>
      </div>
      <div className="w-full  flex justify-center h-[25%] items-center">Friend request</div>
      <div className="h-1/2 w-full flex flex-row ">
        <div className="h-full w-1/2 flex justify-center items-center">
          <Pdp name={props.login} color={false} image={props.avatar} />
        </div>
        <div className="h-[90%] pt-2 w-[40%] flex flex-col justify-center pr-4 space-y-3">
          <SimpleButton buttonType="button" content="Accept" handleClick={props.accept} />
          <SimpleButton buttonType="button" content="Delete" handleClick={props.delete} />
        </div>
      </div>
    </div>
  );
}

export default Invit;
