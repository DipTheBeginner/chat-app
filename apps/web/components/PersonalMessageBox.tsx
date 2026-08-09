import { useEffect, useState } from "react"


type Message = {
    id: string,
    sendorId: string,
    receiverId: string,
    content: string,



}


type props = {
    selectedUser: string | null;
}




export default function PersonalMessageBox({ selectedUser }: props) {


    const [messages, setMessage] = useState<Message[]>([]);


    const [messages, setMessage] = useState("");

    useEffect(() => {

        if (!selectedUser) {
            return;
        }

        async function loadPersonalMessage() {

            try{
                const data=await 
            }
            
        }


    },[selectedUser])





}