import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import AdminSidebar from '../../components/AdminSidebar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {

  const {backendUrl, uName, token} = useContext(AppContext)
  const [show, setShow] = useState(false);
  const [leads, setLeads] = useState([]);
  const [todaysLeads, setTodaysLeads] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [activeProjects, setActiveProjects] = useState([]);
  const [setStageLeads, setSetStageLeads] = useState([]);

  // Pagination States for Today's Follow-up
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  // Pagination States for Leads Requiring Attention
  const [currentPageAttention, setCurrentPageAttention] = useState(1);
  const itemsPerPageAttention = 10;
  

  const getAllLeads = async () => {
    const { data } = await axios.get(backendUrl + '/lead/get/', {
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

      // Filter leads with "set-stage"
    const stageLeads = data.leads.filter(lead => lead.stage === "set-stage");
    setSetStageLeads(stageLeads);
    } else {
      toast.error(data.message);
    }
  };

  const getActiveProjects = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/project/get-with-leadcount", {
        headers: { token },
      });
  
      if (data.success) {
        setActiveProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching active projects:", error);
    }
  };
    // Calculate lead count for each stage
    const leadCounts = leads.reduce((acc, lead)=>{
      acc[lead.stage] = (acc[lead.stage] || 0) + 1;
      return acc;
    },{})

  useEffect(()=>{
    getAllLeads();
    getActiveProjects();
  },[])

  // Pagination Logic for Today's Follow-up
  const indexOfLastToday = currentPage * leadsPerPage;
  const indexOfFirstToday = indexOfLastToday - leadsPerPage;
  const currentTodaysLeads = todaysLeads.slice(indexOfFirstToday, indexOfLastToday);
  const totalPagesToday = Math.ceil(todaysLeads.length / leadsPerPage);

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

  // Pagination Logic for Leads Requiring Attention
  const indexOfLastAttention = currentPageAttention * itemsPerPageAttention;
  const indexOfFirstAttention = indexOfLastAttention - itemsPerPageAttention;
  const currentAttentionLeads = setStageLeads.slice(indexOfFirstAttention, indexOfLastAttention);
  const totalPagesAttention = Math.ceil(setStageLeads.length / itemsPerPageAttention);

  const nextPageAtt = () => {
    if (currentPageAttention < Math.ceil(setStageLeads.length / itemsPerPageAttention)) {
      setCurrentPageAttention(currentPageAttention + 1);
    }
  };

  const prevPageAtt = () => {
    if (currentPageAttention > 1) {
      setCurrentPageAttention(currentPageAttention - 1);
    }
  };

  const stageCategories = ["RNR", "follow-up", "site-visit", "site-visit-done", "revisit", "booking"];

  return (
    <div className='pb-5'>
      <AdminSidebar show={show} handleClose={handleClose}/>
      <Navbar handleShow={handleShow}/>
      
      <div className='container py-4'>
        {/* Top Page Header */}
        <div className="page-header">
          <div>
            <h2>Welcome back, {uName}!</h2>
            <p>Admin Overview & Real-Time Performance Analytics</p>
          </div>
          <div className="d-flex gap-2">
            <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
              <i className="fa-solid fa-users me-1"></i> Total Leads: {leads.length}
            </span>
          </div>
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
        <div className="row g-4 mb-4">
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
                      <th>Contact Number</th>
                      <th>Project</th>
                      <th>Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length > 0 ? (
                      leads.slice(-5).reverse().map((lead, index) => (
                        <tr key={lead._id || index}>
                          <td className="fw-semibold text-muted">{index + 1}</td>
                          <td className="fw-bold text-dark">{lead.name}</td>
                          <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {lead.phone}</td>
                          <td><span className="badge bg-light text-dark border">{lead.project?.name || "N/A"}</span></td>
                          <td><span className="badge-stage">{lead.stage}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">No leads found in the system.</td>
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
                      <th>Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTodaysLeads.length > 0 ? (
                      currentTodaysLeads.map((lead) => (
                        <tr key={lead._id}>
                          <td className="fw-bold text-dark">{lead.name}</td>
                          <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {lead.phone}</td>
                          <td><span className="badge bg-light text-dark border">{lead.project?.name || "N/A"}</span></td>
                          <td className="small text-muted">
                            {lead.assignedAgent && lead.assignedAgent.length > 0
                              ? lead.assignedAgent.map((agent) => agent.name).join(", ")
                              : "Unassigned"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          <i className="fa-solid fa-circle-check text-success me-1"></i> No follow-ups scheduled for today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Today's Follow-up */}
              {todaysLeads.length > 0 && (
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    <i className="fa-solid fa-chevron-left me-1"></i> Prev
                  </button>
                  <span>Page {currentPage} of {totalPagesToday}</span>
                  <button onClick={nextPage} disabled={currentPage === totalPagesToday}>
                    Next <i className="fa-solid fa-chevron-right ms-1"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Projects & Leads Section */}
        <div className="dashboard-box mb-4">
          <div className="dashboard-title">
            <h3><i className="fa-solid fa-building text-primary me-2"></i> Active Projects & Lead Allocation</h3>
            <span className="badge bg-light text-dark border">{activeProjects.length} Active</span>
          </div>

          <div className="activeProjectContainer">
            {activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <div className="projectBox" key={project._id}>
                  <div>
                    <h5>{project.name}</h5>
                    <span className="small text-muted"><i className="fa-solid fa-location-dot me-1"></i> {project.location}</span>
                  </div>
                  <div className="project-count">{project.leadCount} Leads</div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-3 text-muted">No active projects found.</div>
            )}
          </div>
        </div>

        {/* Leads Requiring Attention */}
        <div className="dashboard-box">
          <div className="dashboard-title">
            <h3><i className="fa-solid fa-triangle-exclamation text-warning me-2"></i> Leads Requiring Attention (Set Stage)</h3>
            <span className="badge bg-warning text-dark border">{setStageLeads.length} Pending</span>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Lead Name</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Project</th>
                  <th>Assigned Agent</th>
                </tr>
              </thead>
              <tbody>
                {currentAttentionLeads.length > 0 ? (
                  currentAttentionLeads.map((lead, index) => (
                    <tr key={lead._id}>
                      <td className="fw-semibold text-muted">{index + 1 + (currentPageAttention - 1) * itemsPerPageAttention}</td>
                      <td className="fw-bold text-dark">{lead.name}</td>
                      <td><i className="fa-solid fa-phone text-muted me-1 small"></i> {lead.phone}</td>
                      <td>{lead.email || "Not Provided"}</td>
                      <td><span className="badge bg-light text-dark border">{lead.project?.name || "N/A"}</span></td>
                      <td className="small text-muted">
                        {lead.assignedAgent && lead.assignedAgent.length > 0
                          ? lead.assignedAgent.map((agent) => agent.name).join(", ")
                          : "Unassigned"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      <i className="fa-solid fa-circle-check text-success me-1"></i> All leads have assigned stages!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Leads Requiring Attention */}
          {currentAttentionLeads.length > 0 && (
            <div className="pagination-controls">
              <button onClick={prevPageAtt} disabled={currentPageAttention === 1}>
                <i className="fa-solid fa-chevron-left me-1"></i> Prev
              </button>
              <span>Page {currentPageAttention} of {totalPagesAttention}</span>
              <button onClick={nextPageAtt} disabled={currentPageAttention === totalPagesAttention}>
                Next <i className="fa-solid fa-chevron-right ms-1"></i>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
