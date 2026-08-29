import React, { useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar';
import Navbar from '../../components/Navbar';
import GetAgents from '../../components/GetAgents';

const AdminAgents = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <div className="pb-5">
      <AdminSidebar show={show} handleClose={handleClose}/>
      <Navbar handleShow={handleShow}/>
      <GetAgents/>
    </div>
  );
}

export default AdminAgents


