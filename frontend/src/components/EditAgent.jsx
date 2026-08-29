import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from './AdminSidebar';
import ComNavbar from './Navbar';

const EditAgent = () => {
    const { backendUrl, token, role } = useContext(AppContext);
    const { agentId } = useParams();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [agentInfo, setAgentInfo] = useState({});
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [password, setpassword] = useState("")
    const [agentRole, setAgentRole] = useState("")
    const [viewPassword, setViewPassword] = useState("")

        // Fetch agent info
        const getAgentInfo = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/user/get/agent/${agentId}`, {
                    headers: { token },
                });
    
                if (data.success) {
                    setAgentInfo(data.agent);
                    setName(data.agent.name);
                    setEmail(data.agent.email)
                    setLocation(data.agent.location)
                    setViewPassword(data.agent.password)
                    setAgentRole(data.agent.role)
                    setPhone(`${data.agent.number ? data.agent.number : 'Not Avail'}`)
                } else {
                }
            } catch (error) {
                console.error("Error fetching Agent info:", error);
            }
        };


            // Handle form submission
            const handleSubmit = async (e) => {
                e.preventDefault();

                if (!name || !phone || !email) {
                    toast.error("Please fill all fields");
                    return;
                }

                try {
                    const { data } = await axios.post(`${backendUrl}/user/update/${agentId}`, {
                        name,
                        number: phone,
                        email,
                        password,
                        location
                    });

                    if (data.success) {
                        toast.success("Agent updated successfully!");
                    } else {
                        toast.error(data.message);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Error updating agent.");
                }
            };

        useEffect(()=>{
            getAgentInfo();
        },[])
    
  return (
    <>
    <AdminSidebar show={show} handleClose={handleClose} />
    <ComNavbar handleShow={handleShow} />
    <div className='container'>
        <p onClick={()=>navigate(`${role=='Admin' ? '/admin': '/manager' }/get-agents`)} className='back-btn'><i className="fa-solid fa-arrow-left"></i> Back</p>
        <h2>Edit Agent</h2>

            <form className='customForm' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Agent ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={agentInfo._id || ""}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Agent Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Agent Email</label>
                    <input
                        type='email'
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Agent Contact No.</label>
                    <input
                        type='text'
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <div className="form-label">Location</div>
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

                {agentRole === "Channel Partner" && (
                <div className="mb-3">
                    <label className="form-label">View Password</label>
                    <input
                    type="text"
                    className="form-control"
                    readOnly
                    value={viewPassword}
                    />
                </div>
                )}

                {agentRole !== "Channel Partner" && (
                <div className="mb-3">
                    <label className="form-label">Set New Password</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password (leave blank to keep existing)"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    />
                </div>
                )}

                <button type="submit" className="btn-primary">
                    Update Agent
                </button>
            </form>
    </div>
    </>
  )
}

export default EditAgent
