import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const GetAgents = () => {

    const {backendUrl, token, role} = useContext(AppContext)
    const [agents, setAgents] = useState([])
    const navigate = useNavigate();

    const fetchAgents = async () => {
        const {data} = await axios.get(backendUrl+'/user/get/agents');

        if(data.success){
            setAgents(data.agents)
        }
        else{
            toast.error(data.message)
        }
    }

    useEffect(()=>{
        fetchAgents()
    },[])

  return (
    <div className="pb-5">
      <div className="container py-4">
        {/* Top Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button onClick={() => navigate(`${role === 'Admin' ? '/admin' : '/manager'}/dashboard`)} className="back-btn m-0">
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </button>
          <button onClick={() => navigate('/agent/create')} className="btn-primary">
            <i className="fa-solid fa-user-plus"></i> Add Team Member
          </button>
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
                <div className="flex-shrink-0">
                  <button onClick={() => navigate(`/agent/edit/${agent._id}`)} className="btn-action-edit">
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GetAgents
