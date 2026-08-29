import { useContext } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function AdminSidebar({ show, handleClose }) {
  const { uName, role, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '42px', height: '42px', fontSize: '18px' }}>
            {uName ? uName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <Offcanvas.Title className="m-0 fs-6">{uName}</Offcanvas.Title>
            <span className="badge bg-primary text-white" style={{ fontSize: '11px' }}>{role}</span>
          </div>
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column justify-content-between">
        <div>
          {/* Admin-Only Menu Options */}
          {role === 'Admin' && (
            <>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/admin/dashboard' onClick={handleClose}>
                <li><i className="fa-solid fa-chart-pie me-2 text-primary"></i> Dashboard</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/admin/projects' onClick={handleClose}>
                <li><i className="fa-solid fa-building me-2 text-primary"></i> Manage Projects</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/admin/get-agents/' onClick={handleClose}>
                <li><i className="fa-solid fa-users me-2 text-primary"></i> Manage Agents</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/admin/import/leads' onClick={handleClose}>
                <li><i className="fa-solid fa-file-arrow-up me-2 text-primary"></i> Import Leads</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/admin/cp-enquiries' onClick={handleClose}>
                <li><i className="fa-solid fa-handshake me-2 text-primary"></i> CP Enquiries</li>
              </NavLink>
            </>
          )}

          {/* Manager-Only Menu Options */}
          {role === 'Manager' && (
            <>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/manager/dashboard' onClick={handleClose}>
                <li><i className="fa-solid fa-chart-line me-2 text-primary"></i> Dashboard</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/manager/projects' onClick={handleClose}>
                <li><i className="fa-solid fa-city me-2 text-primary"></i> Manage Projects</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/manager/get-agents/' onClick={handleClose}>
                <li><i className="fa-solid fa-users-gear me-2 text-primary"></i> Manage Agents</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/manager/import/leads' onClick={handleClose}>
                <li><i className="fa-solid fa-file-import me-2 text-primary"></i> Import Leads</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/manager/cp-enquiries' onClick={handleClose}>
                <li><i className="fa-solid fa-user-check me-2 text-primary"></i> CP Enquiries</li>
              </NavLink>
            </>
          )}

          {/* Agent-Only Menu Options */}
          {role === 'Agent' && (
            <>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/agent/dashboard' onClick={handleClose}>
                <li><i className="fa-solid fa-gauge-high me-2 text-primary"></i> Dashboard</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/agent/followup-leads' onClick={handleClose}>
                <li><i className="fa-solid fa-clock-rotate-left me-2 text-primary"></i> Follow-up Leads</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/agent/projects' onClick={handleClose}>
                <li><i className="fa-solid fa-diagram-project me-2 text-primary"></i> Assigned Projects</li>
              </NavLink>
            </>
          )}

          {/* CP-Only Menu Options */}
          {role === 'Channel Partner' && (
            <>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/agent/dashboard' onClick={handleClose}>
                <li><i className="fa-solid fa-chart-simple me-2 text-primary"></i> Partner Dashboard</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/agent/followup-leads' onClick={handleClose}>
                <li><i className="fa-solid fa-phone-volume me-2 text-primary"></i> Follow-up Leads</li>
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'activeMenu' : 'text-dark')} to='/agent/projects' onClick={handleClose}>
                <li><i className="fa-solid fa-briefcase me-2 text-primary"></i> Mandate Projects</li>
              </NavLink>
            </>
          )}
        </div>

        {/* Common Logout Option */}
        <div className="pt-3 border-top border-secondary">
          <NavLink className='text-danger' onClick={logout}>
            <li className='py-2 fw-semibold'><i className="fa-solid fa-right-from-bracket me-2 text-danger"></i> Logout</li>
          </NavLink>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
