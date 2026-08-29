import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/fontawesome/css/all.min.css'
import Login from './pages/Login'
import RegisterCP from './pages/RegisterCP'
import AgentDashboard from './pages/agent/AgentDashboard'
import AgentProjects from './pages/agent/AgentProjects';
import AgentLead from './pages/agent/AgentLead';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProject from './pages/admin/AdminProject';
import CreateProject from './pages/projects/CreateProject';
import AdminLead from './pages/admin/AdminLead';
import EditProject from './pages/projects/EditProject';
import { ToastContainer } from 'react-toastify';
import AdminAgents from './pages/admin/AdminAgents';
import EditAgent from './components/EditAgent';
import CreateAgent from './components/CreateAgent';
import ManagerLead from './pages/manager/ManagerLead';
import ManagerProject from './pages/manager/ManagerProject';
import ManageLead from './pages/projects/ManageLead';
import GetProjects from './pages/projects/GetProjects';
import ImportLead from './pages/leads/ImportLead';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import AgentFollowupLeads from './pages/agent/AgentFollowupLeads';
import EnquiriesofCP from './pages/manager/EnquiriesofCP';
import RedirectToDashboard from './RedirectToDashboard';


function App() {
const {token} = useContext(AppContext)

  return token ? (
    <div>
      <ToastContainer/>
    <Routes>
      <Route path="/login" element={<Navigate to="/redirect-me" replace />} />
      <Route path="/register-cp" element={<Navigate to="/redirect-me" replace />} />
      <Route path='/redirect-me' element={<RedirectToDashboard/>}/>

      {/* Admin routes */}
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/admin/projects' element={<GetProjects/>}/>
      <Route path='/admin/get-agents/' element={<AdminAgents/>}/>
      <Route path='/admin/import/leads' element={<ImportLead/>}/>
      <Route path='/admin/cp-enquiries' element={<EnquiriesofCP/>}/>

      {/* common routes */}
      <Route path='/manage/lead/:projectId' element={<ManageLead/>}/>
      <Route path='/agent/create/' element={<CreateAgent/>}/>
      <Route path='/agent/edit/:agentId' element={<EditAgent/>}/>
      <Route path='/manage/project/create' element={<CreateProject/>}/>
      <Route path='/manage/project/edit/:projectId' element={<EditProject/>}/>
      <Route path='/agent/lead/:projectId' element={<ManageLead/>}/>

      {/* Agent routes */}
      <Route path='/agent/dashboard' element={<AgentDashboard/>}/>
      <Route path='/agent/projects' element={<AgentProjects/>}/>
      <Route path='/agent/followup-leads' element={<AgentFollowupLeads/>}/>

      {/* manager routes */}
      <Route path='/manager/dashboard' element={<ManagerDashboard/>}/>
      <Route path='/manager/projects' element={<GetProjects/>}/>
      <Route path='/manager/get-agents/' element={<AdminAgents/>}/>
      <Route path='/manager/import/leads' element={<ImportLead/>}/>
      <Route path='/manager/cp-enquiries' element={<EnquiriesofCP/>}/>

      <Route path='*' element={<Navigate to="/redirect-me" replace />} />
    </Routes>
    </div>
  ) : (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-cp" element={<RegisterCP />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
