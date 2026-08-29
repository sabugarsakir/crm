import React, { useContext, useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import ComNavbar from '../../components/Navbar'
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ImportLead = () => {
    const { backendUrl, token, role } = useContext(AppContext);

    const [selectedProject, setSelectedProject] = useState("");
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [agents, setAgents] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();


    // Fetch projects
    const getProjects = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/project/get`, { headers: { token } });
            if (data.success) setProjects(data.projects);
            else toast.error(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch available agents
    const fetchAgents = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/user/get/agents`);
            if (data.success) setAgents(data.agents);
            else toast.error(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };
    
      const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
          toast.error("Please select a CSV file!");
          return;
        }
        if (!selectedProject) {
          toast.error("Please select a project!");
          return;
        }
        if (selectedAgents.length==0) {
          toast.error("Please select an agent!");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("selectedProject", selectedProject);
        formData.append("selectedAgents", JSON.stringify(selectedAgents))
        try {
          const response = await axios.post(`${backendUrl}/lead/upload-csv`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if(response.data.success){
            setFile(null);
            setSelectedAgents([])
            setSelectedProject("")
            toast.success("Leads Uploaded Successfully!")
          }
          else{
            toast.error(response.data.message)
          }
    

        } catch (error) {
          console.error(error);
          alert("Error uploading file");
        }
      };
      useEffect(() => {
        getProjects();
        fetchAgents();
    }, []);
  return (
    <div>
    <AdminSidebar show={show} handleClose={handleClose} />
    <ComNavbar handleShow={handleShow} />
    <div className='container'>
        <p onClick={()=>navigate(`${role=='Admin' ? '/admin': '/manager' }/dashboard`)} className='back-btn'><i className="fa-solid fa-arrow-left"></i> Back</p>
        <h2>Import Leads</h2>

            <form onSubmit={handleUpload} className='customForm'>
                <div className="mb-3">
                <input type="file" accept=".csv" onChange={handleFileChange} />
                </div>
                <div className="mb-3">
                            <Form.Label>Project</Form.Label>
                            <Form.Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Form.Select>
                </div>

                        <div className="mb-3">
                            <Form.Label>Assign Agents</Form.Label>
                            <div>
                                {agents.map(agent => (
                                    <Form.Check 
                                        key={agent._id}
                                        type="checkbox"
                                        label={`${agent.name} (${agent.email})`}
                                        value={agent._id}
                                        checked={selectedAgents.includes(agent._id)}
                                        onChange={(e) => {
                                            const agentId = e.target.value;
                                            setSelectedAgents(prev => 
                                                prev.includes(agentId) 
                                                    ? prev.filter(id => id !== agentId) // Remove if already selected
                                                    : [...prev, agentId] // Add if not selected
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </div>            


                <button type='submit' className="btn-primary">
                    Upload CSV
                </button>
            </form>
    </div>
    </div>
  )
}

export default ImportLead
