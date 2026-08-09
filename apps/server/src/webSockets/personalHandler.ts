import WebSocket from "ws";
import { AuthenticatedWebSocket } from "./roomManger";
import { prisma } from "@repo/database";
import { getOnlineUser } from "./personalManager";







export default async function personalHandler(ws: AuthenticatedWebSocket, rawMessage: WebSocket.RawData) {


    try {

        const data = JSON.parse(rawMessage.toString());

        console.log("personal message", data);

        if (data.type !== "send-personal-message") {
            return;
        }

        const senderId = ws.user!.id;
        const receiverId = data.receiverId
        const content = data.content;



        if (!receiverId || !content?.trim()) {
            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Receiver and message are required",
                })
            );

            return;
        }


        const message = await prisma.message.create({
            data: {
                receiverId,
                content,
                senderId
            }
        })


        console.log("Personal message saved:", message);

        const receiverSocket = getOnlineUser(receiverId);

        if (receiverSocket) {
            receiverSocket.send(
                JSON.stringify({
                    type: "receive-personal-message",
                    message
                })
            )
        }


        ws.send(
            JSON.stringify({
                type: "personal-message-sent",
                message
            })
        )

    } catch (error) {
        console.error("personal message error", error);


        ws.send(
            JSON.stringify({
                type: "error",
                message: "failed to send personal message"
            })
        )
    };




}