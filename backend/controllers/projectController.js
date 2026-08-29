import leadModel from "../models/Lead.js";
import projectModel from "../models/Project.js";

const createProject = async (req, res) => {
    try {
        const {name, description, assignedAgents, location, isMandateProject} = req.body;

        if (!name || !description || !assignedAgents) {
           return res.json({success:false, message: "Missing Details"})
        }
    

        const projectData = {
            name,
            description,
            assignedAgents,
            isMandateProject,
            location
        }
    
        const newProject = new projectModel(projectData);
        const project = await newProject.save();
    
        return res.json({success: true, message:'Project created'})
    } catch (error) {
        console.error(error);
        return res.json({success: false, message:error})

    }
}

const getProject = async (req, res) => {
    try {
    
        if (req.body.role=='Agent') {
            const projects = await projectModel.find({ assignedAgents: req.body.userId});
            res.json({success:true, projects})
        } else if(req.body.role=='Manager' || req.body.role=='Admin') {
            const projects = await projectModel.find();
            res.json({success:true, projects})
        }else if(req.body.role=='Channel Partner'){
            const projects = await projectModel.find({ isMandateProject: true });
            res.json({success:true, projects})
        } else {
            res.json({success:true, projects: []})
        }

      } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
      }
}

const getAllProject = async (req, res) => {
    try {
        const projects = await projectModel.find();
        res.json({success:true, projects})


      } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
      }
}

const getProjectsWithLeadCount = async (req, res) => {
    try {
        const activeProjects = await projectModel.find({ status: "Active" });

        // Count the number of leads for each active project
        const projectLeadCounts = await Promise.all(
            activeProjects.map(async (project) => {
                const leadCount = await leadModel.countDocuments({ project: project._id });
                return { ...project.toObject(), leadCount };
            })
        );

        res.json({ success: true, projects: projectLeadCounts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
};


const getProjectInfo = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await projectModel.findById(projectId);
        res.json({success:true, project})
        
    } catch (error) {
        res.json({ message: "Error fetching project data", error });
    }

}

const assignSelfToProject = async (req, res) => {
    const projectId = req.params.projectId;
    const agentId = req.body.userId;
  
    try {
      const project = await projectModel.findById(projectId);
  
      if (!project) {
        return res.json({ success: false, message: "Project not found" });
      }
  
      if (project.assignedAgents && project.assignedAgents.some(id => id.toString() === agentId?.toString())) {
        return res.json({ success: false, message: "You are already assigned to this project" });
      }
  
      if (!project.assignedAgents) {
        project.assignedAgents = [];
      }
      project.assignedAgents.push(agentId);
      await project.save();
  
      return res.json({ success: true, message: "You have been assigned to the project" });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
  

const updateProject = async (req, res) => {
    try {
        const {name, description, id, status, location, assignedAgents} = req.body;

        if (!name || !description) {
            return res.json({success:false, message: "Missing Details"})
        }

        await projectModel.findByIdAndUpdate(id, {name, description, assignedAgents, status, location});
       return res.json({success: true, message: "Project Has Been Updated"})

    } catch (error) {
        return res.json({success: false, message:error.message})
    }
}

export {createProject, getProject, getProjectInfo, getAllProject, updateProject, getProjectsWithLeadCount, assignSelfToProject}