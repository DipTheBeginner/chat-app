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



export default function MessageBox({ selectedGroup }: Props) {


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
        const socket = getSocket();

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "receive-message" &&
                data.message.groupId === selectedGroup) {
                setMessages((prev) => [...prev, data.message]);
            }
        }
    }, [selectedGroup])



    function handleSendMessage() {

        console.log("Send button clicked")
        

        console.log("selectedGroup:", selectedGroup);
        console.log("message:", `"${message}"`);


        if (!selectedGroup) {
            console.log("no group selected");
            return;
        }

        if (!message.trim()) return;

        const socket = getSocket();
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
        <div className="h-screen bg-slate-200 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="mb-2 rounded bg-green-600 p-2 wrap-normal">
                        {msg.content}
                    </div>
                ))}
            </div>


            <div className="border-t p-4 flex flex-row">
                <input type="text"
                    placeholder="Type a message"
                    className="flex-1 rounded border px-4 py-2 outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} />


                <button className="cursor-pointer text-lg font-semibold rounded bg-blue-600" onClick={handleSendMessage}>Send</button>


            </div>


        </div>
    )


}