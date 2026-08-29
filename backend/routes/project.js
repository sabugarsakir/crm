import express from "express";
import { assignSelfToProject, createProject, getAllProject, getProject, getProjectInfo, getProjectsWithLeadCount, updateProject } from "../controllers/projectController.js";
import { authUser } from "../controllers/authUser.js";


const projectRouter = express.Router();

projectRouter.post('/create', createProject)
projectRouter.post('/update', updateProject)
projectRouter.post('/assign-self/:projectId', authUser, assignSelfToProject);
projectRouter.get('/get', authUser, getProject)
projectRouter.get('/getAllProject', authUser, getAllProject)
projectRouter.get('/get-with-leadcount', authUser, getProjectsWithLeadCount)
projectRouter.get('/get/:projectId', authUser, getProjectInfo)

export default projectRouter