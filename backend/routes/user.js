import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import { getAgent, getAgents, updateAgent } from "../controllers/agentController.js";
import {registerPartner, getEnquiries, verifyCP } from "../controllers/cp_controller.js";
import upload from "../middleware/upload.js";
const userRouter = express.Router();
const cpUploads = upload.fields([
    { name: 'panCardFile', maxCount: 1 },
    { name: 'reraCertificate', maxCount: 1 },
    { name: 'gstCertificate', maxCount: 1 }
  ]);
  userRouter.post("/verify/cp/:id", verifyCP);
userRouter.post('/register', registerController)
userRouter.post('/register/cp', cpUploads, registerPartner)
userRouter.post('/login', loginController)
userRouter.get('/get/agents', getAgents )
userRouter.get('/get/agent/:agentId', getAgent )
userRouter.post('/update/:agentId', updateAgent )
userRouter.get('/enquiries/cp', getEnquiries )


export default userRouter