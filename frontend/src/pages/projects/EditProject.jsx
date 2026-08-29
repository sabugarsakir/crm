import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminSidebar";
import ComNavbar from "../../components/Navbar";

const EditProject = () => {
    const { backendUrl, token, role } = useContext(AppContext);
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [projectInfo, setProjectInfo] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [agents, setAgents] = useState([]); // All available agents
    const [selectedAgents, setSelectedAgents] = useState([]); // Assigned agents
    const [isMandateProject, setIsMandateProject] = useState(false);

    // Fetch project info
    const getProjectInfo = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/project/get/${projectId}`, {
                headers: { token },
            });

            if (data.success) {
                setProjectInfo(data.project);
                setName(data.project.name);
                setDescription(data.project.description);
                setLocation(data.project.location)
                setStatus(data.project.status)
                setSelectedAgents(data.project.assignedAgents || []);
                setIsMandateProject(data.project.isMandateProject || false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching project info:", error);
        }
    };

    // Fetch available agents
    const getAgents = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/user/get/agents`);
            if (data.success) {
                setAgents(data.agents);
            } else {
                toast.error("Failed to fetch agents.");
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    useEffect(() => {
        getProjectInfo();
        getAgents();
    }, []);

    // Handle agent selection (toggle selection)
    const handleAgentSelection = (agentId) => {
        setSelectedAgents((prevSelected) =>
            prevSelected.includes(agentId)
                ? prevSelected.filter((id) => id !== agentId) // Deselect
                : [...prevSelected, agentId] // Select
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || selectedAgents.length === 0) {
            toast.error("Please fill all fields and select at least one agent.");
            return;
        }

        try {
            const { data } = await axios.post(`${backendUrl}/project/update`, {
                id: projectInfo._id,
                name,
                description,
                location,
                status,
                assignedAgents: selectedAgents,
                isMandateProject
            });

            if (data.success) {
                toast.success("Project updated successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating project.");
        }
    };

    return (
        
        <>

        <AdminSidebar show={show} handleClose={handleClose} />
        <ComNavbar handleShow={handleShow} />

        <div className="container mt-4">
        <p onClick={()=>navigate(`${role=='Admin' ? '/admin': '/manager' }/projects`)} className='back-btn'><i className="fa-solid fa-arrow-left"></i> Back</p>
            <h2>Edit Project</h2>

            <form className="customForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Assign Agents</label>
                    {agents.length > 0 ? (
                        agents.map((agent) => (
                            <div key={agent._id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`agent-${agent._id}`}
                                    value={agent._id}
                                    checked={selectedAgents.includes(agent._id)}
                                    onChange={() => handleAgentSelection(agent._id)}
                                />
                                <label className="form-check-label" htmlFor={`agent-${agent._id}`}>
                                    {agent.name}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>Loading agents...</p>
                    )}
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

                <div className="mb-3">
                    <div className="form-label">Status</div>
                    <select
                        className="form-select filterInput"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        >
                        <option value="Active">Active</option>
                        <option value="Hold">Hold</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="isMandateProject"
                    checked={isMandateProject}
                    onChange={(e) => setIsMandateProject(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isMandateProject">
                    Is Mandate Project
                </label>
                </div>


                <button type="submit" className="btn-primary">
                    Update Project
                </button>
            </form>
        </div>
        </>
    );
};

export default EditProject;
