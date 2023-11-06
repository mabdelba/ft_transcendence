'use client'
import * as React from 'react'
import Game from './game';
import Matter from 'matter-js';
import { useState, useEffect , useRef} from 'react';
import { Socket, io } from 'socket.io-client';

let game: Game | null = null;

const gamePage = () => {
    const gameDiv = useRef<HTMLDivElement>(null)
    const [{width, height}, setWindowSize] = useState({width: 0, height: 0})
    const [gameSocket, setGameSocket] = useState<Socket | null>(null)
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

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight})
        }
        window.addEventListener('resize', handleResize)


        let socket: Socket = io('http://localhost:3001', {
            auth: {
                token: localStorage.getItem('jwtToken')
            }
        });

        socket?.on('connect', () => {
            socket.emit('NewGame', {map: 'map1'})
            console.log('connected');
            game?.setSocket(socket);
        })

        socket?.on('GameState', (data: {player1: Matter.Vector, player2: Matter.Vector, ball: Matter.Vector}) => {
            game?.setState(data.player1, data.player2, data.ball);
        });

        setGameSocket(socket);
        
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])


    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <button
                type='button'
                onClick={()=> {
                    // console.log(gameSocket?.id);
                    gameSocket?.emit('StartGame', {map: 'map1'})}}
                 className='z-10 h-10 w-52 border'>Start Game</button>
            <div className='w-[80%] h-[90%] bg-red-500 flex justify-center items-center' ref={gameDiv}>               
            </div>

        </div>
    )
}

export default gamePage;