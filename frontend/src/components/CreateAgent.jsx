import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import ComNavbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CreateAgent = () => {
    const { backendUrl, role } = useContext(AppContext);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [location, setLocation] = useState("Bangalore");
    const [selectedRole, setSelectedRole] = useState("Agent");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setpassword] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !phone || !email || !password) {
            toast.error("Please fill all fields");
            return;
        }

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
                toast.success(`${selectedRole} created successfully!`);
                setName("");
                setEmail("");
                setPhone("");
                setpassword("");
                setLocation("Bangalore");
                setSelectedRole("Agent");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error creating user.");
        }
    };

    return (
        <>
        <AdminSidebar show={show} handleClose={handleClose} />
        <ComNavbar handleShow={handleShow} />
        <div className='container'>
            <p onClick={()=>navigate(`${role=='Admin' ? '/admin': '/manager' }/get-agents`)} className='back-btn'>
                <i className="fa-solid fa-arrow-left"></i> Back
            </p>
            <h2>Create New User / Agent</h2>
            <form className='customForm' onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                        type='email'
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                        type='tel'
                        className="form-control"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                            required
                        >
                            <option value="Agent">Agent</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Location</label>
                        <select
                            className="form-select filterInput"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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

                <div className="mb-3">
                    <label className="form-label">Set Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Set password (min 6 characters)"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Create {selectedRole}
                </button>
            </form>
        </div>
        </>
    )
}

export default CreateAgent
