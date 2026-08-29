import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";

const AgentFollowupLeads = () => {
  const { backendUrl, token } = useContext(AppContext);
  const { projectId } = useParams();

  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Lead modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // Store selected lead

  const handleCloseModal = () => setShowModal(false);
  
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
          remarks: selectedLead.remarks,
          followUpDate: selectedLead.followUpDate,
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
    const { data } = await axios.get(backendUrl + '/lead/get/agent/follow-up-leads', {
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
  }, []);

  return (
    <div className="pb-5">
      <AdminSidebar show={show} handleClose={handleClose} />
      <Navbar handleShow={handleShow} />

      <div className="container py-4">
        {/* Top Header */}
        <div className="page-header">
          <div>
            <h2>Follow-up Lead Pipeline</h2>
            <p>Track, connect, and update all scheduled prospect communications.</p>
          </div>
          <div>
            <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
              <i className="fa-solid fa-phone-volume me-1"></i> {leads.length} In Follow-up
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="controls">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="searchBarForm">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input 
                  onChange={(e) => setQuery(e.target.value.toLowerCase())} 
                  type="text" 
                  placeholder="Search prospect by name..." 
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select filterInput"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">All Sources</option>
                <option value="Meta">Meta</option>
                <option value="Google">Google</option>
                <option value="Manual">Manual</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
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
                <th>Project</th>
                <th>Prospect Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Follow-up Date</th>
                <th>Source</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-5 text-muted">
                    <i className="fa-solid fa-calendar-check fs-4 mb-2 d-block text-primary"></i>
                    No leads currently in follow-up stage.
                  </td>
                </tr>
              ) : (
                leads
                  .filter((lead) => 
                    lead.name.toLowerCase().includes(query) && 
                    (sourceFilter === "" || lead.source === sourceFilter) && 
                    (statusFilter === "" || lead.status === statusFilter)
                  )
                  .map((lead, index) => (
                    <tr key={lead._id || index}>
                      <td className="fw-semibold text-muted">{index + 1}</td>
                      <td><span className="badge bg-light text-dark border">{lead.project?.name || "N/A"}</span></td>
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
                      <td className="text-center">
                        <button onClick={() => handleShowModal(lead)} className="btn-action-edit" title="Update Lead">
                          <i className="fa-solid fa-pen-to-square"></i> Update
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
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
    </div>
  );
};

export default AgentFollowupLeads;
