import { prisma } from "@repo/database";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";





export default async function signinController(req: Request, res: Response) {



    try {

        

        const { email, password } = req.body


        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(401).json(
                { message: "Invalid Credentials" }
            )
        }

        const passwordCheck = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordCheck) {
            return res.status(401).json({
                success: false

            })
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, "secret")

        return res.status(200).json({
            success: true,
            token
        })




    } catch (error) {

        console.log("signin error", error)
        return res.status(500).json({
            success: false,
            error: "Login Failed"
        })

    }

}