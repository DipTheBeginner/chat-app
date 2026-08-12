import { prisma } from "@repo/database";
import { Request, Response } from "express";



export default async function leaveGroupController(req: Request, res: Response) {

    console.log("🔥 LEAVE GROUP CONTROLLER HIT");


    try {

        const { groupId } = req.params;
        const userId = req.user!.id;

        if (typeof groupId !== "string") {
            return res.status(400).json({ message: "Invalid groupId" });
        }


        const group = await prisma.chatGroup.findUnique({
            where: {
                id: groupId
            }
        })

        if (!group) {
            return res.status(409).json({
                success: false,
                message: "No group found"
            })
        }

        const existingUser = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                }

            }
        })


        if (!existingUser) {
            return res.status(404).json({
                succcess: false,
                message: "User is not part of the group"
            })
        }

        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                },

            },
        });

        return res.status(200).json({
            success: true,
            message: "User removed from group"
        })



    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to leave group",
        });

    }

}