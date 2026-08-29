import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext.jsx'
import Sidebar from '../../components/Sidebar.jsx'
import Navbar from '../../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import AdminSidebar from '../../components/AdminSidebar.jsx'
import AssignAgentSelf from '../projects/AssignAgentSelf.jsx'

const AgentProjects = () => {

    const {backendUrl, token, uId, role} = useContext(AppContext)
    const [projects, setProjects] = useState([])

    const [showAssignAgentModal, setshowAssignAgentModal] = useState(false);
    const handleCloseAssignAgentModal = () => setshowAssignAgentModal(false);
    const handleshowAssignAgentModal = () => setshowAssignAgentModal(true);
    // create lead
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [source, setSource] = useState("");
    const [selectedProject, setSelectedProject] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    
    // Function to open modal and set selected lead
    const handleShowModal = () => {
      setShowModal(true);
    };

    const navigate = useNavigate();
    const getProjects = async () => {
      try {
        const {data} = await axios.get(backendUrl+'/project/get', {headers:{token}});

        if(data.success){
            setProjects(data.projects || [])
        }
        else{
            toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    const handleCreateLead = async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/lead/create`, {
          name,
          email,
          phone,
          source,
          assignedAgent: uId,
          project: selectedProject
      }, { headers: { token } });

      if (data.success) {
        toast.success("Lead created successfully!");
        setName('')
        setEmail('')
        setPhone('')
        setSource('')
        setSelectedProject('')
        handleCloseModal();
      } else {
        toast.error(data.message);
      }
        
      } catch (error) {
        console.error(error);
        toast.error("Failed to create lead");
      }
    }

    useEffect(()=>{
        getProjects()
    },[])

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
      <AdminSidebar show={show} handleClose={handleClose}/>
      <Navbar handleShow={handleShow}/>

      <div className="container py-4">
        <div className="page-header">
          <div>
            <h2>{role === 'Channel Partner' ? 'Mandate Projects' : 'Assigned Projects'}</h2>
            <p>Explore active developments and manage prospective client leads.</p>
          </div>
          <div className="d-flex gap-2">
            <button onClick={() => handleShowModal()} className="btn-secondary">
              <i className="fa-solid fa-user-plus"></i> Submit Client Lead
            </button>
            {role !== 'Channel Partner' && (
              <button onClick={handleshowAssignAgentModal} className="btn-primary">
                <i className="fa-solid fa-layer-group"></i> Browse Available Projects
              </button>
            )}
          </div>
        </div>

        {currentProjects.length === 0 ? (
          <div className="dashboard-box text-center py-5 text-muted">
            <i className="fa-solid fa-building fs-3 mb-2 d-block text-primary"></i>
            <strong>No projects currently assigned.</strong>
            <p className="small text-muted mt-1">Join an available project or contact your team manager.</p>
          </div>
        ) : (
          <>
            {currentProjects.map((item, index) => (
              <div className="project-card" key={item._id || index}>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h3 className="fs-5 m-0 text-dark fw-bold">{item.name}</h3>
                    <span className={`badge ${item.status === "Active" ? "bg-success" : item.status === "Hold" ? "bg-warning text-dark" : "bg-danger"} rounded-pill`}>
                      {item.status || "Active"}
                    </span>
                    {item.isMandateProject && (
                      <span className="badge bg-primary rounded-pill">Mandate</span>
                    )}
                  </div>
                  <p className="text-secondary small mb-2">{item.description}</p>
                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                    <span><i className="fa-solid fa-location-dot text-primary me-1"></i> {item.location}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button onClick={() => navigate(`/agent/lead/${item._id}`)} className="btn-primary">
                    <i className="fa-solid fa-users"></i> View Leads
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
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
          </>
        )}
      </div>



      {/* create lead modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Lead</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Source</Form.Label>
                <Form.Select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="">Select a source</option>
                  <option value="Meta">Meta</option>
                  <option value="Google">Google</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Project</Form.Label>
                <Form.Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateLead}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>


        {/* <AssignAgentSelf show={showAssignAgentModal} onHide={handleCloseAssignAgentModal}/> */}

        <AssignAgentSelf show={showAssignAgentModal} onHide={() => { handleCloseAssignAgentModal();
          getProjects(); // refresh project list after assignment
        }}/>


    </div>
  )
}

export default AgentProjects
