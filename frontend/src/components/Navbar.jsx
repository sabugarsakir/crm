import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FaBars } from 'react-icons/fa';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const ComNavbar = ({ handleShow }) => {
  const { uName, role } = useContext(AppContext);

  return (
    <Navbar className="custom-navbar">
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div onClick={handleShow} className="bars" title="Open Menu">
            <FaBars size={20} />
          </div>
          <Navbar.Brand href="#home" className="p-0 m-0 d-flex align-items-center">
            <img height={48} src={assets.fcp_logo} alt="Logo" style={{ objectFit: 'contain' }} />
          </Navbar.Brand>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-sm-flex flex-column text-end">
            <span className="fw-bold fs-6 text-dark" style={{ lineHeight: 1.2 }}>{uName}</span>
            <span className="small text-muted" style={{ fontSize: '11px' }}>Portal Access</span>
          </div>
          <span className="role-chip">
            <i className="fa-solid fa-shield-halved me-1"></i> {role}
          </span>
        </div>
      </Container>
    </Navbar>
  );
};

export default ComNavbar;
