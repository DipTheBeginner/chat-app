import { prisma } from "@repo/database";
import type { Socket } from "socket.io";

export default function registerGroupSocket(socket: Socket) {

    //group join
    socket.on("join-group", async (groupId: string) => {
        try {
            const userId = socket.data.user.id;

            const member = await prisma.groupMember.findUnique({
                where: {
                    userId_groupId: {
                        userId,
                        groupId,
                    },
                },
            });

            if (!member) {
                socket.emit("error", "You are not a member of this group");
                return;
            }

            await socket.join(groupId);

            socket.emit("joined-group", {
                success: true,
                groupId,
            });

            console.log(`${userId} joined room ${groupId}`);
        } catch (error) {
            console.error(error);

            socket.emit("error", "Failed to join group");
        }


        //send message
        socket.on(
            "send-message",
            async ({
                groupId,
                content,
            }: {
                groupId: string;
                content: string;
            }) => {

                try{

                    const userId=socket.data.user.id;

                    const member=await prisma.groupMember.findUnique({
                        where:{
                            userId_groupId:{
                                userId,
                                groupId
                            }
                        }
                    })




                    if(!member){
                        socket.emit("error","you are not member of this group");
                        return;
                    }


                    const message=await prisma.message.create({
                        data:{
                            content,
                            senderId:userId,
                            groupId

                        }
                    })


                    socket.to(groupId).emit("receive-message",message);

                    socket.emit("receive-message",message)

                    console.log("Message sent:",message);
                }catch(error){
                    console.log(error);
                    socket.emit("error","Failed to send message")
                }


            }
        );
    });
}