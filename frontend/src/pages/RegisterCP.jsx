import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const RegisterCP = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    teamStrength: "Individual",
    panNo: "",
    reraNo: "",
    reraValidity: "",
    state: "Delhi NCR",
    companyName: "",
    companyHead: "",
    companyWebsite: "",
    gstNo: "",
    address: "",
    city: "",
    pincode: ""
  });

  // Files State
  const [files, setFiles] = useState({
    panCardFile: null,
    reraCertificate: null,
    gstCertificate: null
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      // Size check (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        e.target.value = "";
        return;
      }
      setFiles((prev) => ({ ...prev, [name]: file }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    const fileInput = document.getElementById(fieldName);
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim())) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.panNo.trim()) {
      toast.error("Please enter PAN number");
      return;
    }
    if (!formData.reraNo.trim()) {
      toast.error("Please enter RERA registration number");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // Append files
      if (files.panCardFile) submitData.append("panCardFile", files.panCardFile);
      if (files.reraCertificate) submitData.append("reraCertificate", files.reraCertificate);
      if (files.gstCertificate) submitData.append("gstCertificate", files.gstCertificate);

      const { data } = await axios.post(
        `${backendUrl}/user/register/cp`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (data.success) {
        toast.success(data.message || "Registration submitted successfully!");
        setSubmittedEmail(formData.email);
        setIsSubmitted(true);
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("CP Registration Error:", err);
      const msg = err.response?.data?.message || "Failed to submit registration. Please check your connection.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-register-wrapper">
      <div className="container py-4">
        {/* Top Header / Brand */}
        <div className="text-center mb-4">
          <img
            src={assets.fcp_logo}
            alt="Logo"
            height={65}
            className="mb-2"
            style={{ objectFit: "contain" }}
          />
          <h2 className="cp-main-title">Channel Partner (CP) Onboarding</h2>
          <p className="text-muted cp-subtitle">
            Join our exclusive real estate network. Register your agency and start collaborating on premium mandate projects.
          </p>
          <Link to="/login" className="btn btn-outline-dark btn-sm rounded-pill px-3 mt-1">
            <i className="fa-solid fa-arrow-left me-1"></i> Back to Login
          </Link>
        </div>

        {isSubmitted ? (
          /* Submission Success Card */
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9">
              <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 text-center cp-success-card">
                <div className="success-icon-wrapper mb-3">
                  <i className="fa-solid fa-circle-check text-success display-3"></i>
                </div>
                <h3 className="fw-bold text-dark mb-2">Application Submitted Successfully!</h3>
                <p className="text-muted mb-4 fs-6">
                  Thank you for applying to become a verified Channel Partner. Your application and compliance documents are now under review with our verification team.
                </p>

                <div className="alert alert-light border p-3 rounded-3 text-start mb-4">
                  <h6 className="fw-bold mb-2 text-dark">
                    <i className="fa-solid fa-envelope-circle-check text-primary me-2"></i> Next Steps:
                  </h6>
                  <ul className="text-muted small mb-0 ps-3">
                    <li>Our team will verify your RERA and PAN details within <strong>24 to 48 business hours</strong>.</li>
                    <li>Upon successful approval, your login credentials will be delivered to: <strong className="text-dark">{submittedEmail}</strong>.</li>
                    <li>You can then log in to view mandate projects, submit inquiries, and track commissions.</li>
                  </ul>
                </div>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
                  >
                    <i className="fa-solid fa-right-to-bracket me-2"></i> Go to Login Page
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        mobile: "",
                        email: "",
                        teamStrength: "Individual",
                        panNo: "",
                        reraNo: "",
                        reraValidity: "",
                        state: "Delhi NCR",
                        companyName: "",
                        companyHead: "",
                        companyWebsite: "",
                        gstNo: "",
                        address: "",
                        city: "",
                        pincode: ""
                      });
                      setFiles({
                        panCardFile: null,
                        reraCertificate: null,
                        gstCertificate: null
                      });
                    }}
                    className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                  >
                    Register Another Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              <form onSubmit={handleSubmit} className="card shadow-lg border-0 rounded-4 p-4 p-md-5 cp-form-card">
                
                {/* SECTION 1: Personal & Contact Info */}
                <div className="cp-form-section mb-4">
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <span className="cp-section-badge me-2">1</span>
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fa-solid fa-user-tie text-warning me-2"></i> Primary Contact & Personal Details
                    </h5>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        maxLength={10}
                        className="form-control form-control-lg fs-6"
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. partner@agency.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">Login credentials will be sent to this email upon approval.</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Team Strength / Setup</label>
                      <select
                        name="teamStrength"
                        className="form-select form-select-lg fs-6"
                        value={formData.teamStrength}
                        onChange={handleChange}
                      >
                        <option value="Individual">Individual Broker</option>
                        <option value="2-5 Members">2 - 5 Members</option>
                        <option value="6-15 Members">6 - 15 Members</option>
                        <option value="16-50 Members">16 - 50 Members</option>
                        <option value="50+ Members">50+ Members Enterprise</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Statutory & Compliance */}
                <div className="cp-form-section mb-4">
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <span className="cp-section-badge me-2">2</span>
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fa-solid fa-file-shield text-warning me-2"></i> Statutory & RERA Compliance Details
                    </h5>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        PAN Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="panNo"
                        maxLength={10}
                        style={{ textTransform: "uppercase" }}
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. ABCDE1234F"
                        value={formData.panNo}
                        onChange={(e) =>
                          setFormData({ ...formData, panNo: e.target.value.toUpperCase() })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Upload PAN Card Document</label>
                      <div className="input-group">
                        <input
                          type="file"
                          id="panCardFile"
                          name="panCardFile"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                        {files.panCardFile && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeFile("panCardFile")}
                            title="Remove file"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </div>
                      <div className="form-text">PDF, JPG, PNG (Max 10MB)</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        RERA Registration No <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="reraNo"
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. UPRERAAGT12345"
                        value={formData.reraNo}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Upload RERA Certificate</label>
                      <div className="input-group">
                        <input
                          type="file"
                          id="reraCertificate"
                          name="reraCertificate"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                        {files.reraCertificate && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeFile("reraCertificate")}
                            title="Remove file"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </div>
                      <div className="form-text">PDF, JPG, PNG (Max 10MB)</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">RERA Validity Date</label>
                      <input
                        type="date"
                        name="reraValidity"
                        className="form-control form-control-lg fs-6"
                        value={formData.reraValidity}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Primary Operating State</label>
                      <select
                        name="state"
                        className="form-select form-select-lg fs-6"
                        value={formData.state}
                        onChange={handleChange}
                      >
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Company & Firm Details */}
                <div className="cp-form-section mb-4">
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <span className="cp-section-badge me-2">3</span>
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fa-solid fa-building text-warning me-2"></i> Company / Agency Details
                    </h5>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Company / Firm Name</label>
                      <input
                        type="text"
                        name="companyName"
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. Apex Realty Solutions"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Company Head / MD / Proprietor</label>
                      <input
                        type="text"
                        name="companyHead"
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. Director Name"
                        value={formData.companyHead}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Company Website</label>
                      <input
                        type="url"
                        name="companyWebsite"
                        className="form-control form-control-lg fs-6"
                        placeholder="https://www.yourcompany.com"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">GST Number</label>
                      <input
                        type="text"
                        name="gstNo"
                        maxLength={15}
                        style={{ textTransform: "uppercase" }}
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        value={formData.gstNo}
                        onChange={(e) =>
                          setFormData({ ...formData, gstNo: e.target.value.toUpperCase() })
                        }
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold">Upload GST Certificate</label>
                      <div className="input-group">
                        <input
                          type="file"
                          id="gstCertificate"
                          name="gstCertificate"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                        {files.gstCertificate && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeFile("gstCertificate")}
                            title="Remove file"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </div>
                      <div className="form-text">PDF, JPG, PNG (Max 10MB)</div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Address Details */}
                <div className="cp-form-section mb-4">
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <span className="cp-section-badge me-2">4</span>
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fa-solid fa-map-location-dot text-warning me-2"></i> Office & Communication Address
                    </h5>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">Street / Office Address</label>
                      <textarea
                        name="address"
                        rows={2}
                        className="form-control fs-6"
                        placeholder="Office No, Building, Commercial Complex, Sector/Road"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">City</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control form-control-lg fs-6"
                        placeholder="e.g. Noida / Gurgaon / Bangalore"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        className="form-control form-control-lg fs-6"
                        placeholder="6-digit Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="border-top pt-4 mt-2">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="termsCheck"
                      required
                    />
                    <label className="form-check-label text-muted small" htmlFor="termsCheck">
                      I declare that the information and compliance certificates provided above are accurate and valid under applicable RERA regulations.
                    </label>
                  </div>

                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                    <Link to="/login" className="text-muted text-decoration-none small">
                      <i className="fa-solid fa-arrow-left me-1"></i> Already have an account? Log In
                    </Link>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg px-4 py-2 rounded-pill fw-semibold shadow-sm"
                      style={{ minWidth: "220px" }}
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin me-2"></i> Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane me-2"></i> Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCP;
