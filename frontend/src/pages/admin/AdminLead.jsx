import React, { useContext, useEffect, useState } from 'react'

import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

import ManageLead from '../projects/ManageLead';

const AdminLead = () => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
    <AdminSidebar show={show} handleClose={handleClose} />
    <Navbar handleShow={handleShow} />

    <ManageLead/>
    </div>
  )
}

export default AdminLead
