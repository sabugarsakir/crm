import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { assets } from './assets/assets';

const RedirectToDashboard = () => {
  const { token, role, uName } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      let targetUrl = '/agent/dashboard';
      if (role === 'Admin') {
        targetUrl = '/admin/dashboard';
      } else if (role === 'Manager') {
        targetUrl = '/manager/dashboard';
      } else if (role === 'Agent' || role === 'Channel Partner') {
        targetUrl = '/agent/dashboard';
      }
      navigate(targetUrl, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [token, role, navigate]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card border-0 shadow-sm p-4 text-center rounded-4" style={{ maxWidth: '400px', width: '100%', background: '#ffffff' }}>
        <div className="mb-3">
          <img height={50} src={assets.fcp_logo} alt="Logo" style={{ objectFit: 'contain' }} />
        </div>
        <div className="spinner-border text-primary mx-auto my-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="fw-bold text-dark mb-1">Redirecting to Dashboard</h5>
        <p className="text-muted small mb-0">
          Welcome back{uName ? `, ${uName}` : ''}! Taking you to your workspace...
        </p>
      </div>
    </div>
  );
};

export default RedirectToDashboard;
