import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';

const AgentDashboard = () => {
  const [show, setShow] = useState(false);
  const {backendUrl, uName, token} = useContext(AppContext)
  const [leads, setLeads] = useState([]);
  const [todaysLeads, setTodaysLeads] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const stageCategories = ["RNR", "follow-up", "site-visit", "site-visit-done", "revisit", "booking"];

  // Calculate lead count for each stage
  const leadCounts = leads.reduce((acc, lead)=>{
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  },{})

  const getAllLeads = async () => {
    const { data } = await axios.get(backendUrl + '/lead/get/agent/leads', {
      headers: { token },
    });

    if (data.success) {
      setLeads(data.leads);

      const today = new Date().toISOString().split("T")[0];
      // Filter leads where followUpDate matches today
      const filteredLeads = data.leads.filter(lead => 
        lead.followUpDate && lead.followUpDate.split("T")[0] === today
        
      );

      setTodaysLeads(filteredLeads);
    } else {
      toast.error(data.message);
    }
  };


  useEffect(()=>{
    getAllLeads();
  },[])

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = todaysLeads.slice(indexOfFirstLead, indexOfLastLead);

  const nextPage = () => {
    if (currentPage < Math.ceil(todaysLeads.length / leadsPerPage)) {
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
      <AdminSidebar show={show} handleClose={handleClose}/>
      <Navbar handleShow={handleShow}/>

      <div className="container py-4">
        {/* Top Header */}
        <div className="page-header">
          <div>
            <h2>Welcome back, {uName}!</h2>
            <p>Your personal sales performance, active client leads, and follow-up agenda.</p>
          </div>
          <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
            <i className="fa-solid fa-user-tag me-1"></i> Assigned Leads: {leads.length}
          </span>
        </div>

        {/* Lead Stage Cards */}
        <div className="stage-summary">
          {stageCategories.map((stage) => (
            <div key={stage} className="stage-box">
              <h6>{stage.replace("-", " ")}</h6>
              <p>{leadCounts[stage] || 0}</p>
            </div>
          ))}
        </div>

        {/* 2-Column Dashboard Grid */}
        <div className="row g-4">
          {/* Recently Added Leads */}
          <div className="col-12 col-lg-7">
            <div className="dashboard-box h-100 mb-0">
              <div className="dashboard-title">
                <h3><i className="fa-solid fa-clock text-primary me-2"></i> Recently Added Leads</h3>
                <span className="badge bg-light text-muted border">Latest 5</span>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lead Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length > 0 ? (
                      leads.slice(-5).reverse().map((lead, index) => (
                        <tr key={lead._id || index}>
                          <td className="fw-semibold text-muted">{index + 1}</td>
                          <td className="fw-bold text-dark">{lead.name}</td>
                          <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {lead.phone}</td>
                          <td>{lead.email || "—"}</td>
                          <td><span className="badge bg-light text-dark border">{lead.project?.name || "N/A"}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">No assigned leads yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Today's Follow-ups */}
          <div className="col-12 col-lg-5">
            <div className="dashboard-box h-100 mb-0">
              <div className="dashboard-title">
                <h3><i className="fa-solid fa-calendar-day text-primary me-2"></i> Today's Follow-up</h3>
                <span className="badge bg-danger rounded-pill">{todaysLeads.length} Due</span>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLeads.length > 0 ? (
                      currentLeads.map((lead) => (
                        <tr key={lead._id}>
                          <td className="fw-bold text-dark">{lead.name}</td>
                          <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {lead.phone}</td>
                          <td><span className="badge bg-light text-dark border">{lead.project?.name || "N/A"}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-muted">
                          <i className="fa-solid fa-circle-check text-success me-1"></i> No follow-ups due today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {todaysLeads.length > leadsPerPage && (
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    <i className="fa-solid fa-chevron-left me-1"></i> Prev
                  </button>
                  <span>Page {currentPage} of {Math.ceil(todaysLeads.length / leadsPerPage)}</span>
                  <button onClick={nextPage} disabled={currentPage === Math.ceil(todaysLeads.length / leadsPerPage)}>
                    Next <i className="fa-solid fa-chevron-right ms-1"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AgentDashboard
