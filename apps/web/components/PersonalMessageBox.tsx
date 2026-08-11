import { useEffect, useState } from "react"
import { getPersonalChat } from "../app/api/chats";
import { sendSocketMessage, subscribeSocket } from "../app/lib/socket";
import { getCurrentUserId } from "../app/api/auth";


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

    const myUserId = getCurrentUserId();



    useEffect(() => {

        setMessage("")


        if (!selectedUser) {
            setMessages([]);
            return;
        }




        async function setup() {
            try {
                const data = await getPersonalChat(selectedUser!);

                if (data.success) {
                    setMessages(data.messages);
                }

            } catch (error) {
                console.error("Failed to load personal chat", error);
            }
        }


        setup()


        const unsubscribe = subscribeSocket((data) => {

            if (
                data.type === "personal-message-sent" && data.message.receiverId === selectedUser
            ) {
                setMessages((prev) => [...prev, data.message])
            }


            if (
                data.type === "receive-personal-message" && data.message.senderId === selectedUser
            ) {
                setMessages((prev) => [...prev, data.message])
            }
        });


        return unsubscribe

    }, [selectedUser])



    async function handleSendMessage() {

        if (!selectedUser) {
            console.log("no users selected")
            return;
        }

        if (!message.trim()) return;

        try {

            await sendSocketMessage({
                type: "send-personal-message",
                receiverId: selectedUser,
                content: message.trim(),
            })


            setMessage("");
        } catch (error) {
            console.error("Failed to send message", error);
        }

    }



    return (

        <div className="h-full bg-[#171717] flex flex-col ">
            <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-[#171717] gap-4">
                {messages.map((msg) => {
                    const isMine = msg.senderId === myUserId;

                    return (
                        <div

                            key={msg.id}
                            className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                        >

                            <div

                                className={`rounded-2xl px-4 py-2 text-slate-50 max-w-md ${isMine ? "bg-[#154D37]" : "bg-[#242526]"}`}
                            >
                                {msg.content}


                            </div>

                        </div>
                    )
                })}
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