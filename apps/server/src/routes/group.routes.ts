import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import createGroupController from "../controllers/group/createGroupController";
import joinGroupController from "../controllers/group/joinGroupController";
import leaveGroupController from "../controllers/group/leaveGroupController";
import getMyGroupController from "../controllers/group/getMyGroupController";
import getGroupMessagesController from "../controllers/group/groupMessageController";





const router = Router();

router.post("/", authMiddleware, createGroupController);
router.post("/:groupId/join", authMiddleware, joinGroupController)
router.post("/:groupId/leave", authMiddleware, leaveGroupController)
router.get("/my-groups", authMiddleware, getMyGroupController)
router.get("/:groupId/messages", getGroupMessagesController)


export default router;