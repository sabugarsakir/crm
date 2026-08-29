import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import CreateProject from '../projects/CreateProject';
import ManagerSidebar from '../../components/ManagerSidebar';
import AdminSidebar from '../../components/AdminSidebar';
import ComNavbar from '../../components/Navbar';

const GetProjects = () => {
    const { backendUrl, token } = useContext(AppContext);

    const [projects, setProjects] = useState([]);
    const [agents, setAgents] = useState([]);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;
    // Lead form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [source, setSource] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedAgents, setSelectedAgents] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleCloseCreateProjectModal = () => setShowCreateProjectModal(false);
    const handleShowCreateProjectModal = () => setShowCreateProjectModal(true);

    // Fetch projects
    const getProjects = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/project/get`, { headers: { token } });
            if (data.success) setProjects(data.projects);
            else toast.error(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch available agents
    const fetchAgents = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/user/get/agents`);
            if (data.success) setAgents(data.agents);
            else toast.error(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProjects();
        fetchAgents();
    }, []);

    // Handle creating a lead
    const handleCreateLead = async () => {
        if (!name || !email ||!phone ||!source ||!selectedProject || selectedAgents.length === 0) {
            toast.error("Please fill all fields and select at least one agent.");
            return;
        }
        setLoading(true); // Show loader
        try {
            const { data } = await axios.post(`${backendUrl}/lead/create`, {
                name,
                email,
                phone,
                source,
                assignedAgent: selectedAgents, // Sending multiple agents
                project: selectedProject
            });

            if (data.success) {
                toast.success("Lead created successfully!");
                setName('')
                setEmail('')
                setPhone('')
                setSource('')
                setSelectedProject('')
                setSelectedAgents([])
                handleCloseModal();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create lead.");
        }
        finally {
            setLoading(false); // Hide loader after request completes
        }
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const nextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    
    const prevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="pb-5">
            <AdminSidebar show={show} handleClose={handleClose} />
            <ComNavbar handleShow={handleShow} />

            <div className="container py-4">
                {/* Header Toolbar */}
                <div className="page-header">
                    <div>
                        <h2>Manage Projects</h2>
                        <p>Configure property details, monitor pipeline, and assign agents.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button onClick={handleShowModal} className="btn-secondary">
                            <i className="fa-solid fa-user-plus"></i> Create Lead
                        </button>
                        <button onClick={handleShowCreateProjectModal} className="btn-primary">
                            <i className="fa-solid fa-plus"></i> New Project
                        </button>
                    </div>
                </div>
                
                {/* Projects List */}
                {currentProjects.length > 0 ? (
                    currentProjects.map((item, index) => (
                        <div className="project-card" key={item._id || index}>
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <h3 className="fs-5 m-0 text-dark fw-bold">{item.name}</h3>
                                    <span className={`badge ${item.status === "Active" ? "bg-success" : item.status === "Hold" ? "bg-warning text-dark" : "bg-danger"} rounded-pill`}>
                                        {item.status || "Active"}
                                    </span>
                                    {item.isMandateProject && (
                                        <span className="badge bg-primary rounded-pill">Mandate Project</span>
                                    )}
                                </div>
                                <p className="text-secondary small mb-2">{item.description}</p>
                                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                                    <span><i className="fa-solid fa-location-dot text-primary me-1"></i> {item.location}</span>
                                    <span><i className="fa-regular fa-calendar text-muted me-1"></i> Added: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button onClick={() => navigate(`/manage/project/edit/${item._id}`)} className="btn-secondary">
                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                                <button onClick={() => navigate(`/manage/lead/${item._id}`)} className="btn-primary">
                                    <i className="fa-solid fa-users"></i> Manage Leads
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="dashboard-box text-center py-5 text-muted">
                        <i className="fa-solid fa-building fs-3 mb-2 d-block text-primary"></i>
                        No projects found. Click "New Project" to create one.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={prevPage} disabled={currentPage === 1}>
                            <i className="fa-solid fa-chevron-left me-1"></i> Prev
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>
                            Next <i className="fa-solid fa-chevron-right ms-1"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Create Lead Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Lead</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Source</Form.Label>
                            <Form.Select value={source} onChange={(e) => setSource(e.target.value)}>
                                <option value="">Select a source</option>
                                <option value="Meta">Meta</option>
                                <option value="Google">Google</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Project</Form.Label>
                            <Form.Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Assign Agents</Form.Label>
                            <div>
                            <p className="text-yellow"><i className="fa-solid fa-circle-exclamation"></i> Please select agents according to the selected project.</p>
                                {agents.map(agent => (
                                    <Form.Check 
                                        key={agent._id}
                                        type="checkbox"
                                        label={`${agent.name} (${agent.email})`}
                                        value={agent._id}
                                        checked={selectedAgents.includes(agent._id)}
                                        onChange={(e) => {
                                            const agentId = e.target.value;
                                            setSelectedAgents(prev => 
                                                prev.includes(agentId) 
                                                    ? prev.filter(id => id !== agentId) // Remove if already selected
                                                    : [...prev, agentId] // Add if not selected
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateLead} disabled={loading}>
                        {loading ? (
                            <>
                                <i className="fa fa-spinner fa-spin"></i> Creating...
                            </>
                        ) : (
                            "Create"
                        )}
                    </Button>

                </Modal.Footer>
            </Modal>

            {/* create project Modal */}
            <CreateProject show={showCreateProjectModal} onHide={handleCloseCreateProjectModal}/>
        </div>
    );
}

export default GetProjects;
