import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { AuthUser } from "../types/auth";
import { prisma } from "@repo/database";




export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        console.log("Entered authMiddleware");

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }


        const token = authHeader.split(" ")[1]

        console.log(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        const decoded = jwt.verify(token, "secret") as AuthUser;

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longest exist"
            })
        }

        req.user = {
            id: user.id,
            email: user.email,
        };

        console.log("Auth success");
        next();





    } catch (error) {

    }

}