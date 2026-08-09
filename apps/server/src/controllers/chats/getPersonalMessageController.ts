import { prisma } from "@repo/database";
import { Request, Response } from "express";







export default async function getPersonalMessageController(req:Request , res: Response) {


    try{

        const senderUserId=req.user!.id;
        const receiverUserId=req.params.id;


        if(!receiverUserId){
            res.status(400).json({
                success:false,
                message:"User id is required"
            })
        }

        


        const message=await prisma.message.findMany({
            where:{
                id:chatId
            }
        })



        


    }
    
}