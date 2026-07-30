import { prisma } from "@repo/database";
import { Request, Response } from "express";




export default async function getMyGroupController(req:Request, res:Response) {


    try{


        const userid=req.user!.id


        const groups=await prisma.groupMember.findMany({
            where:{
                userId:userid
            },
            include:{
                group:true
            }
        })

        if(groups.length===0){
            return res.status(200).json({
                success:true,
                message:"No groups found",
                groups:[],
            })
        }

        const myGroups = groups.map((member) => member.group);

        return res.status(200).json({
            success:true,
            message:"Groups found",
            groups:myGroups
        });

    }catch(error){

        console.log(error);
        return res.status(404).json({
            success:false,
            message:"something error"
        })

    }
    
}