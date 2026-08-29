import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManagerLead = () => {
  const { backendUrl, token } = useContext(AppContext);
  const { projectId } = useParams();

  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState("");
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
  }, []);
  return (
    <div>
    <ManagerLead show={show} handleClose={handleClose} />
    <Navbar handleShow={handleShow} />

    <div className="container lead-container">
        <div className="stage-summary">
          {stageCategories.map((stage) => (
            <div key={stage} className="col-2">
              <div className="stage-box">
                <h6>{stage.replace("-", " ").toUpperCase()}</h6>
                <p>{leadCounts[stage] || 0} Leads</p>
              </div>
            </div>
          ))}
        </div>

        <div className="controls">
          <div className="row">
            <div className="col-12 col-md-4 control-col">
              <form className="searchBarForm">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input onChange={(e)=>setQuery(e.target.value.toLowerCase())} type="text" name="" id="" placeholder="Search by name"/>
              </form>
            </div>
            <div className="col-12 col-md-3 control-col">
              <p style={{lineHeight:'15px'}} className="m-0">Filter by stage</p>
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
            <div className="col-12 col-md-3 control-col">
              <p style={{lineHeight:'15px'}} className="m-0">Filter by Source</p>
              <select
              className="form-select filterInput"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              >
              <option value="">All Source</option>
              <option value="Meta">Meta</option>
              <option value="Google">Google</option>
              <option value="Manual">Manual</option>
            </select>
            </div>
            <div className="col-12 col-md-2 control-col">
              <p className="m-0">
              Total <strong>{leads.length}</strong> Leads Found
              </p>
            </div>
          </div>
        </div>
        <div
          style={{ border: "1px solid #dee2e6", borderRadius: "12px" }}
          className="col-sm-12 table-responsive"
        >
          <table className="table dataTable no-footer m-0 text-center">
            <thead className="thead-light lead-thead">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Number</th>
                <th>Email</th>
                <th>Stages</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Follow-up Date</th>
                <th>Source</th>
                <th>Update</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8}>No leads Found</td>
                </tr>
              ) : (
                leads.filter((lead) => lead.name.toLowerCase().includes(query) && (stageFilter === "" || lead.stage === stageFilter) && (sourceFilter === "" || lead.source === sourceFilter)).map((lead, index)=>(
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.email}</td>
                    <td>{lead.stage}</td>
                    <td>{lead.status}</td>
                    <td>{lead.remarks}</td>
                    <td>{lead.followUpDate ? new Date(lead.followUpDate).toISOString().split("T")[0] : "Not Available"}</td>
                    <td>{lead.source || 'Manual'}</td>
                    <td>
                      <button onClick={() => handleShowModal(lead)} className="btn-primary">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDeleteLead(lead._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
                // leads.map((lead, index) => (

                // ))
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
  )
}

export default ManagerLead
