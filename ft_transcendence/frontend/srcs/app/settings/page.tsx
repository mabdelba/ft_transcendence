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




function Settings() {

    const Regex = /\b([a-zA-ZÀ-ÿ][-a-zA-ZÀ-ÿ. ']+[ ]*)+/;
    const EmRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const UserRegex = /^[^\s]+$/;
    const router = useRouter();

    const [selectFileError, setSelectFileError] = useState(true);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(true);

    const [Id, setId] = useState(0);
    const [Lastname, setLastName] = useState('');
    const [lastnameError, setlastNameError] = useState(true);

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(true);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(true);

    const [filename, setFilename] = useState('*No file selected');
    const [avatarToUpload , setAvatarToUpload] = useState<any>(null);
    let [counter, setCounter] = useState(0);
    
    var [Array, setArray] = useState<string[]>([]);

    const handleImage = (e: any) => {

        setFilename(e.target.files[0].name);
        setAvatarToUpload(e.target.files[0]);
        setSelectFileError(true);
        console.log(e.target.files[0]);
    }
    const {user, setUser} = useContext(context);
    const { socket } = useContext(SocketContext);

    const getData = () => {

        const url = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
        const token = localStorage.getItem('jwtToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        setId(user.id || 0);
        setName(user.firstName || '');
        setLastName(user.lastName || '');
        setUsername(user.login || 'empty');
        setEmail(user.email || '');
        const Temp = [user.firstName || '', user.lastName || '', user.login || '', user.email || ''];
        setArray(Temp);


        // axios.get(url, config).then((response)=> {
        // })
        // .catch((error) => {

        //     console.log("Error from server haha: ", error);
        // })
    }
    useEffect(()=> {

        getData();
        if (!user.state && socket) {
			socket.emit('online', { token: localStorage.getItem('jwtToken') });
			const _user: User = user;
			_user.state = 1;
			setUser(_user);
		}
        
    }, [counter])


    const handleSubmit = (e: any) => {

        e.preventDefault();
        setCounter(counter++);
        if ((!nameError || !lastnameError || !emailError || !usernameError )) {
            toast.error('Please fill out all fields with compatible format!', {
              position: 'top-center',
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            });
            return;
          }
          const token = localStorage.getItem('jwtToken');
          const config = {
              headers: { Authorization: `Bearer ${token}` },
          };
        {
            if(name != Array[0]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-firstname";
                axios.put(url, {firstname: name}, config).catch((error)=> {
                    console.log("errorrrrr", error);
                })
            }
            if(Lastname != Array[1]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-lastname";
                axios.put(url, {lastname: Lastname}, config).catch((error)=> {
                    console.log("errorrrrr", error);
                })
            }
            if(username != Array[2]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-login";
                axios.put(url, {login: username}, config).then((response) => {
                    axios.post("http://localhost:3000/api/atari-pong/v1/auth/regenerate-token", {id:Id, login: username}, config).then((response)=> {
                        // console.log("response: ", response.data);
                    localStorage.setItem('jwtToken', response.data);
                });
                }).catch((error)=> {
                    console.log("errorrrrr", error);
                })
                
            }
            if(email != Array[3]){
                const url = "http://localhost:3000/api/atari-pong/v1/settings/update-email";
                axios.put(url, {email: email}, config).catch((error)=> {
                    console.log("errorrrrr", error);
                })
            }
        
        }

        {   
            if(!avatarToUpload)
                setSelectFileError(false);
            else{

                const url = "http://localhost:3000/api/atari-pong/v1/auth/upload-avatar";
                const formData = new FormData();
                formData.append('avatar', avatarToUpload);
                axios.post(url, formData ,config).then((response)=>{
                })
                .catch((error) => {
                    console.log("error image: ", error);
                })
            }
        }
        toast.success('Changes saved successfully!', {
            position: 'top-center',
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        });
        router.push('/dashboard');
    }

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
                        <SimpleInput holder={'Email'} type1={"text"} SetValue={setEmail} val={email} setError={setEmailError} flag={true} regex={EmRegex}  isVerif={false} />
                    </div>

                </div>
                <div className="w-full h-auto md:h-[42%]    mt-8 md:mt-0 px-4 md:px-8  xl:px-16   ">
                    <div className=" w-full  md:w-1/2 md:h-full h-auto  flex    flex-col ">
                        <div className="w-full h-auto  md:h-1/2  flex flex-col justify-center">
                            <div className="w-1/6 pl-2">
                                <Pdp  color={false} flag={true} image={user.avatar} name={""} />
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
                </div>
                <div className="w-2/3 md:w-1/3 h-12 md:h-[9%] my-4 md:my-0">
                    <SimpleButton buttonType={"submit"} content="Save" />
                </div>
            </form>
        </main>
        <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
    </OptionBar>
    )
}

export default Settings;