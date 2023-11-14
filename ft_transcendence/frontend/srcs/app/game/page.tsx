'use client'
import * as React from 'react'
import Game from './game';
import Matter from 'matter-js';
import { useState, useEffect , useRef} from 'react';
import { Socket, io } from 'socket.io-client';
import { Content } from 'next/font/google';
import Alien from '../../public/alien.svg';
import Logout from '../../public/log-out.svg';
import Image from 'next/image';
import { set } from 'husky';
import { Console } from 'console';
import { useRouter } from 'next/navigation';
import { data } from 'autoprefixer';
import { emit } from 'process';
import Popup from '../components/shapes/Popup';
import GamePopup from '../components/shapes/GamePopup';
import { BiHappyAlt, BiSad, BiLogOut } from 'react-icons/bi';

let game: Game | null = null;

const fetchInfo = async () => {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await fetch(apiUrl, config);
    return res.json();
  };

const gamePage = () => {
    const gameDiv = useRef<HTMLDivElement>(null)
    const [{width, height}, setWindowSize] = useState({width: 0, height: 0})
    const [gameSocket, setGameSocket] = useState<Socket | null>(null)
    const [isLeft, setIsLeft] = useState(false);
    const [gameEnded, setGameEnded] = useState<string>('');
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);

useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        };
        window.addEventListener('resize', handleResize);
        const isPageReloaded = window.performance.navigation.type === 1;

        if (isPageReloaded) {
            console.log('isPageReloaded');
            setIsLeft(true);
            //if page is reloaded, need to check if socket disconnected in move player handler and if so, emit end game to the last socket in the connected user ids array and then remove this user from the array
        }
        else {
               if (typeof window !== 'undefined' && gameSocket === null) {
    
               let socket: Socket = io('http://localhost:3001', {
                   auth: {
                       token: localStorage.getItem('jwtToken'),
                   },
               });
               socket?.on('connect', () => {
                   socket.emit('NewGame', {map: 'map1'});
                   console.log('connectedff', socket.id );
                   game?.setSocket(socket);
               });
    
                   socket?.on('GameState', (data: {player1: Matter.Vector, player2: Matter.Vector, ball: Matter.Vector}) => {
                       game?.setState(data.player1, data.player2, data.ball);
               });

                socket?.on('gameEnded', (data: {state: string}) => {
                    setGameEnded(data.state);
                })
    
               setGameSocket(socket);
            
            }
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

useEffect(() => {
        if (gameDiv.current){
            console.log('gameDiv.current');
            game = new Game(gameDiv.current);
            if (gameSocket)
                game.setSocket(gameSocket)
            game.start(); 
        }
        return () => {
            game?.destroy();
        }
    }, [width, height])

    const [username, setUsername] = useState("Username");
    const [avatar, setAvatar] = useState(Alien);

    fetchInfo()
        .then((data) => {
            setUsername(data.login);
            // setAvatar(data.avatar);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    const handleLeave = () => {;
        gameSocket?.emit('endGame')
        game?.destroy();
        // router.push('/queue');
    }

   useEffect(() => {
        gameSocket?.on('left game', () => {
                setIsLeft(true);
                console.log('isLeft', isLeft);
           })
         if (isLeft) {
                handleLeave();
         }
        
    }, [isLeft, gameSocket])

    useEffect(() => {

        if(gameEnded !== ''){
            console.log('gameEnded', gameEnded);
            setOpenModal(true)
            gameSocket?.off('GameState');
            gameSocket?.off('gameEnded');
            gameSocket?.off('left game');
            gameSocket?.off('connect');
            gameSocket?.off('disconnect');
            setGameSocket(null);
            gameSocket?.disconnect();
            gameSocket?.close();
            game?.destroy();
        }
    }, [gameEnded])

    return (
        <><div className='font-Orbitron w-screen h-screen flex flex-col justify-center items-center'>
            <div className='flex flex-row items-center w-[100%] justify-evenly'>
                <div className="flex flex-row items-center m-2">
                    <div className='NeonShadowBord h-[70px] w-[70px] md:w-[90px] md:h-[90px] m-auto flex'>
                        <Image src={avatar} alt='avatar' className="" />
                    </div>
                    <div className="blueShadow text-[20px] text-[#00B2FF] m-2 hidden md:block">{username}</div>
                </div>
                <button onClick={handleLeave} type="button" className="NeonShadowBord flex flex-row items-center h-fit px-4 py-3 hover:bg-white hover:text-[black] transition-[300]">
                    <Image src={Logout} className='h-[20px]' alt="logout" />
                    <div className="hidden md:block pl-2 text-[15px]">Leave</div>
                </button>
                <div className="flex flex-row items-center m-2">
                    <div className="redShadow text-[20px] text-[#FF0742] m-2 hidden md:block">{username}</div>
                    <div className='NeonShadowBord h-[70px] w-[70px] md:w-[90px] md:h-[90px] m-auto flex'>
                        <Image src={avatar} alt='avatar' className="" />
                    </div>
                </div>
            </div>
            <div className='text-[40px]'>
                0 - 0
            </div>
            <button
                type='button'
                onClick={() => {
                    console.log(gameSocket);
                    gameSocket?.emit('StartGame', { map: 'map1' });
                } }
                className='z-10 h-10 w-52 border'>Start Game</button>
            <div className='w-[100%] h-[80%] flex justify-center items-center' ref={gameDiv}>
            </div>

        </div>
        <GamePopup  openModal={openModal} setOpenModal={setOpenModal}>
            <div className={`h-[50%]  w-full font-Orbitron  text-[30px] 2xl:text-[50px] flex justify-center items-center space-x-4 ${gameEnded == 'win' ? 'text-green-400' : 'text-red-500'} `}>
                {gameEnded === 'win' ? <>
                    <h1>You won</h1>
                    <BiHappyAlt  className="h-15 w-15"/></>
                     : gameEnded === 'lose' && !isLeft ?
                    <>
                        <h1>You lost</h1>
                        <BiSad  className="h-15 w-15"/>
                    </> 
                      : null}
            </div>
            <div className='flex justify-center h-1/2 w-full font-Orbitron items-start'>
            <button onClick={()=> {router.push('/queue')}}  type="button" className="NeonShadowBord flex flex-row items-center h-fit px-4 py-3 hover:bg-white hover:text-[black] outline-none transition-[300]">
                    <BiLogOut size={40} />
                    <div className="pl-2 text-[30px]">Leave</div>
            </button>
            </div>
        </GamePopup>
            </>
    )
}

export default gamePage;