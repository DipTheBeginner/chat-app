"use client"

import { useEffect, useState } from "react"
import { getGroupMessages } from "../app/api/groups";
import { getSocket } from "../app/lib/socket";



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

        console.log("selected Group:", selectedGroup)
    }, [selectedGroup])


    useEffect(() => {

        async function setUpSocket() {
            const socket = await getSocket();

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === "receive-message" &&
                    data.message.groupId === selectedGroup) {
                    setMessages((prev) => [...prev, data.message]);
                }
            }

        }

        setUpSocket();



    }, [selectedGroup])



    async function handleSendMessage() {

        console.log("Send button clicked")


        console.log("selectedGroup:", selectedGroup);
        console.log("message:", `"${message}"`);


        if (!selectedGroup) {
            console.log("no group selected");
            return;
        }

        if (!message.trim()) return;

        const socket = await getSocket();
        console.log("socket arrived", socket)

        socket.send(
            JSON.stringify({
                type: "send-message",
                groupId: selectedGroup,
                content: message,
            })
        )

        setMessage("")
    }








    return (
        <div className="h-full bg-[#171717] flex flex-col ">
            <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-[#171717] gap-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="rounded bg-[#154D37] text-white p-2 w-max max-w-md" >
                        {msg.content}
                    </div>
                ))}
            </div>


            <div className="border-t p-4 flex flex-row gap-2 bg-slate-[#171717] text-slate-50">
                <input type="text"
                    placeholder="Type a message"
                    className="flex-1 border px-4 py-2 outline-none bg-[#242526] rounded-4xl"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} />


                <button className="cursor-pointer text-lg font-semibold rounded bg-blue-600 px-6 py-2" onClick={handleSendMessage}>Send</button>


            </div>


        </div>
    )


}