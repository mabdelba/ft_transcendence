'use client'
import * as React from 'react'
import Game from './game';
import Matter from 'matter-js';
import { Socket, io } from 'socket.io-client';

let game: Game | null = null;

const gamePage = () => {
    const gameDiv = React.useRef<HTMLDivElement>(null)
    const [{width, height}, setWindowSize] = React.useState({width: 0, height: 0})

    React.useEffect(() => {
        if (gameDiv.current){
            game = new Game(gameDiv.current);
            game.start();
        }
        return () => {
            game?.destroy();
        }
    }, [width, height])

    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight})
        }
        window.addEventListener('resize', handleResize)


        // let socket: Socket = io('http://localhost:3001');
        // socket.on('connect', () => {
        //     console.log('connected');
        //     game?.setSocket(socket);
        // }) 
        // socket.on('state', (data: {p1: Matter.Vector, p2: Matter.Vector, ball: Matter.Vector}) => {
        //     game?.setState(data.p1, data.p2, data.ball);
        // })
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <h1>Game</h1>
            <div className='w-[80%] h-[90%] bg-red-500 flex justify-center items-center' ref={gameDiv}></div>
        </div>
    )
}

export default gamePage;