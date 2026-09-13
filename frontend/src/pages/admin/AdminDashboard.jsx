import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import AdminSidebar from '../../components/AdminSidebar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell, PieChart, Pie } from 'recharts';

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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [chartsReady, setChartsReady] = useState(false);
  

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

  const stageCategories = ["RNR", "follow-up", "site-visit", "site-visit-done", "revisit", "booking"];

  // Stage colors and chart dataset
  const stageColors = {
    "RNR": "#94A3B8",
    "follow-up": "#3B82F6",
    "site-visit": "#F59E0B",
    "site-visit-done": "#10B981",
    "revisit": "#8B5CF6",
    "booking": "#059669"
  };

  const stageChartData = stageCategories.map(stage => ({
    name: stage.replace("-", " "),
    count: leadCounts[stage] || 0,
    color: stageColors[stage] || "#3B82F6"
  }));

  // Ingestion data by selected month
  const filteredMonthLeads = leads.filter(lead => {
    if (!lead.createdAt) return false;
    const leadDate = new Date(lead.createdAt);
    return leadDate.getMonth() + 1 === selectedMonth;
  });

  const groupedLeads = filteredMonthLeads.reduce((acc, lead) => {
    const date = lead.createdAt.split("T")[0];
    const source = lead.source || "Other";
    if (!acc[date]) {
      acc[date] = { date, Meta: 0, Google: 0, Other: 0 };
    }
    acc[date][source] = (acc[date][source] || 0) + 1;
    return acc;
  }, {});

  const ingestionChartData = Object.values(groupedLeads).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Channel Acquisition Share (Pie Chart)
  const sourceCounts = leads.reduce((acc, lead) => {
    const src = lead.source || "Other";
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const channelPieData = [
    { name: "Meta Ads", value: sourceCounts["Meta"] || 0, color: "#2563EB" },
    { name: "Google Ads", value: sourceCounts["Google"] || 0, color: "#EF4444" },
    { name: "Organic / Other", value: sourceCounts["Other"] || 0, color: "#10B981" },
  ].filter(item => item.value > 0);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        await Promise.all([getAllLeads(), getActiveProjects()]);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (isMounted) {
          // Allow DOM, layout and scrollbars to settle before triggering chart entrance animations
          setTimeout(() => {
            if (isMounted) setChartsReady(true);
          }, 80);
        }
      }
    };
    loadDashboard();
    return () => { isMounted = false; };
  }, []);

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

        {/* Admin Business Intelligence & Analytics Section */}
        <div className="row g-4 mb-4">
          {/* Monthly Lead Ingestion Trend */}
          <div className="col-12 col-xl-7">
            <div className="dashboard-box h-100 mb-0">
              <div className="dashboard-title">
                <div>
                  <h3 className="m-0"><i className="fa-solid fa-chart-area text-primary me-2"></i> Lead Ingestion Trends by Channel</h3>
                  <span className="small text-muted">Daily volume breakdown across Meta, Google & Direct channels</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small fw-semibold text-muted">Month:</span>
                  <select 
                    className="form-select form-select-sm filterInput" 
                    style={{ width: '150px', height: '36px' }}
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

              <div className="chart-container pt-3" style={{ minHeight: '280px' }}>
                {!chartsReady ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 280 }}>
                    <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                    <span className="text-muted small">Loading ingestion trends...</span>
                  </div>
                ) : ingestionChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280} debounce={50}>
                    <AreaChart key={`admin-area-${selectedMonth}`} data={ingestionChartData} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#94A3B8" 
                        fontSize={12} 
                        tickFormatter={(val) => {
                          try {
                            const parts = val.split('-');
                            if (parts.length === 3) {
                              const d = new Date(parts[0], parts[1] - 1, parts[2]);
                              return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                            }
                            return val;
                          } catch {
                            return val;
                          }
                        }}
                      />
                      <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                        labelFormatter={(val) => `Date: ${val}`}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="Meta" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorMeta)" name="Meta Ads" isAnimationActive={true} animationDuration={900} animationEasing="ease-out" animationBegin={0} />
                      <Area type="monotone" dataKey="Google" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorGoogle)" name="Google Ads" isAnimationActive={true} animationDuration={900} animationEasing="ease-out" animationBegin={50} />
                      <Area type="monotone" dataKey="Other" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorOther)" name="Other / Referrals" isAnimationActive={true} animationDuration={900} animationEasing="ease-out" animationBegin={100} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="fa-solid fa-chart-area fa-2x mb-2 text-secondary opacity-50"></i>
                    <p className="mb-0">No lead ingestion data for this month.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lead Channel Share (Pie / Donut Chart) */}
          <div className="col-12 col-xl-5">
            <div className="dashboard-box h-100 mb-0">
              <div className="dashboard-title">
                <div>
                  <h3 className="m-0"><i className="fa-solid fa-pie-chart text-primary me-2"></i> Acquisition Sources</h3>
                  <span className="small text-muted">Overall marketing channel contribution</span>
                </div>
                <span className="badge bg-primary rounded-pill">{leads.length} Total</span>
              </div>

              <div className="chart-container pt-2" style={{ minHeight: '230px' }}>
                {!chartsReady ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 230 }}>
                    <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                    <span className="text-muted small">Loading acquisition share...</span>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={230} debounce={50}>
                      <PieChart key="admin-pie">
                        <Pie
                          data={channelPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                          animationBegin={0}
                        >
                          {channelPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                          formatter={(val, name) => [`${val} Leads (${((val / (leads.length || 1)) * 100).toFixed(1)}%)`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Custom Legend Badges */}
                    <div className="d-flex justify-content-center gap-3 pt-2">
                      {channelPieData.map((item) => (
                        <div key={item.name} className="d-flex align-items-center gap-1 small">
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
                          <span className="text-muted">{item.name}:</span>
                          <strong className="text-dark">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Conversion Bar Chart */}
        <div className="dashboard-box mb-4">
          <div className="dashboard-title">
            <div>
              <h3 className="m-0"><i className="fa-solid fa-filter text-primary me-2"></i> Pipeline Conversion Funnel</h3>
              <span className="small text-muted">Stage-wise distribution of all CRM opportunities from initial contact to booking</span>
            </div>
            <span className="badge bg-light text-dark border">
              <i className="fa-solid fa-circle-check text-success me-1"></i> {leadCounts["booking"] || 0} Bookings Closed
            </span>
          </div>

          <div className="chart-container pt-3" style={{ minHeight: '260px' }}>
            {!chartsReady ? (
              <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 260 }}>
                <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                <span className="text-muted small">Loading conversion funnel...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260} debounce={50}>
                <BarChart key="admin-bar" data={stageChartData} margin={{ top: 15, right: 20, left: -15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                    formatter={(value) => [`${value} Leads`, 'Volume']}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={900}
                    animationEasing="ease-out"
                    animationBegin={0}
                  >
                    {stageChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
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
