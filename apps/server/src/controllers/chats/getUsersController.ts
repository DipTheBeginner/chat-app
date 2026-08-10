import { prisma } from "@repo/database";
import { Request, Response } from "express";





export default async function getUserController(req:Request , res:Response) {


    const currentUserId=req.user!.id;

    try{

        
        
        const users=await prisma.user.findMany({
            where:{
                id:{
                    not:currentUserId
                }
            },
            
            select:{
                id:true,
                email:true,
                username:true
            }
        });
        
        
        return res.status(200).json({
            success:true,
            users,
        })
        
    }catch(error){
        console.error("Get users error", error);

        return res.status(500).json({
            success:false,
            message:"Failed to get users"
        })
    }

}