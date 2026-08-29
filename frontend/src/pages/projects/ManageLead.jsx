import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminSidebar from '../../components/AdminSidebar';
import ComNavbar from '../../components/Navbar';

const ManageLead = () => {
  const { backendUrl, token, role } = useContext(AppContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 20;

  // Lead modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // Store selected lead

  const handleCloseModal = () => setShowModal(false);

  const [allProjects, setAllProjects] = useState([]);

const fetchAllProjects = async () => {
  try {
    const { data } = await axios.get(backendUrl + "/project/getAllProject", { headers: { token } });
    if (data.success) {
      setAllProjects(data.projects);
    }
  } catch (error) {
    console.error("Error fetching projects", error);
  }
};

  
  // Function to open modal and set selected lead
  const handleShowModal = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
  
    try {
      const { data } = await axios.post(
        backendUrl + "/lead/update",
        {
          id: selectedLead._id,
          stage: selectedLead.stage,
          status: selectedLead.status,
          remarks: selectedLead.remarks,
          followUpDate: selectedLead.followUpDate,
          interested_in: selectedLead.interested_in
        }
      );
  
      if (data.success) {
        toast.success("Lead updated successfully!");
        handleCloseModal(); // Close modal after success
        getLeads(); // Refresh lead data
      } else {
        toast.error("Failed to update lead: " + data.message);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const handleDeleteLead = async (id) => {
    // Show confirmation popup
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(`${backendUrl}/lead/delete/${id}`, {
            headers: { token },
          });

          if (data.success) {
            toast.success("Lead deleted successfully!");
            getLeads(); // Refresh the lead list
          } else {
            toast.error("Failed to delete lead: " + data.message);
          }
        } catch (error) {
          console.error("Error deleting lead:", error);
          toast.error("Something went wrong. Please try again.");
        }
      }
    });
  };


  const getLeads = async () => {
    const { data } = await axios.get(backendUrl + `/lead/get/${projectId}`, {
      headers: { token },
    });

    if (data.success) {
      setLeads(data.leads);
    } else {
      toast.error(data.message);
    }
  };

  // Define stage categories
  const stageCategories = ["RNR", "follow-up", "site-visit", "site-visit-done", "revisit", "booking"];

  // Calculate lead count for each stage
  const leadCounts = leads.reduce((acc, lead)=>{
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  },{})


  useEffect(() => {
    getLeads();
    fetchAllProjects();
  }, []);

    // Pagination Logic
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  
    const nextPage = () => {
      if (currentPage < Math.ceil(leads.length / leadsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

  return (
    <div className="pb-5">
      <AdminSidebar show={show} handleClose={handleClose} />
      <ComNavbar handleShow={handleShow} />

      <div className="container py-4">
        {/* Top Breadcrumb & Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button onClick={() => navigate(`${role === 'Admin' ? '/admin' : role === 'Manager' ? '/manager' : '/agent'}/projects`)} className="back-btn m-0">
            <i className="fa-solid fa-arrow-left"></i> Back to Projects
          </button>
          <span className="badge bg-primary px-3 py-2 rounded-pill">
            <i className="fa-solid fa-list-check me-1"></i> Total Leads: {leads.length}
          </span>
        </div>

        {/* Stage Summary Cards */}
        <div className="stage-summary">
          {stageCategories.map((stage) => (
            <div key={stage} className="stage-box">
              <h6>{stage.replace("-", " ")}</h6>
              <p>{leadCounts[stage] || 0}</p>
            </div>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="controls">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="searchBarForm">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input 
                  onChange={(e) => setQuery(e.target.value.toLowerCase())} 
                  type="text" 
                  placeholder="Search lead by name..." 
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select filterInput"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="">All Stages</option>
                <option value="RNR">RNR</option>
                <option value="follow-up">Follow-up</option>
                <option value="site-visit">Site Visit</option>
                <option value="site-visit-done">Site Visit Done</option>
                <option value="revisit">Revisit</option>
                <option value="booking">Booking</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select filterInput"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">All Sources</option>
                <option value="Meta">Meta</option>
                <option value="Google">Google</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select filterInput"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Priority Status</option>
                <option value="cold">Cold</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Data Table */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Follow-up</th>
                <th>Source</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-muted">
                    <i className="fa-solid fa-folder-open me-2"></i> No leads found matching criteria.
                  </td>
                </tr>
              ) : (
                currentLeads
                  .filter((lead) => 
                    lead.name.toLowerCase().includes(query) && 
                    (stageFilter === "" || lead.stage === stageFilter) && 
                    (sourceFilter === "" || lead.source === sourceFilter) && 
                    (statusFilter === "" || lead.status === statusFilter)
                  )
                  .map((lead, index) => (
                    <tr key={lead._id || index}>
                      <td className="fw-semibold text-muted">{indexOfFirstLead + index + 1}</td>
                      <td className="fw-bold text-dark">{lead.name}</td>
                      <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {lead.phone}</td>
                      <td>{lead.email || "—"}</td>
                      <td><span className="badge-stage">{lead.stage}</span></td>
                      <td>
                        <span className={`badge-status badge-status-${lead.status || 'cold'}`}>
                          {lead.status || 'cold'}
                        </span>
                      </td>
                      <td>
                        <div style={{ maxWidth: '180px' }} className="text-truncate" title={lead.remarks}>
                          {lead.remarks || "No remarks"}
                        </div>
                      </td>
                      <td>{lead.followUpDate ? new Date(lead.followUpDate).toISOString().split("T")[0] : "—"}</td>
                      <td><span className="badge bg-light text-dark border">{lead.source || 'Manual'}</span></td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button onClick={() => handleShowModal(lead)} className="btn-action-edit" title="Update Lead">
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                          </button>
                          {(role !== "Agent" && role !== "Channel Partner") && (
                            <button className="btn-action-delete" onClick={() => handleDeleteLead(lead._id)} title="Delete Lead">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {leads.length > leadsPerPage && (
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={currentPage === 1}>
              <i className="fa-solid fa-chevron-left me-1"></i> Prev
            </button>
            <span>Page {currentPage} of {Math.ceil(leads.length / leadsPerPage)}</span>
            <button onClick={nextPage} disabled={currentPage === Math.ceil(leads.length / leadsPerPage)}>
              Next <i className="fa-solid fa-chevron-right ms-1"></i>
            </button>
          </div>
        )}
      </div>

        {/* Lead Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Lead</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedLead?.name || "Loading..."}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedLead?.email || "Loading..."}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedLead?.phone || "Loading..."}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Source</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedLead?.source || "Loading..."}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Stage</Form.Label>
                <Form.Select
                  value={selectedLead?.stage || ""}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, stage: e.target.value })
                  }
                >
                  <option value="">Set Stage</option>
                  <option value="RNR">RNR</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="site-visit">Site Visit</option>
                  <option value="site-visit-done">Site Visit Done</option>
                  <option value="revisit">Revisit</option>
                  <option value="booking">Booking</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={selectedLead?.status || ""}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, status: e.target.value })
                  }
                >
                  <option value="">Set Status</option>
                  <option value="cold">Cold</option>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedLead?.remarks || ""}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, remarks: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Follow-up Date</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    selectedLead?.followUpDate
                      ? new Date(selectedLead.followUpDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, followUpDate: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Interested In (Other Projects)</Form.Label>
                <Form.Select
                  multiple
                  value={selectedLead?.interested_in || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedLead({ ...selectedLead, interested_in: selectedOptions });
                  }}
                >
                  {allProjects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
              {selectedLead?.timeline?.length > 0 && (
                <>
                  <hr />
                  <h6>Timeline:</h6>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    <ul style={{fontSize: '14px', listStyle: 'none', paddingLeft: 0}} className="timeline-list">
                      {selectedLead.timeline.map((entry, index) => (
                        <li key={index}>
                          <strong>{entry.stage}</strong> - {entry.remarks} <br />
                          <small>{new Date(entry.date).toLocaleDateString()}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateLead}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default ManageLead;
