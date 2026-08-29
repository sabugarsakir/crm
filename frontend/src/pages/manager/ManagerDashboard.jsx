import React, { useState, useEffect, useContext } from 'react';
import ComNavbar from '../../components/Navbar';
import ManagerSidebar from '../../components/ManagerSidebar';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../components/AdminSidebar';

const ManagerDashboard = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [leads, setLeads] = useState([]);
    const [leadData, setLeadData] = useState([]);
    const [todaysLeads, setTodaysLeads] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);
    const [setStageLeads, setSetStageLeads] = useState([]);

    // Pagination States for Today's Follow-up
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 5;

    // Pagination States for Leads Requiring Attention
    const [currentPageAttention, setCurrentPageAttention] = useState(1);
    const itemsPerPageAttention = 10;

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const stageCategories = ["RNR", "follow-up", "site-visit", "site-visit-done", "revisit", "booking"];

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchLeadsByMonth = async (month) => {
        try {
            const { data } = await axios.get(`${backendUrl}/lead/get/`, {
                headers: { token }
            });

            if (data.success) {

                setLeads(data.leads);
                const filteredLeads = data.leads.filter(lead => {
                    const leadDate = new Date(lead.createdAt);
                    return leadDate.getMonth() + 1 === month;
                });

                // Group leads by day and source
                const groupedLeads = filteredLeads.reduce((acc, lead) => {
                    const date = lead.createdAt.split("T")[0]; // Format: YYYY-MM-DD
                    const source = lead.source || "Unknown";

                    if (!acc[date]) {
                        acc[date] = { date, Meta: 0, Google: 0, Other: 0 };
                    }
                    acc[date][source] = (acc[date][source] || 0) + 1;

                    return acc;
                }, {});

                // Convert object to array for chart
                const chartData = Object.values(groupedLeads).sort((a, b) => new Date(a.date) - new Date(b.date));

                setLeadData(chartData);

                const today = new Date().toISOString().split("T")[0];
                // Filter leads where followUpDate matches today
                const todayFilteredLeads = data.leads.filter(lead => 
                  lead.followUpDate && lead.followUpDate.split("T")[0] === today
                );
          
                setTodaysLeads(todayFilteredLeads);
          
                // Filter leads with "set-stage"
              const stageLeads = data.leads.filter(lead => lead.stage === "set-stage");
              setSetStageLeads(stageLeads);
            }
        } catch (error) {
            console.error("Error fetching lead data:", error);
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

    useEffect(() => {
        fetchLeadsByMonth(selectedMonth);
        getActiveProjects();

    }, [selectedMonth]);


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


    return (
        <div className="pb-5">
            <AdminSidebar show={show} handleClose={handleClose} />
            <ComNavbar handleShow={handleShow} />

            <div className="container py-4">
                {/* Top Page Header */}
                <div className="page-header">
                    <div>
                        <h2>Manager Operations Dashboard</h2>
                        <p>Track team performance, lead ingestion trends, and agent project allocations.</p>
                    </div>
                    <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
                        <i className="fa-solid fa-users me-1"></i> Total Pipeline: {leads.length} Leads
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

                {/* Analytics Chart Card */}
                <div className="dashboard-box mb-4">
                    <div className="dashboard-title">
                        <div>
                            <h3 className="m-0"><i className="fa-solid fa-chart-line text-primary me-2"></i> Lead Ingestion Trends by Source</h3>
                            <span className="small text-muted">Daily volume breakdown from Meta, Google, and Organic channels</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="small fw-semibold text-muted">Month:</span>
                            <select 
                                className="form-select form-select-sm filterInput" 
                                style={{ width: '160px', height: '36px' }}
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="chart-container pt-3">
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={leadData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="Meta" stroke="#2563EB" strokeWidth={2} name="Meta Leads" dot={false} />
                                <Line type="monotone" dataKey="Google" stroke="#EF4444" strokeWidth={2} name="Google Leads" dot={false} />
                                <Line type="monotone" dataKey="Other" stroke="#10B981" strokeWidth={2} name="Other Leads" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
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
                                            <th>Number</th>
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
                                                <td colSpan={5} className="text-center py-4 text-muted">No leads available.</td>
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
                                                <td colSpan={4} className="text-center py-4 text-muted">
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
                                        <span className="small text-muted"><i className="fa-solid fa-location-dot me-1"></i> {project.location || 'Development'}</span>
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
                                    <th>Phone</th>
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
                                            <td>{lead.email || "—"}</td>
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
                                        <td colSpan={6} className="text-center py-4 text-muted">
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
    );
};

export default ManagerDashboard;
