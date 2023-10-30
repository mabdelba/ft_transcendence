'use client'
import { createContext, useState } from "react"
import { Socket } from "socket.io";

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

}

export const context = createContext<{user: User; setUser: Function, socket: any}>({user: {}, setUser: ()=>{}, socket: {}});

const Context = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User>({});
    const socket = io('http://localhost:3000', {
        transports: ['websocket'],
    });

    return (
        <context.Provider value={{user, setUser, socket}}>
            {children}
        </context.Provider>
    );
}

export default Context;