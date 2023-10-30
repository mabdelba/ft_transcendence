'use client'
import { type } from "os";
import { createContext, useState } from "react"
import { StoreID } from "recoil";
import { Socket } from "socket.io";
import { useEffect } from "react";

import { io } from "socket.io-client";


export interface User{
    id? : number,
    login? : string,
    firstName? : string,
    lastName? : string,
    email? : string,
    password? : string,
    avatar? :   string,
    twoFaActive? :   boolean,
    twoFaSecret? :  string,
    state? : number,
    level? : number,
	matchPlayed? : number,
	numberOfGamesPlayed? : number,
	numberOfGamesWon? : number,
    matchData?: any,
    otherProfileAvatar?: string;
    LatestAchievs?: any,
    achievements?: any,
    unacquiredAchiev?: any,
    friendRequestList?: any,
    friendList?: any,
    blockedList?: any,
    history?: any,
    messagesSocket?: any;
    conversations?: any;

}

export const context = createContext<{user: User; setUser: Function}>({user: {}, setUser: ()=>{}});
export const SocketContext = createContext<{socket: any}>({socket: {}});


const Context = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User>({});
    const [socket, setSocket] = useState<any>(null);
    useEffect(() => {
        const sock = io('http://localhost:3000', {
          transports: ['websocket'],
        });
        setSocket(sock);
    }, []);

    return (
        <context.Provider value={{user, setUser}}>
            <SocketContext.Provider value={{socket}}>
                {children}
            </SocketContext.Provider>
        </context.Provider>
    );
}

export default Context;