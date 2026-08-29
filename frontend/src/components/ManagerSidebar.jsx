import React, { useContext } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const ManagerSidebar = ({show, handleClose}) => {
  const navigate = useNavigate()
  const {uName, setToken} = useContext(AppContext)
  const logout = () =>{
    navigate('/')
    setToken('');
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('role')
    localStorage.removeItem('id')

  }
  return (
    <div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Hi {uName}!</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            } to='/manager/dashboard'>
            <li className='py-1'>Dashboard</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            } to='/manager/projects'>
            <li className='py-1'>Manage Projects</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            } to='/manager/get-agents/'>
            <li className='py-1'>Manage Agents</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            } to='/manager/import/leads'>
            <li className='py-1'>Import Leads</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            } to='/manager/cp-enquiries'>
            <li className='py-1'>CP Enquiries</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink className='text-dark'>
        <li onClick={logout} className='py-1 cursor-pointer'>Logout</li>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default ManagerSidebar
