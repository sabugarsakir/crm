import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from 'recharts';

const AgentDashboard = () => {
  const [show, setShow] = useState(false);
  const {backendUrl, uName, token} = useContext(AppContext)
  const [leads, setLeads] = useState([]);
  const [todaysLeads, setTodaysLeads] = useState([]);
  const [chartsReady, setChartsReady] = useState(false);
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

  const stageColors = {
    "RNR": "#94A3B8",
    "follow-up": "#3B82F6",
    "site-visit": "#F59E0B",
    "site-visit-done": "#10B981",
    "revisit": "#8B5CF6",
    "booking": "#059669"
  };

  const agentStageChartData = stageCategories.map(stage => ({
    name: stage.replace("-", " "),
    count: leadCounts[stage] || 0,
    color: stageColors[stage] || "#3B82F6"
  }));

  const statusCounts = leads.reduce((acc, lead) => {
    const st = lead.status || "warm";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const agentStatusData = [
    { name: "Hot", value: statusCounts["hot"] || 0, color: "#EF4444" },
    { name: "Warm", value: statusCounts["warm"] || 0, color: "#F59E0B" },
    { name: "Cold", value: statusCounts["cold"] || 0, color: "#64748B" },
  ].filter(item => item.value > 0);

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


  useEffect(() => {
    let isMounted = true;
    const loadAgentData = async () => {
      try {
        await getAllLeads();
      } catch (err) {
        console.error("Agent data load error:", err);
      } finally {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) setChartsReady(true);
          }, 80);
        }
      }
    };
    loadAgentData();
    return () => { isMounted = false; };
  }, []);

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

        {/* Agent Pipeline Visual Analytics */}
        <div className="row g-4 mb-4">
          {/* Personal Stage Progression */}
          <div className="col-12 col-xl-8">
            <div className="dashboard-box h-100 mb-0">
              <div className="dashboard-title">
                <div>
                  <h3 className="m-0"><i className="fa-solid fa-chart-simple text-primary me-2"></i> My Pipeline Stage Breakdown</h3>
                  <span className="small text-muted">Distribution of your active assigned opportunities</span>
                </div>
                <span className="badge bg-light text-dark border">
                  {leads.length} Leads in Queue
                </span>
              </div>

              <div className="chart-container pt-3" style={{ minHeight: '240px' }}>
                {!chartsReady ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 240 }}>
                    <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                    <span className="text-muted small">Loading pipeline stages...</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240} debounce={50}>
                    <BarChart key="agent-bar" data={agentStageChartData} margin={{ top: 10, right: 15, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748B" 
                        fontSize={11} 
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
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
                        {agentStageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Lead Warmth / Quality Priority */}
          <div className="col-12 col-xl-4">
            <div className="dashboard-box h-100 mb-0">
              <div className="dashboard-title">
                <div>
                  <h3 className="m-0"><i className="fa-solid fa-fire text-danger me-2"></i> Lead Warmth</h3>
                  <span className="small text-muted">Priority categorization</span>
                </div>
                <span className="badge bg-danger rounded-pill">
                  {statusCounts["hot"] || 0} Hot
                </span>
              </div>

              <div className="chart-container pt-2" style={{ minHeight: '190px' }}>
                {!chartsReady ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 190 }}>
                    <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                    <span className="text-muted small">Loading lead warmth...</span>
                  </div>
                ) : agentStatusData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={190} debounce={50}>
                      <PieChart key="agent-pie">
                        <Pie
                          data={agentStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                          animationBegin={0}
                        >
                          {agentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                          formatter={(val, name) => [`${val} Leads`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="d-flex justify-content-center gap-3 pt-1">
                      {agentStatusData.map((item) => (
                        <div key={item.name} className="d-flex align-items-center gap-1 small">
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
                          <span className="text-muted">{item.name}:</span>
                          <strong className="text-dark">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="fa-solid fa-fire fa-2x mb-2 text-secondary opacity-50"></i>
                    <p className="mb-0">No lead warmth data available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
