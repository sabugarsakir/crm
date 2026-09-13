import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import Swal from 'sweetalert2';
import notify from '../utils/notify';

const GetAgents = () => {
  const { backendUrl, token, role, uId } = useContext(AppContext);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/user/get/agents`);

      if (data.success) {
        setAgents(data.agents || []);
      } else {
        notify.error("Error", data.message || "Failed to load agents.");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      notify.error("Error", "Could not connect to server to fetch agents.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (agent) => {
    if (role !== 'Admin') {
      notify.error("Unauthorized", "Only administrators have permission to remove users.");
      return;
    }

    if (String(uId) === String(agent._id)) {
      notify.warning("Action Not Allowed", "You cannot delete your own active administrator account.");
      return;
    }

    Swal.fire({
      title: "Remove User?",
      html: `Are you sure you want to permanently remove <strong>${agent.name}</strong> (${agent.role || 'Agent'}) from the system?<br/><span style="font-size:12.5px;color:#94a3b8;">This will revoke login credentials and unassign them from active projects & leads.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: '<i class="fa-solid fa-trash me-1"></i> Yes, Remove User',
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#0F172A",
      color: "#F8FAFC",
      customClass: {
        popup: 'rounded-4 border border-secondary shadow-lg'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeletingId(agent._id);
          const { data } = await axios.delete(`${backendUrl}/user/delete/${agent._id}`, {
            headers: { token }
          });

          if (data.success) {
            notify.success("User Removed", `"${agent.name}" has been permanently removed from the system.`);
            // Instant local state update - zero page reload needed!
            setAgents(prev => prev.filter(a => a._id !== agent._id));
          } else {
            notify.error("Delete Failed", data.message || "Failed to remove user.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          notify.error("Error", error.response?.data?.message || "Failed to delete user.");
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="pb-5">
      <div className="container py-4">
        {/* Top Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button 
            onClick={() => navigate(`${role === 'Admin' ? '/admin' : '/manager'}/dashboard`)} 
            className="back-btn m-0"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </button>
          <div className="d-flex align-items-center gap-2">
            <button 
              onClick={fetchAgents} 
              className="btn btn-outline-secondary rounded-pill px-3 py-2 btn-sm d-flex align-items-center gap-2"
              title="Refresh without page reload"
              disabled={loading}
            >
              <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i> Refresh
            </button>
            <button 
              onClick={() => navigate('/agent/create')} 
              className="btn-primary"
            >
              <i className="fa-solid fa-user-plus"></i> Add Team Member
            </button>
          </div>
        </div>

        <div className="page-header">
          <div>
            <h2>Team & Agent Directory</h2>
            <p>Manage operational sales agents, managers, and authorized partner representatives.</p>
          </div>
          <span className="badge bg-primary px-3 py-2 rounded-pill">
            <i className="fa-solid fa-users me-1"></i> {agents.length} Members
          </span>
        </div>

        {loading && agents.length === 0 ? (
          <div className="text-center py-5">
            <i className="fa-solid fa-circle-notch fa-spin text-primary fs-2 mb-3"></i>
            <p className="text-muted">Loading team members...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-4 border border-dashed">
            <i className="fa-solid fa-users-slash text-muted fs-1 mb-3"></i>
            <h5 className="fw-bold">No Team Members Found</h5>
            <p className="text-muted small">Click "Add Team Member" above to create your first agent or manager.</p>
          </div>
        ) : (
          <div className="row g-3">
            {agents.map((agent, index) => (
              <div className="col-12 col-lg-6" key={agent._id || index}>
                <div className="agent-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="agent-profile flex-shrink-0">
                      <img src={assets.agent_profile} alt={agent.name} />
                    </div>
                    <div className="agent-desc">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h4 className="m-0 fs-6 fw-bold">{agent.name}</h4>
                        <span className="badge bg-primary text-white rounded-pill" style={{ fontSize: '11px' }}>
                          {agent.role || (agent.isCP ? 'Channel Partner' : 'Agent')}
                        </span>
                      </div>
                      <h6><i className="fa-solid fa-envelope text-muted me-1"></i> {agent.email}</h6>
                      <h6><i className="fa-solid fa-phone text-muted me-1"></i> {agent.number || 'Not Set'}</h6>
                      <p><i className="fa-solid fa-location-dot text-primary me-1"></i> {agent.location || 'Headquarters'}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => navigate(`/agent/edit/${agent._id}`)} 
                      className="btn-action-edit"
                      title="Edit agent details"
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    {/* Delete button: strictly restricted to Admin only */}
                    {role === 'Admin' && (
                      <button 
                        onClick={() => handleDeleteUser(agent)} 
                        className="btn-action-delete"
                        disabled={deletingId === agent._id || String(uId) === String(agent._id)}
                        title={String(uId) === String(agent._id) ? "You cannot delete your own account" : "Remove user from system"}
                      >
                        {deletingId === agent._id ? (
                          <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                        ) : (
                          <><i className="fa-solid fa-trash"></i> Delete</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAgents;
