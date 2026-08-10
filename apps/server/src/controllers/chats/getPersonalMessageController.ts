import { prisma } from "@repo/database";
import { Request, Response } from "express";







export default async function getPersonalMessageController(req:Request , res: Response) {


    try{

        const senderUserId=req.user!.id;
        const receiverUserId=req.params.id as string;


        if(!receiverUserId){
           return res.status(400).json({
                success:false,
                message:"User id is required"
            })
           
        }




        const messages=await prisma.message.findMany({
            where:{
                OR:[
                    {
                        senderId:senderUserId,
                        receiverId:receiverUserId
                    },
                    {
                        senderId:receiverUserId,
                        receiverId:senderUserId,
                    }
                ]
            },
            orderBy:{
                createdAt:"asc"
            }
        });


        return res.status(200).json({
            success:true,
            messages
        })


    }catch(error){
        console.error("Get Personal message error:",error);


        return res.status(500).json({
            success:false,
            message:"Failed to get personal message"
        })
    }
    
}