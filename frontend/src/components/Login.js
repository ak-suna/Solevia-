// // import React, { useState } from "react";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await fetch("/api/auth/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password }),
// //       });
// //       const data = await res.json();
// //       if (res.ok) {
// //         localStorage.setItem("token", data.token); // store JWT
// //         alert("Login successful!");
// //       } else {
// //         alert(data.message);
// //       }
// //     } catch (err) {
// //       alert("Error logging in");
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h1>Login</h1>
// //       <form onSubmit={handleLogin} style={styles.form}>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //           style={styles.input}
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //           style={styles.input}
// //         />
// //         <button type="submit" style={styles.button}>Login</button>
// //       </form>
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" },
// //   form: { display: "flex", flexDirection: "column", width: "300px" },
// //   input: { marginBottom: "15px", padding: "10px", fontSize: "16px" },
// //   button: { padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
// // };

// // export default Login;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', formData);
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Login failed');
//     }
//   };
//   // Update to handle unverified users:

// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   try {
// //     const res = await axios.post('http://localhost:5000/api/auth/login', formData);
// //     localStorage.setItem('token', res.data.token);
// //     localStorage.setItem('user', JSON.stringify(res.data.user));
// //     navigate('/dashboard');
// //   } catch (err) {
// //     // ✨ CHECK IF USER NEEDS TO VERIFY EMAIL ✨
// //     if (err.response?.data?.needsVerification) {
// //       setError('Please verify your email first');
// //       setTimeout(() => {
// //         navigate('/verify-email', { state: { email: err.response.data.email } });
// //       }, 2000);
// //     } else {
// //       setError(err.response?.data?.msg || 'Login failed');
// //     }
// //   }
// // };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           style={{ width: '100%', padding: '10px', margin: '10px 0' }}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           style={{ width: '100%', padding: '10px', margin: '10px 0' }}
//         />
//         <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
//           Login
//         </button>
//       </form>
//       <p>Don't have an account? <a href="/signup">Sign up</a></p>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <a href="/signup" style={{ color: 'blue', textDecoration: 'none' }}>Sign up</a>
      </p>
    </div>
  );
}

export default Login;