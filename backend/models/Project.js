import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    assignedAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true}],
    status: {type: String, enum: ["Active","Hold","Closed"], default: "Active"},
    location: {type: String, enum: ["Bangalore", "Noida", "NCR", "Delhi", "Hyderabad", "Other"]},
    isMandateProject: { type: Boolean, default: false }
},
{timestamps: true}
);

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel