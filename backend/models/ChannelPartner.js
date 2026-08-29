// models/ChannelPartner.js
import mongoose from "mongoose";

const channelPartnerSchema = new mongoose.Schema({
  fullName: String,
  mobile: String,
  email: String,
  teamStrength: String,

  panNo: String,
  panCardFile: String,
  reraNo: String,
  reraCertificate: String,
  reraValidity: Date,
  state: String,

  companyName: String,
  companyHead: String,
  companyWebsite: String,
  gstNo: String,
  gstCertificate: String,
  address: String,
  city: String,
  pincode: String,

  isVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

const ChannelPartner = mongoose.model("ChannelPartner", channelPartnerSchema);

export default ChannelPartner