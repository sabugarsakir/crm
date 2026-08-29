import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  interested_in: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // ✅ new field
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  source: { type: String, enum: ["Meta", "Google", "Other"] },
  assignedAgent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  stage: {
    type: String,
    enum: [
      "RNR",
      "follow-up",
      "site-visit",
      "site-visit-done",
      "revisit",
      "booking",
      "set-stage"
    ],
    default: "set-stage",
  },
  status: {type: String, enum: ["warm", "hot", "cold"]},
  followUpDate: { type: Date, default: null },
  remarks: { type: String, default: "Not Available" },
  timeline: [
    {
      stage: String,
      remarks: String,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

  

const leadModel = mongoose.model("Lead", leadSchema);

export default leadModel