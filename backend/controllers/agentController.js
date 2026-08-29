import userModel from "../models/User.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt'

const getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: {"$in": ["Agent", "Channel Partner" ]} });
        res.json({ success: true, agents });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching agents" });
    }
};

const getAgent = async (req, res) =>{
    try {
        const {agentId} = req.params;

        const agent = await User.findById(agentId);
        res.json({success:true, agent})

    } catch (error) {
        res.json({ message: "Error fetching agent data", error });
        
    }
}

const updateAgent = async (req, res) => {
    try {
        const {agentId} = req.params;

        const {name, email, number, location,password} = req.body;

        let updateFields = { name, email, number, location };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            updateFields.password = hashedPassword;
        }

        const updatedAgent = await User.findByIdAndUpdate(agentId, updateFields, {new: true})

        res.json({ success: true, message: "Agent updated successfully"})
    } catch (error) {
        res.json({ message: "Error updating agent data", error: error });
        
    }
}
export { getAgents, getAgent, updateAgent };
