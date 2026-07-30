import { Router } from "express";
import signupController from "../controllers/auth.controller";
import signinController from "../controllers/siginController";

const router=Router()






router.post("/signup",signupController)

router.post("/login",signinController);



export default router;