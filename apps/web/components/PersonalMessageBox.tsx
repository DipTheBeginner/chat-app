import { useEffect, useState } from "react"
import { getPersonalChat } from "../app/api/chats";
import { getSocket } from "../app/lib/socket";


type Message = {
    id: string,
    senderId: string,
    receiverId: string,
    content: string,



}


type props = {
    selectedUser: string | null;
}




export default function PersonalMessageBox({ selectedUser }: props) {


    const [messages, setMessages] = useState<Message[]>([]);


    const [message, setMessage] = useState("");

    

    useEffect(() => {

        setMessage("")


        if (!selectedUser) return;

        let socket: WebSocket;


        async function setup() {
            try {
                const data = await getPersonalChat(selectedUser!);

                if (data.success) {
                    setMessages(data.messages);
                }

                socket = await getSocket();


                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    if (data.type === "personal-message-sent" &&
                        data.message.receiverId === selectedUser
                    ) {
                        setMessages((prev) => [...prev, data.message]);
                    }

                    if(data.type === "receive-personal-message" &&
                        data.message.senderId === selectedUser
                    ){
                        setMessages((prev)=>[...prev , data.message])
                    }
                }



            } catch (error) {
                console.error("Failed to load personal chat", error);
            }
        }


        setup()
    }, [selectedUser])



    async function handleSendMessage() {

        if (!selectedUser) {
            console.log("no users selected")
            return;
        }

        if (!message.trim()) return;

        const socket = await getSocket();

        socket.send(
            JSON.stringify({
                type: "send-personal-message",
                receiverId: selectedUser,
                content: message.trim(),

            })
        )

        setMessage("");

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