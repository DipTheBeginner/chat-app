import { prisma } from "@repo/database";
import { Socket } from "socket.io";



export default async function joinRooms(socket:Socket) {

    try{
        const userId=socket.data.user.id;


        const groups=await prisma.groupMember.findMany({
            where:{
                userId,
            },
            select:{
                groupId:true,
            }
        })

        for (const group of groups) {
            await socket.join(group.groupId);
            console.log(`User ${userId} joined room ${group.groupId}`)
        }
    }catch(error){
        console.log("Error joined room",error);
    }
    
}