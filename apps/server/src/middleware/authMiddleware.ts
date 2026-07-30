import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { AuthUser } from "../types/auth";




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

        req.user = decoded;

        console.log("Auth success");
        next();





    } catch (error) {

    }

}