import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaBars } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Sidebar({ show, handleClose }) {
  const {uName, setToken} = useContext(AppContext)

  const logout = () =>{
    navigate('/')
    setToken('');
    localStorage.removeItem('token')
  }
  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Hi {uName}!</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          <NavLink
            to='/agent/dashboard'
            className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            }
          >
            <li className='py-1'>Dashboard</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

          </NavLink>

          <NavLink
            to='/agent/projects'
            className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            }
          >
            <li className='py-1'>Projects</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

          </NavLink>

          <NavLink
            to='/agent/followup-leads'
            className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark'
            }
          >
            <li className='py-1'>Follow Up Leads</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive ? 'activeMenu' : 'text-dark logoutBtn'
            }
          >
            <li onClick={logout} className='py-1'>Logout</li>
          </NavLink>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
