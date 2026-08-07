import { prisma } from "@repo/database";
import { Request, Response } from "express";






export default async function addMemberController(req: Request, res: Response) {


    try {
        const { groupId, email } = req.body;
        const creatorId = req.user!.id;

        const group = await prisma.chatGroup.findUnique({
            where: {
                id: groupId
            }
        })

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        if (group.createdBy !== creatorId) {

            return res.status(403).json({
                success: false,
                message: "Only group admin can add member"
            })
        }



        const member = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const existingMember = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: member!.id,
                    groupId
                }
            }

        })

        if (existingMember) {
            return res.status(409).json({
                success: false,
                message: "User is already memeber of this group"
            })
        }

        await prisma.groupMember.create({
            data: {
                userId: member!.id,
                groupId
            }
        });

        return res.status(201).json({
            success: true,
            member: "User added to the group"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Failed to add memebr"
        })
    }


}