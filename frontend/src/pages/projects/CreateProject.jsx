import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import notify from "../../utils/notify";

const CreateProject = ({ show, onHide, onProjectCreated }) => {
    const { backendUrl, token } = useContext(AppContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [agents, setAgents] = useState([]); // Store available agents
    const [selectedAgents, setSelectedAgents] = useState([]); // Store selected agent IDs
    const [location, setLocation] = useState("Bangalore");
    const [isMandateProject, setIsMandateProject] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch available agents when the component loads
    useEffect(() => {
        if (!show) return;
        const fetchAgents = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/user/get/agents`);
                if (data.success) {
                    setAgents(data.agents || []);
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };
        fetchAgents();
    }, [show, backendUrl]);

    // Handle agent selection (multiple selection)
    const handleAgentSelection = (agentId) => {
        setSelectedAgents((prevSelected) =>
            prevSelected.includes(agentId)
                ? prevSelected.filter((id) => id !== agentId) // Deselect if already selected
                : [...prevSelected, agentId] // Select agent
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !description.trim() || selectedAgents.length === 0) {
            notify.warning("Incomplete Form", "Please fill name, description, and assign at least one agent.");
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/project/create`, {
                name,
                description,
                assignedAgents: selectedAgents,
                location,
                isMandateProject
            }, {
                headers: { token }
            });

            if (data.success) {
                notify.success("Project Created", `"${name}" has been created successfully.`);
                setName("");
                setDescription("");
                setSelectedAgents([]);
                setLocation("Bangalore");
                setIsMandateProject(false);
                // Trigger auto-refresh in parent component - zero page reload!
                if (onProjectCreated) onProjectCreated();
                onHide();
            } else {
                notify.error("Creation Failed", data.message || "Failed to create project.");
            }
        } catch (error) {
            console.error(error);
            notify.error("Error", error.response?.data?.message || "Error creating project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="fs-5 fw-bold">
                    <i className="fa-solid fa-folder-plus text-primary me-2"></i> Create New Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Project Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. Prestige Green Valley"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            disabled={loading}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={3}
                            placeholder="Key highlights, unit types, amenities..."
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            disabled={loading}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <Form.Label className="fw-semibold m-0">Assign Team Members</Form.Label>
                            <span className="badge bg-secondary rounded-pill" style={{ fontSize: '11px' }}>
                                {selectedAgents.length} selected
                            </span>
                        </div>
                        <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="p-2 border rounded bg-light">
                            {agents.length > 0 ? (
                                agents.map((agent) => (
                                    <div key={agent._id} className="form-check py-1">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`agent-${agent._id}`}
                                            value={agent._id}
                                            checked={selectedAgents.includes(agent._id)}
                                            onChange={() => handleAgentSelection(agent._id)}
                                            disabled={loading}
                                        />
                                        <label className="form-check-label d-flex align-items-center gap-2 cursor-pointer" htmlFor={`agent-${agent._id}`}>
                                            <span className="fw-medium">{agent.name}</span>
                                            <span className="badge bg-secondary text-white rounded-pill" style={{ fontSize: '10px' }}>
                                                {agent.role || 'Agent'}
                                            </span>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small m-0 p-2 text-center">Loading team members...</p>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Location</Form.Label>
                        <select
                            className="form-select filterInput"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            disabled={loading}
                            required
                        >
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Noida">Noida</option>
                            <option value="Delhi">Delhi</option>
                            <option value="NCR">NCR</option>
                            <option value="Other">Other</option>
                        </select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isMandateProject"
                                checked={isMandateProject}
                                onChange={(e) => setIsMandateProject(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="form-check-label fw-medium" htmlFor="isMandateProject">
                                Mark as Mandate Project (Channel Partner Access)
                            </label>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide} disabled={loading} className="rounded-pill px-3">
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading} className="rounded-pill px-4">
                    {loading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin me-1"></i> Creating...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-plus me-1"></i> Create Project
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateProject;
