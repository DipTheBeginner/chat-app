    import { ExtendedError, Socket } from "socket.io";
    import jwt from "jsonwebtoken"
    import { AuthUser } from "../types/auth";




    export default async function socketAuth(
        socket:Socket,
        next:(err?:ExtendedError)=>void
    ) {

        try{

            const token=socket.handshake.auth.token

            if(!token){
                return next(new Error("Unauthorized"));
            }

            const decoded=jwt.verify(token,"secret") as AuthUser;

            socket.data.user=decoded;

            next()
        }catch(error){

        }
        
    }