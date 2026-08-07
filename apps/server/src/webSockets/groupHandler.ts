import WebSocket from "ws";
import { AuthenticatedWebSocket, joinRoom, leaveRoom, broadcast } from "./roomManger";
import { ClientMessage } from "../types/websocket";
import { prisma } from "@repo/database";









export default async function groupHandler(ws: AuthenticatedWebSocket, rawMessage: WebSocket.RawData) {

    console.log("Raw websocket:", rawMessage.toString());

    try {
        const data: ClientMessage = JSON.parse(rawMessage.toString());

        console.log("Parsed data:", data);


        switch (data.type) {

            case "join-group":
                await handleJoinGroup(ws, data.groupId);
                break;


            case "leave-group":
                handleLeaveGroup(ws, data.groupId);
                break;

            case "send-message":
                console.log("➡️ send-message case");
                await handleSendMessage(

                    ws,
                    data
                );
                break;

        }


    } catch (error) {
        console.log("Invalid websocket message")
    }

}


async function handleJoinGroup(ws: AuthenticatedWebSocket, groupId: string) {

    const userId = ws.user!.id;

    const member = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId
            },
        },
    });

    if (!member) {
        ws.send(
            JSON.stringify({
                type: "error",
                message: "You are not member of this group"
            })
        );
        return;
    }

    joinRoom(groupId, ws);

    ws.send(
        JSON.stringify({
            type: "joined-group",
            success: true,
            groupId
        })
    );

    console.log(`${userId} joined room ${groupId}`);



}



async function handleSendMessage(ws: AuthenticatedWebSocket,
    data: {
        groupId: string,
        content: string
    }
) {

    console.log("Entered handleSendMessage");
    console.log("groupId:", data.groupId);
    console.log("content:", data.content);

    try {

        const { groupId, content } = data;
        const userId = ws.user!.id;

        const member = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId,
                },
            },
        });



        if (!member) {
            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "You are not a member of this group",
                })
            );
            return;
        }


        const message = await prisma.message.create({
            data: {
                content,
                senderId: userId,
                groupId
            }
        })

        
        console.log("Message saved:", message);

        console.log("Broadcasting to room:", groupId);
        console.log("Broadcasting to room:", groupId);
        broadcast(
            groupId,
            JSON.stringify({
                type: "receive-message",
                message,
            })
        );


    } catch (error) {
        console.error(error);

        ws.send(
            JSON.stringify({
                type: "error",
                message: "Failed to send message",
            })
        );
    }

}



async function handleLeaveGroup(ws: AuthenticatedWebSocket, groupId: string) {

    leaveRoom(groupId, ws);

    ws.send(
        JSON.stringify({
            type: "left-group",
            success: true,
            groupId,
        })
    );


    console.log(`${ws.user!.id} left group ${groupId}`);



}















































