import leadModel from "../models/Lead.js"
import validator from "validator";
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import csv from 'csv-parser'
import sendEmail from '../utils/emailService.js'
import userModel from "../models/User.js";
import projectModel from "../models/Project.js";
// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Store files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
      cb(null, "leads_" + Date.now() + path.extname(file.originalname));
    },
  });
  
  // File filter to accept only CSV files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed!"), false);
    }
  };
  
  const upload = multer({ storage, fileFilter });

  // CSV Upload Route
  const uploadCSV = async (req, res) => {
    try {
      const leads = [];
      const { selectedProject } = req.body;
      const selectedAgents = JSON.parse(req.body.selectedAgents);
  
      if (!req.file) {
        return res.json({ success: false, message: "No file uploaded!" });
      }
      if (!selectedProject) {
        return res.json({ success: false, message: "Please select a project" });
      }
      if (!selectedAgents) {
        return res.json({ success: false, message: "Please select an agent" });
      }
  
      const requiredFields = ['name', 'phone'];
      let isHeaderValid = true;
      let headerChecked = false;
      let errorSent = false;
  
      const filePath = req.file.path;
  
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (!headerChecked) {
            const columns = Object.keys(row);
            const missingFields = requiredFields.filter(field => !columns.includes(field));
            if (missingFields.length > 0) {
              isHeaderValid = false;
              errorSent = true;
              stream.destroy(); // Stop the stream
              return res.json({ success: false, message: `Missing column(s): ${missingFields.join(', ')}` });
            }
            headerChecked = true;
          }
  
          if (isHeaderValid) {
            leads.push({
              project: selectedProject,
              name: row.name,
              email: row.email ? row.email : "Not Avail",
              phone: row.phone,
              source: 'Other',
              assignedAgent: selectedAgents
            });
          }
          
        })
        .on("end", async () => {
          if (isHeaderValid) {
            await leadModel.insertMany(leads);
            res.json({ success: true, message: "CSV Uploaded & Leads Saved!" });
          }
          fs.unlink(filePath, () => {}); // Safe async delete
        })
        .on("error", (err) => {
          console.error("CSV parsing error:", err);
          if (!errorSent) {
            res.json({ success: false, message: "Error parsing CSV file" });
          }
          fs.unlink(filePath, () => {});
        });
  
    } catch (error) {
      console.error(error);
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.json({ success: false, message: "Error processing CSV file" });
    }
  };
  
  

const createLead = async (req, res) => {
    try {

        const {project, name, email, phone, source, assignedAgent, interested_in} = req.body;


        if (!project || !name || !email || !phone || !assignedAgent) {
            return res.json({success:false, message: "Missing Details"})
        }
    
        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Enter valid email"})
    
        }
        if(!validator.isMobilePhone(phone)){
          return res.json({success:false, message: "Enter valid phone number"})
        }
    

        const leadData = {
            project,
            name,
            email,
            phone,
            source,
            assignedAgent,
            interested_in: interested_in || []
        }
    
        const newLead = new leadModel(leadData);
        const lead = await newLead.save();

        const projectDetails = await projectModel.findById(project);
        if (!projectDetails) {
            return res.json({ success: false, message: "Project not found" });
        }

        // Get Manager's email
        const manager = await userModel.findOne({ role: "Manager" });
        const managerEmail = manager ? manager.email : null;

        // Get all assigned Agents' emails
        const assignedAgents = await userModel.find({ _id: { $in: assignedAgent }, role: "Agent" });
        const agentEmails = assignedAgents.map(agent => agent.email).filter(email => email);

        // Email Content
        const subject = `New Lead Notification: ${name}`;
        const message = `A new lead has been created in ${projectDetails.name}.\n\nSource: ${source}\n\nAll The Best!`;

        // Send email to all assigned agents
        for (const email of agentEmails) {
            await sendEmail(email, subject, message);
        }

        // Always send email to the manager
        if (managerEmail) {
            await sendEmail(managerEmail, subject, message);
        }
    
        return res.json({success: true, message:'Lead created'})
    } catch (error) {
        console.error(error);
        return res.json({success: false, message:error})

    }
}

const getLeads = async (req, res) => {
    try {
    
        const { projectId } = req.params;
    
        // In case of agent Find leads where:
        // - The project ID matches the selected project
        // - The agent is assigned to the lead
        
        if(req.body.role=='Agent' || req.body.role=='Channel Partner'){
            const leads = await leadModel.find({
              project: projectId,
              assignedAgent: req.body.userId
            });
            res.status(200).json({success:true, leads: leads});
        }else if(req.body.role=='Admin' || req.body.role=='Manager'){
            const leads = await leadModel.find({project: projectId});
              res.status(200).json({success:true, leads: leads});
        }
    
      } catch (error) {
        res.status(500).json({ message: "Error fetching leads", error });
      }
}
const getAllLeads = async (req, res) => {
    try {
        const leads = await leadModel.find().populate("project","name").populate("assignedAgent", "name");
        res.status(200).json({success:true, leads: leads});
    } catch (error) {
        res.status(500).json({ message: "Error fetching leads", error });
        
    }
}

const getAgentAllLead = async (req, res) => {
    try {
        const leads = await leadModel.find({
            assignedAgent: req.body.userId
        }).populate("project","name");
        res.status(200).json({success:true, leads: leads});
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching agent leads", error: error.message });
    }
}

const getFollowUpLeads = async (req, res) => {
    try {
        const leads = await leadModel.find({
            assignedAgent: req.body.userId,
            stage: 'follow-up'
        }).populate("project","name");
        res.status(200).json({success:true, leads: leads});
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching follow-up leads", error: error.message });
    }
}

// Get single lead with timeline
const getLeadDetails = async (req, res) => {
  try {
    const lead = await leadModel.findById(req.params.id);
    if (!lead) {
      return res.json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, lead });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



const updateLead = async (req, res) => {
    try {
        const {id, stage, remarks, followUpDate, status, interested_in} = req.body;

        if (stage === undefined && remarks === undefined && followUpDate === undefined) {
            return res.json({ success: false, message: "There was no change!" });
        }

        await leadModel.findByIdAndUpdate(id, {
          stage,
          remarks,
          followUpDate,
          status,
          interested_in: interested_in || [],
          $push: {
            timeline: {
              stage,
              remarks,
              date: new Date()
            }
          }
        });

        res.json({success: true, message: "Lead Has Been Updated"})

    } catch (error) {
        console.error("Update Lead Error:", error);
        res.status(500).json({ success: false, message: "Error updating lead: " + error.message });
    }
}

const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        await leadModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Lead deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting lead" });
    }
};

export {createLead, getLeads, updateLead, getAgentAllLead, getAllLeads, getFollowUpLeads, getLeadDetails, deleteLead, upload, uploadCSV}