import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import getPersonalMessageController from "../controllers/chats/getPersonalMessageController";
import getUserController from "../controllers/chats/getUsersController";



const router = Router()



router.get("/users", authMiddleware, getUserController)
router.get("/:id", authMiddleware, getPersonalMessageController)



export default router;