import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getRole } from "../services/auth"; 
// getRole() should read role from token/localStorage
import { isAdmin } from "../services/auth";


const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin()) {
        navigate("/admin/dashboard");
    } else {
        navigate("/user/dashboard");
    }
}, [navigate]);


  return null; // nothing shown, only redirects
};

export default Dashboard;
