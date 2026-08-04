"use client"

import { useState } from "react"



type Message={
    id:string,
    content:string,
    senderId:string,
}


export default function MessageBox(){


    const[messages,setMessages]=useState<Message[]>([]);
    const[message,setMessage]=useState("");


    



    return (
        <div className="h-screen bg-green-700">
            <div>
                {messages.map((msg)=>(
                    <div
                        key={msg.id}
                        className="mb-2 rounded bg-green-600 p-2">
                            {msg.content}  dkkjkfj
                    </div>
                ))}
            </div>


        </div>
    )


}