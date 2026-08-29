import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';

const RedirectToDashboard = () => {
  const { token, role } = useContext(AppContext);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role) {
      if (role === 'Agent' || role === 'Channel Partner') {
        setUrl('/agent/dashboard');
      } else if (role === 'Manager') {
        setUrl('/manager/dashboard');
      } else if (role === 'Admin') {
        setUrl('/admin/dashboard');
      }
    }
  }, [token, role]);

  const handleRedirect = () => {
    if (url) {
      navigate(url);
    }
  };

  if (!token) return <p>Please login first.</p>;

  return (
    <div className="text-center mt-5">
      <h6>You are already logged in</h6>
      <h3>Redirect to your dashboard</h3>
      <button className="btn btn-primary mt-3" onClick={handleRedirect} disabled={!url}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default RedirectToDashboard;
