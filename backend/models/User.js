import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, unique:true},
    number: {type: Number, required: true, unique: true},
    password: {type:String, required: true},
    role: { type: String, enum: ["Admin", "Manager", "Agent", "Channel Partner"], required: true },
    location: {type: String, enum: ["Bangalore", "Noida", "NCR", "Delhi", "Hyderabad", "Other"]},
    isCP: { type: Boolean, default: false }
})

const userModel = mongoose.model("User", userSchema);

export default userModel