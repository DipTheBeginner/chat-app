import { prisma } from "@repo/database";
import { Request, Response } from "express";



export default async function getGroupMessagesController(req: Request, res: Response) {



    try {

        const userId = req.user!.id;
        const { groupId } = req.params;

        if (typeof groupId !== "string") {
            return res.status(400).json({ message: "Invalid groupId" });
        }



        const member = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                }
            }
        })


        if (!member) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }



        const messages= await prisma.message.findMany({
            where:{
                groupId,

            },
            include:{
                sender:{
                    select:{
                        id:true,
                        username:true
                    },
                },
            },

            orderBy:{
                createdAt:"asc"
            }
        })


        return res.status(200).json({
            success:true,
            messages,
        })

    }catch(error){
        console.error(error);

        return res.status(500).json({
            success:false,
            message:"Failed to fetch message"
        })
    }
    
}