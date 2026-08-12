"use client"

import { useEffect, useRef, useState } from "react"
import { getGroupMessages } from "../app/api/groups";
import { getSocket, sendSocketMessage, subscribeSocket } from "../app/lib/socket";
import { getCurrentUserId } from "../app/api/auth";



type Message = {
    id: string,
    content: string,
    senderId: string,

}

type Props = {
    selectedGroup: string | null;
};



export default function GroupMessageBox({ selectedGroup }: Props) {


    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");

    const myUserId = getCurrentUserId();

    const messagesCurrentRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!selectedGroup) return;


        async function loadMessage() {
            try {
                const data = await getGroupMessages(selectedGroup!);

                setMessages(data.messages)
            } catch (error) {
                console.log(error);
            }

        }

        loadMessage()

        const unsubscribe = subscribeSocket((data) => {

            if (data.type === "receive-message" && data.message.groupId === selectedGroup) {
                setMessages((prev) => [...prev, data.message])
            }
        })

        return unsubscribe;
    }, [selectedGroup])


    useEffect(()=>{
        if(messagesCurrentRef.current){
            messagesCurrentRef.current.scrollTop = messagesCurrentRef.current.scrollHeight
        }
    },[messages])


    async function handleSendMessage() {


        if (!selectedGroup) {
            console.log("no group selected");
            return;
        }

        try {


            await sendSocketMessage({
                type: "send-message",
                groupId: selectedGroup,
                content: message.trim(),
            })

            setMessage("")
        } catch (error) {
            console.error("Failed to send message:", error)
        }



    }








    return (
        <div className="h-full bg-[#171717] flex flex-col ">
            <div
                ref={messagesCurrentRef}
                className="flex-1 flex flex-col overflow-y-auto p-4 bg-[#171717] gap-4">
                {messages.map((msg) => {
                    const isMine = msg.senderId === myUserId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex w-full ${isMine ? "justify-end" : "justify-start"} `}
                        >

                            <div
                                className={`rounded-2xl px-4 py-2 text-slate-50 ${isMine ? "bg-[#154D37]" : "bg-[#242526]"}`}>

                                {msg.content}

                            </div>

                        </div>
                    )


                })

                }
            </div>


            <div className="border-t p-4 flex flex-row gap-2 bg-slate-[#171717] text-slate-50">
                <input type="text"
                    placeholder="Type a message"
                    className="flex-1 border px-4 py-2 outline-none bg-[#242526] rounded-4xl"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />


                <button className="cursor-pointer text-lg font-semibold rounded bg-blue-600 px-6 py-2" onClick={handleSendMessage}>Send</button>


            </div>


        </div>
    )


}