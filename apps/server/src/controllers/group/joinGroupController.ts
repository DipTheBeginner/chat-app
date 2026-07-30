import { prisma } from "@repo/database";
import { Request, Response } from "express";



export default async function joinGroupController(req: Request, res: Response) {

    try {

        const { groupId } = req.params
        const userId = req.user!.id;

        if (typeof groupId !== "string") {
            return res.status(400).json({ message: "Invalid groupId" });
        }

        const group = await prisma.chatGroup.findUnique({
            where: {
                id: groupId
            }
        });

        if(!group){
            return res.status(404).json({
                success:false,
                message:"group not found"
            })
        }

        const existingUser=await prisma.groupMember.findUnique({
            where:{
                userId_groupId:{
                    userId,
                    groupId
                }
            }
        });


        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"You are already added in group"
            })
        }


       await prisma.groupMember.create({
        data:{
            userId,
            groupId
        }
       });


       return res.status(200).json({
        success:true,
        message:"You are added in group"
       })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to join group"
        })

    }

}