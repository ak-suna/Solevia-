import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h2>Dashboard</h2>
      {user && <p>Welcome back, <strong>{user.name}</strong>! 🎉</p>}
      <p>You are successfully logged in.</p>
      <button 
        onClick={handleLogout} 
        style={{ 
          padding: '10px 20px', 
          background: 'red', 
          color: 'white', 
          border: 'none', 
          cursor: 'pointer',
          borderRadius: '5px',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;