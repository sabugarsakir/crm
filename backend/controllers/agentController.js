import userModel from "../models/User.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import projectModel from "../models/Project.js";
import leadModel from "../models/Lead.js";

const getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: { "$in": ["Agent", "Manager", "Channel Partner"] } }).sort({ _id: -1 });
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

const deleteAgent = async (req, res) => {
    try {
        const { agentId } = req.params;

        // Security check: Only Admin can delete users
        if (req.body.role !== 'Admin') {
            return res.status(403).json({ success: false, message: "Unauthorized: Only Admin can remove users from the system." });
        }

        if (String(req.body.userId) === String(agentId)) {
            return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
        }

        const user = await User.findById(agentId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Clean up user references in projects & leads
        await projectModel.updateMany(
            { assignedAgents: agentId },
            { $pull: { assignedAgents: agentId } }
        );
        await leadModel.updateMany(
            { assignedAgent: agentId },
            { $pull: { assignedAgent: agentId } }
        );

        await User.findByIdAndDelete(agentId);
        res.json({ success: true, message: "User removed successfully from the system." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user: " + error.message });
    }
};

export { getAgents, getAgent, updateAgent, deleteAgent };


