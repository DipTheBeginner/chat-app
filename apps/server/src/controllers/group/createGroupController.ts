import { prisma } from "@repo/database";
import { Request, Response } from "express";





export default async function createGroupController(req: Request, res: Response) {

    try {

        console.log("1");
        const { name } = req.body;
        console.log("2", name);


        const userId = req.user!.id;
        console.log("3", userId);



        console.log("4 Before creating group")





        if (!name) {
            return res.status(404).json({
                success: false,
                message: "Kindly provide group name"
            })
        }

        const group = await prisma.chatGroup.create({
            data: {
                name,
                creator: {
                    connect: {
                        id: req.user!.id,
                    }
                }
            }
        })


        console.log("5 Group created", group);

        console.log("6 Before member create");

        const groupMember = await prisma.groupMember.create({
            data: {
                userId: req.user!.id,
                groupId: group.id,

            }
        })


        

        return res.status(201).json({
            success: true,
            group,
            groupMember
        });


    } catch (error) {


    }

}