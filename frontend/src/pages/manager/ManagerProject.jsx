import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

import ManagerSidebar from '../../components/ManagerSidebar';

const ManagerProject = () => {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);




    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <div>
            <ManagerSidebar show={show} handleClose={handleClose} />
            <Navbar handleShow={handleShow} />

            <getProjects/>
        </div>
    );
}

export default ManagerProject;
