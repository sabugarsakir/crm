import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";


const CreateProject = ({show, onHide}) => {
    const {backendUrl} = useContext(AppContext)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [agents, setAgents] = useState([]); // Store available agents
    const [selectedAgents, setSelectedAgents] = useState([]); // Store selected agent IDs
    const [location, setLocation] = useState("Bangalore");
    const [isMandateProject, setIsMandateProject] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch available agents when the component loads
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/user/get/agents`);
                if (data.success) {
                    setAgents(data.agents);
                } else {
                    setMessage("Failed to fetch agents.");
                }
            } catch (error) {
                console.error(error);
                setMessage("Error fetching agents.");
            }
        };
        fetchAgents();
    }, []);

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
        setLoading(true);
        setMessage("");

        if (!name || !description || selectedAgents.length === 0) {
            toast.error("Please fill all fields and select at least one agent.");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${backendUrl}/project/create`, {
                name,
                description,
                assignedAgents: selectedAgents,
                location,
                isMandateProject
            });

            if (data.success) {
                toast.success("Project created successfully!");
                setName("");
                setDescription("");
                setSelectedAgents([]);
                setLocation("")
                setIsMandateProject('false')
                onHide()
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error creating project.");
        }

        setLoading(false);
    };

    return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Assign Agents</Form.Label>
                            <div style={{height: '200px', overflowY: 'scroll'}}>
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
                                        <label className="d-inline form-check-label" htmlFor={`agent-${agent._id}`}>
                                            {agent.name} - <p style={{fontSize:'12px'}} className="d-inline">{agent.role}</p>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p>Loading agents...</p>
                            )}
                            </div>
                        </Form.Group>

                        <Form.Group>
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
                        </Form.Group>

                        <Form.Group>
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

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
    );
};

export default CreateProject;
