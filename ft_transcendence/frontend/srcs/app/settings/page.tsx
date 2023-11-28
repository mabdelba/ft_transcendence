'use client';
import { use, useContext, useEffect, useState } from "react";
import OptionBar from "../components/forms/OptionBar";
import SimpleInput from "../components/inputs/simpleInput";
import SimpleButton from "../components/buttons/simpleButton";
import Pdp from "../components/shapes/Pdp";
import Upload from "../../public/uploadIcon.svg"
import BlackUpload from "../../public/blackupload.svg"
import axios from "axios";
import Login from "../components/forms/Login";
import UploadAvatar from "../components/buttons/uploadAvatar";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { context, SocketContext, User } from "../../context/context";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { set } from "husky";
import Close from "../../public/close.svg";
import InviteToast from "../components/shapes/invitetoast";




function Settings() {

    const Regex = /\b([a-zA-ZÀ-ÿ][-a-zA-ZÀ-ÿ. ']+[ ]*)+/;
    const EmRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const UserRegex = /^[^\s]+$/;
    const router = useRouter();

    const [selectFileError, setSelectFileError] = useState(true);
    const [name, setName] = useState<any>('');
    const [nameError, setNameError] = useState(true);

    const [Id, setId] = useState<number | undefined>(0);
    const [Lastname, setLastName] = useState<any>('');
    const [lastnameError, setlastNameError] = useState(true);

    const [username, setUsername] = useState<any>('');
    const [usernameError, setUsernameError] = useState(true);

    const [email, setEmail] = useState<any>('');
    const [emailError, setEmailError] = useState(true);

    const [filename, setFilename] = useState('*No file selected');
    const [avatarToUpload , setAvatarToUpload] = useState<any>(null);
    const [isChecked, setIsChecked] = useState<any>(false);

    let [counter, setCounter] = useState(0);
    
    var [Array, setArray] = useState<string[]>([]);
    
    const {user, setUser} = useContext(context);
    const { socket } = useContext(SocketContext);

    const [avatarUrl, setAvatarUrl] = useState<any>('')

    useEffect(()=> {
        if(socket){
            if(!user.login ){
        
              const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
              const token = localStorage.getItem('jwtToken');
              const config = {
                headers: { Authorization: `Bearer ${token}` },
              };
              axios.get(apiUrl, config)
              .then((response : any) => {
                const _user = response.data;
                socket.emit('online', { token: localStorage.getItem('jwtToken') });
                _user.state = 1;
                setId(_user.id);setName(_user.firstName);setLastName(_user.lastName);setUsername(_user.login);setEmail(_user.email);setAvatarUrl(_user.avatarUrl);setIsChecked(_user.twoFaActive);
                socket?.on('inviteToGame', (data: {senderId: string, login: string}) => {
                    console.log('inviteToGame');
                    toast(<InviteToast senderId={data.senderId} login={data.login}/>,{
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: false,
                      closeOnClick: true,
                      draggable: true,
                      theme: 'dark',
                    });
                  });
                  socket?.on('cancelNotification', () => {
                    console.log('cancelNotification=======')
                    toast.dismiss();
                  });
                setUser(_user);

              })
            }
            else{
                setId(user.id);setName(user.firstName);setLastName(user.lastName);setUsername(user.login);setEmail(user.email);setAvatarUrl(user.avatarUrl);setIsChecked(user.twoFaActive)
            }
            const Temp = [user.firstName || '', user.lastName || '', user.login || '', user.email || ''];
            setArray(Temp)
        }
    }, [socket])

    const handleImage = (e: any) => {

        const selectedFile = e.target.files[0]
        setFilename(e.target.files[0].name);
        setAvatarToUpload(e.target.files[0]);
        setSelectFileError(true);
        if(selectedFile){
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile)
            reader.onload = function (e : any) {
                // Update the avatarUrl state
                setAvatarUrl(e.target.result );
              };
            setAvatarUrl(e.target.result)

        }
        // setAvatarUrl(e.target.files[0] as string);
        // console.log(e.target.files[0]);
    }


    const handleSubmit = async (e: any) => {

        e.preventDefault();
        if ((!nameError || !lastnameError || !emailError || !usernameError )) {
            toast.error('Please fill out all fields with compatible format!');
            return;
          }
          const token = localStorage.getItem('jwtToken');
          const config = {
              headers: { Authorization: `Bearer ${token}` },
          };
        {
            if(name != Array[0]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-firstname";
                await axios.put(url, {firstname: name}, config)
                .then(()=> {
                    const _user : User = user;
                    _user.login = undefined;
                    setUser(_user);
                    // router.push('/dashboard');
                })
                .catch((error)=> {
                    // console.log("errorrrrr", error);
                    toast.error(error.response.data.message);
                })
            } 
            if(Lastname != Array[1]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-lastname";
                await axios.put(url, {lastname: Lastname}, config)
                .then(()=> {
                    const _user : User = user;
                    _user.login = undefined;
                    setUser(_user);
                    // router.push('/dashboard');
                })
                .catch((error)=> {
                    // console.log("errorrrrr", error);
                    toast.error(error.response.data.message);
                
                })
            }
            if(email != Array[3]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-email";
                await axios.put(url, {email: email}, config)
                .then(()=> {
                    const _user : User = user;
                    _user.login = undefined;
                    setUser(_user);
                    // router.push('/dashboard');
                    
                })
                .catch((error)=> {
                    // console.log("errorrrrr", error);
                    toast.error(error.response.data.message);
                })
            }
            {   
                if(!avatarToUpload)
                    setSelectFileError(false);
                else{
    
                    const url = "http://localhost:3000/api/atari-pong/v1/auth/upload-avatar";
                    const formData = new FormData();
                    formData.append('avatar', avatarToUpload);
                    await axios.post(url, formData ,config).then((response)=>{
                        
                        const _user : User = user;
                        _user.avatarUrl = avatarUrl;
                        setUser(_user);
                        // router.push('/dashboard');
                    })
                    .catch((error) => {
                        // console.log("error image: ", error);
                        toast.error(error.response.data.message);
                    })
                }
            }
            if(username != Array[2]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-login";
               await axios.put(url, {login: username}, config).then(() => {
                    // axios.post("http://localhost:3000/api/atari-pong/v1/auth/regenerate-token", {id:Id, login: username}, config).then((response)=> {
                        // console.log("response: ", response.data);
                        socket.emit('offline', { token: localStorage.getItem('jwtToken'), login: username });
                        localStorage.removeItem('jwtToken');
                        const _user : User = user;
                        _user.login = undefined;
                        setUser(_user);

                    router.push('/');
                // });
                }).catch((error)=> {
                    // console.log("errorrrrr", error);
                    toast.error(error.response.data.message);
                })
                
            }
            router.push('/dashboard')
        }


    }

    const [qr, setQr] = useState(Upload);

    const fetchQrCode = async () => {
        const token = localStorage.getItem('jwtToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const url = "http://localhost:3000/api/atari-pong/v1/two-factor-auth/qrcode";
        await axios.get(url, config)
        .then((response) => {
            setQr(response.data);
        })
        .catch((error) => {
            // console.log("error: ", error);
        })
    }

    const [result, setResult] = useState("");
    // console.log("checekd", isChecked);
    // console.log("user", user.twoFaActive);
    const [showPupUp, setshowPupUp] = useState(false);

    const handleChecked = () => {
        if(!isChecked)
        {
            setIsChecked(false);
            fetchQrCode();
            setshowPupUp(!showPupUp);
        }
        else
        {
            const token = localStorage.getItem('jwtToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const url = "http://localhost:3000/api/atari-pong/v1/settings/disable-2fa";
            axios.put(url, {}, config)
            .then((response) => {
                // console.log("response: ", response.data);
                toast.success('Two factor authentication disabled!');
                const _user : User = user;
                _user.twoFaActive = false;
                setUser(_user);
                setIsChecked(false);
            })
            .catch((error) => {
                // console.log("error: ", error);
                toast.error(error.response.data.message);
            })
        }
    }    

    const closeLoginModal = () => {
        setshowPupUp(false);
    };    

    const openLoginModal = () => {
        setshowPupUp(true);
    };    

    const handleQrSubmit = (event: any) => {
        if (result.length !== 6) {
          event.preventDefault();
          toast.error('The code must be 6 digits long.');
        }
        else {
            const token = localStorage.getItem('jwtToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const url = "http://localhost:3000/api/atari-pong/v1/two-factor-auth/verify";
            axios.post(url, {code: result}, config)
            .then((response) => {
                // console.log("response: ", response.data);
                // console.log("res: ", result);
                if (response.data === true)
                {
                toast.success('Two factor authentication activated!');
                const _user : User = user;
                _user.twoFaActive = true;
                setUser(_user);
                setIsChecked(true);
                closeLoginModal();
                }
                else
                    toast.error('Wrong code!');
            })
            .catch((error) => {
                // console.log("error: ", error);
                toast.error(error.response.data.message);
            })
        //   console.log(result);
        }
      };

    return (
    <OptionBar flag={5} >
        <main className="w-full h-full   flex flex-col items-center  font-Orbitron min-h-[550px]  min-w-[280px] pb-2 ">
            <div className="w-full h-[8%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
				Settings
			</div>
            <form
            onSubmit={handleSubmit} 
            className="w-[94%] h-auto md:h-[88%] NeonShadowBord flex flex-col items-center overflow-y-auto ">
                <div className="w-full h-[10%] pl-6 md:pl-12 text-[#00B2FF] font-light blueShadow flex justify-start items-center text-sm xl:text-2xl -yellow-300">
                    Personal Informations
                </div>
                <div className="w-full h-auto md:h-[36%] px-4 md:px-8  xl:px-16 grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-2 def:gap-y-0 md:gap-x-10 text-xs md:text-base 2xl:text-2xl  ">
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">First Name:</div>
                        <SimpleInput holder={'First Name'}  type1={"text"} SetValue={setName} val={name} setError={setNameError}  isVerif={false} flag={true} regex={Regex} />
                    </div>
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">Last Name:</div>
                        <SimpleInput holder={'Last Name'} type1={"text"} SetValue={setLastName} val={Lastname} setError={setlastNameError} flag={true} regex={Regex}   isVerif={false} />
                    </div>
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">Username:</div>
                        <SimpleInput holder={'Username'} type1={"text"} SetValue={setUsername} readonly={false} val={username} setError={setUsernameError} flag={true} regex={UserRegex}  isVerif={false} />
                    </div>
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">Email:</div>
                        <SimpleInput holder={'Email'} type1={"text"} SetValue={setEmail} val={email} setError={setEmailError} flag={true} regex={EmRegex}  isVerif={false} readonly={true} />
                    </div>

                </div>
                <div className="w-full h-auto md:h-[42%]    mt-8 md:mt-0 px-4 md:px-8  xl:px-16 flex  flex-col md:flex-row justify-between  ">
                    <div className=" w-[98%]  md:w-[49%] md:h-full h-auto  flex    flex-col ">
                        <div className="w-full h-auto  md:h-1/2  flex flex-col justify-center">
                            <div className="w-1/6 pl-2">
                                <Pdp  color={false} flag={true} image={avatarUrl} name={""} />
                            </div>
                            <span className={`w-1/2 NeonShadow text-[5px] md:text-[12px]  flex font-light items-center ${selectFileError? '' : 'text-red-600 redShadow'} `}>({filename})</span>
                        </div>
                        <div className="w-full h-auto  lg:h-12 xl:h-16 2xl:h-24  text-xs md:text-base 2xl:text-2xl NeonShadow ">
                            <div className="mb-1 lg:mb-4">Avatar:</div>
                            <input 
                                onChange={handleImage}
                                type="file" id="files" className="hidden" />
                            <label htmlFor="files">
                                <UploadAvatar content="Upload avatar" icon2={BlackUpload} icon={Upload} />
                            </label>
                            
                
                        </div>
                    </div>
                    <div className=" w-[98%]  md:w-[49%] md:h-full h-auto  flex flex-col items-center mt-24 mb-8">
                        <div className="w-full flex flex-row justify-evenly">
                            <div>Two factor authentication</div>
                            <label className="switch mr-3">
                                <input type="checkbox" checked={isChecked} onChange={handleChecked} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="w-2/3 md:w-1/3 h-12 md:h-[9%] my-4 md:my-0">
                    <SimpleButton buttonType={"submit"} content="Save" />
                </div>
            </form>
            <Transition appear show={showPupUp} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeLoginModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex justify-center items-center bg-opacity-40 backdrop-blur bg-[#282828] w-screen h-screen">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="flex flex-col justify-center bg-black NeonShadowBord">
                            <div className="font-Orbitron">
                                <div className="flex justify-end"><Image className="cursor-pointer" src={Close} alt="close" onClick={closeLoginModal} /></div>
                                <div className="text-[24px] mx-8 mb-5 text-center">Scan the Qr bellow:</div>
                                <div className="m-5">
                                    {/* get the qr picture */}
                                    <Image src={qr} alt="upload" className=" m-auto" width={200} height={200} />
                                    <div className="flex flex-row">
                                        <div className="flex flex-row  items-center mx-6 py-5">
                                            <input
                                            placeholder='___ ___'
                                            className='h-[70px] w-[calc(54px*5)] mx-4 bg-[#282828] text-white font-Orbitron text-[39px] text-center neonBord'
                                            type="text"
                                            maxLength={6}
                                            onChange={(e) => setResult(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center m-3">
                                        <button
                                            className="NeonShadowBord px-[30px] py-[10px] text-[24px]"
                                            // change the state of onclick
                                            onClick={handleQrSubmit}
                                        >
                                            submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
        </main>
    </OptionBar>
    )
}

export default Settings;