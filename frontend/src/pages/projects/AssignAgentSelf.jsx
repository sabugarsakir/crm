import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AssignAgentSelf = ({ show, onHide }) => {
  const { backendUrl, token, uId } = useContext(AppContext);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);

  const getAvailableProjects = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/project/getAllProject`, {
        headers: { token },
      });

      if (data.success) {
        // Filter only projects where agent is not assigned
        const filtered = (data.projects || []).filter(
          (proj) =>
            !proj.assignedAgents ||
            !proj.assignedAgents.some(
              (agent) => (agent?._id || agent)?.toString() === uId?.toString()
            )
        );
        setAvailableProjects(filtered);
      } else {
        toast.error(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects.");
    }
  };

  const handleAssign = async () => {
    if (!selectedProject) return toast.warning("Please select a project");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/project/assign-self/${selectedProject}`,
        {},
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Successfully assigned to project");
        setSelectedProject("");
        onHide(); // close modal and trigger refresh in parent
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error assigning to project:", error);
      toast.error("Error assigning to project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setSelectedProject("");
      getAvailableProjects();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Join Available Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Select Project</Form.Label>
          <Form.Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select Project --</option>
            {availableProjects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name} ({proj.location || "N/A"})
              </option>
            ))}
          </Form.Select>
          {availableProjects.length === 0 && (
            <Form.Text className="text-muted mt-2 d-block">
              No new unassigned projects available at the moment.
            </Form.Text>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={loading || !selectedProject}
        >
          {loading ? "Assigning..." : "Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignAgentSelf;