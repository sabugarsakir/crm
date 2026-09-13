import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import notify from '../utils/notify';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import ManagerSidebar from './ManagerSidebar';
import ComNavbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CreateAgent = () => {
  const { backendUrl, role } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [location, setLocation] = useState("Bangalore");
  const [selectedRole, setSelectedRole] = useState("Agent");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setpassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !password) {
      notify.warning("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      notify.warning("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(`${backendUrl}/user/register`, {
        name,
        number: phone,
        email,
        password,
        location,
        role: selectedRole
      });

      if (data.success) {
        notify.success("Team Member Created", `"${name}" was registered successfully as ${selectedRole}.`);
        // Navigate back to directory immediately - directory fetches agents on mount so new member is visible instantly
        navigate(`${role === 'Admin' ? '/admin' : '/manager'}/get-agents`);
      } else {
        notify.error("Registration Failed", data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", error.response?.data?.message || "Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {role === 'Admin' ? (
        <AdminSidebar show={show} handleClose={handleClose} />
      ) : (
        <ManagerSidebar show={show} handleClose={handleClose} />
      )}
      <ComNavbar handleShow={handleShow} />
      <div className="container py-4">
        <button 
          onClick={() => navigate(`${role === 'Admin' ? '/admin' : '/manager'}/get-agents`)} 
          className="back-btn"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Directory
        </button>
        <div className="page-header mb-4">
          <div>
            <h2>Create New Team Member</h2>
            <p>Add a new sales agent, operational manager, or authorized staff to the platform.</p>
          </div>
        </div>

        <form className="customForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select
                className="form-select filterInput"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="Agent">Agent</option>
                <option value="Manager">Manager</option>
                {role === 'Admin' && <option value="Channel Partner">Channel Partner</option>}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Location / Base Branch</label>
              <select
                className="form-select filterInput"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Noida">Noida</option>
                <option value="Delhi">Delhi</option>
                <option value="NCR">NCR</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Set Initial Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Registering {selectedRole}...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i> Create {selectedRole}
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateAgent;
