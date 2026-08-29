import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminSidebar";

const EnquiriesofCP = () => {
  const { backendUrl, token, role } = useContext(AppContext);
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const verifyCP = async (enquiry) => {
    try {
      setVerifyingId(enquiry._id);
      const { data } = await axios.post(`${backendUrl}/user/verify/cp/${enquiry._id}`);
      if (data.success) {
        toast.success("Verified successfully and login credentials sent!");
        getEnquiries();
      } else {
        toast.error(data.message);
      }
      setVerifyingId(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during verification");
      setVerifyingId(null);
    }
  };

  const getEnquiries = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/enquiries/cp`);
      if (data.success) {
        setEnquiries(data.enquiries);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load CP enquiries");
    }
  };

  useEffect(() => {
    getEnquiries();
  }, []);

  return (
    <div className="pb-5">
      <AdminSidebar show={show} handleClose={handleClose} />
      <Navbar handleShow={handleShow} />

      <div className="container py-4">
        {/* Top Header Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button onClick={() => navigate(`${role === 'Admin' ? '/admin' : '/manager'}/dashboard`)} className="back-btn m-0">
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </button>
          <span className="badge bg-primary px-3 py-2 rounded-pill">
            <i className="fa-solid fa-handshake me-1"></i> {enquiries.length} Partner Applications
          </span>
        </div>

        <div className="page-header">
          <div>
            <h2>Channel Partner Enquiries & Verification</h2>
            <p>Review submitted compliance documents (PAN, RERA, GST) and activate partner accounts.</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Team</th>
                <th>PAN Number</th>
                <th>PAN Doc</th>
                <th>RERA No</th>
                <th>RERA Doc</th>
                <th>State</th>
                <th>Company</th>
                <th>GST No</th>
                <th>GST Doc</th>
                <th>City</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={15} className="text-center py-5 text-muted">
                    <i className="fa-solid fa-folder-open fs-3 mb-2 d-block text-primary"></i>
                    No Channel Partner enquiries pending review.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry, index) => (
                  <tr key={enquiry._id || index}>
                    <td className="fw-semibold text-muted">{index + 1}</td>
                    <td className="fw-bold text-dark">{enquiry.fullName}</td>
                    <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {enquiry.mobile}</td>
                    <td>{enquiry.email}</td>
                    <td><span className="badge bg-light text-dark border">{enquiry.teamStrength || '1-5'}</span></td>
                    <td className="fw-semibold">{enquiry.panNo}</td>
                    <td>
                      {enquiry.panCardFile ? (
                        <a href={`${backendUrl}/uploads/${enquiry.panCardFile}`} target="_blank" rel="noreferrer" className="btn-action-edit text-decoration-none">
                          <i className="fa-solid fa-file-arrow-down"></i> Doc
                        </a>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td>{enquiry.reraNo || '—'}</td>
                    <td>
                      {enquiry.reraCertificate ? (
                        <a href={`${backendUrl}/uploads/${enquiry.reraCertificate}`} target="_blank" rel="noreferrer" className="btn-action-edit text-decoration-none">
                          <i className="fa-solid fa-file-arrow-down"></i> Doc
                        </a>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td>{enquiry.state || '—'}</td>
                    <td>{enquiry.companyName || '—'}</td>
                    <td>{enquiry.gstNo || '—'}</td>
                    <td>
                      {enquiry.gstCertificate ? (
                        <a href={`${backendUrl}/uploads/${enquiry.gstCertificate}`} target="_blank" rel="noreferrer" className="btn-action-edit text-decoration-none">
                          <i className="fa-solid fa-file-arrow-down"></i> Doc
                        </a>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td>{enquiry.city || '—'}</td>
                    <td className="text-center">
                      {enquiry.isVerified ? (
                        <span className="badge bg-success text-white px-3 py-2 rounded-pill">
                          <i className="fa-solid fa-check me-1"></i> Verified
                        </span>
                      ) : (
                        <button
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '12px' }}
                          onClick={() => verifyCP(enquiry)}
                          disabled={verifyingId === enquiry._id}
                        >
                          {verifyingId === enquiry._id ? (
                            <><i className="fa-solid fa-spinner fa-spin me-1"></i> Verifying...</>
                          ) : (
                            <><i className="fa-solid fa-shield-check me-1"></i> Verify & Activate</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesofCP;
