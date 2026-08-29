import ChannelPartner from '../models/ChannelPartner.js';
import sendEmail from '../utils/emailService.js';
import userModel from '../models/User.js';
import bcrypt from 'bcrypt';

const registerPartner = async (req, res) => {
  try {
    const {
      fullName, mobile, email, teamStrength,
      panNo, reraNo, reraValidity, state,
      companyName, companyHead, companyWebsite,
      gstNo, address, city, pincode
    } = req.body;

    if (!fullName || !mobile || !email) {
      return res.status(400).json({ success: false, message: 'Please provide full name, mobile number, and email.' });
    }

    // Check if channel partner with same email or mobile or PAN already registered
    const existingEmail = await ChannelPartner.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'A registration application with this email already exists.' });
    }

    const existingMobile = await ChannelPartner.findOne({ mobile: mobile.trim() });
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'A registration application with this mobile number already exists.' });
    }

    if (panNo) {
      const existingPan = await ChannelPartner.findOne({ panNo: panNo.trim().toUpperCase() });
      if (existingPan) {
        return res.status(400).json({ success: false, message: 'A registration application with this PAN number already exists.' });
      }
    }

    const newPartner = new ChannelPartner({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      teamStrength: teamStrength || '',
      panNo: panNo ? panNo.trim().toUpperCase() : '',
      panCardFile: req.files?.panCardFile?.[0]?.filename || '',
      reraNo: reraNo ? reraNo.trim() : '',
      reraCertificate: req.files?.reraCertificate?.[0]?.filename || '',
      reraValidity: reraValidity || null,
      state: state || '',
      companyName: companyName || '',
      companyHead: companyHead || '',
      companyWebsite: companyWebsite || '',
      gstNo: gstNo ? gstNo.trim().toUpperCase() : '',
      gstCertificate: req.files?.gstCertificate?.[0]?.filename || '',
      address: address || '',
      city: city || '',
      pincode: pincode || '',
      isVerified: false
    });

    await newPartner.save();
    res.status(200).json({ 
      success: true, 
      message: 'Channel partner registration submitted successfully! Your application is under review.' 
    });
  } catch (err) {
    console.error('CP Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration: ' + err.message });
  }
};

const verifyCP = async (req, res) => {
  try {
    const cpId = req.params.id;
    const cp = await ChannelPartner.findById(cpId);

    if (!cp) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    const email = cp.email.toLowerCase();
    const emailPrefix = email.split("@")[0];
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5-digit
    const generatedPassword = `${emailPrefix}${randomDigits}`;

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    // 1. Create or update user account
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      existingUser.name = cp.fullName;
      existingUser.number = cp.mobile;
      existingUser.password = hashedPassword;
      existingUser.role = "Channel Partner";
      existingUser.isCP = true;
      await existingUser.save();
    } else {
      const userData = {
        name: cp.fullName,
        email: email,
        number: cp.mobile,
        password: hashedPassword,
        role: "Channel Partner",
        location: cp.state || "Other",
        isCP: true
      };
      const newUser = new userModel(userData);
      await newUser.save();
    }

    // 2. Send Email with plain generated password
    const message = `
Hi ${cp.fullName},

🎉 Your channel partner registration has been verified successfully.

Here are your login credentials:

🔹 User ID: ${cp.email}
🔹 Password: ${generatedPassword}

Please log in and update your details.

Regards,  
Team Real Estate
    `;

    await sendEmail(cp.email, "Channel Partner Verified - Login Credentials", message);

    cp.isVerified = true;
    await cp.save();

    res.status(200).json({ success: true, message: "Verified and credentials emailed successfully!" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Something went wrong: " + err.message });
  }
};

const getEnquiries = async (req, res) => {
  try {
      const enquiries = await ChannelPartner.find()
      res.status(200).json({success:true, enquiries});
  } catch (error) {
      res.status(500).json({ message: "Error fetching enquiries", error });
      
  }
}

export {registerPartner, getEnquiries, verifyCP};
