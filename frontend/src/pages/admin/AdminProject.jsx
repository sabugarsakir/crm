import React, { useContext, useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import GetProjects from '../projects/GetProjects';


const AdminProject = () => {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <div>
            <AdminSidebar show={show} handleClose={handleClose} />
            <Navbar handleShow={handleShow} />

            <GetProjects/>
        </div>
    );
}

export default AdminProject;
