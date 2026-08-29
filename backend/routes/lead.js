import express from "express";
import { createLead, deleteLead, getAgentAllLead, getFollowUpLeads, getAllLeads, getLeads, updateLead, upload, uploadCSV, getLeadDetails } from "../controllers/leadController.js";
import { authUser } from "../controllers/authUser.js";


const leadRouter = express.Router();

leadRouter.post('/create', createLead)
leadRouter.post('/update', updateLead)
leadRouter.get('/get/:projectId', authUser, getLeads)
leadRouter.get('/get', authUser, getAllLeads)
leadRouter.get('/get/agent/leads', authUser, getAgentAllLead)
leadRouter.get('/get/agent/follow-up-leads', authUser, getFollowUpLeads)
leadRouter.delete('/delete/:id', authUser, deleteLead)
leadRouter.post('/upload-csv', upload.single("file") ,uploadCSV)
leadRouter.get("/details/:id", authUser, getLeadDetails);


export default leadRouter