
// import React, { useState } from "react";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         alert("Signup successful!");
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert("Error signing up");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Signup</h1>
//       <form onSubmit={handleSignup} style={styles.form}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>Signup</button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" },
//   form: { display: "flex", flexDirection: "column", width: "300px" },
//   input: { marginBottom: "15px", padding: "10px", fontSize: "16px" },
//   button: { padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
// };

// export default Signup;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Signup() {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
//   //     localStorage.setItem('token', res.data.token);
//   //     localStorage.setItem('user', JSON.stringify(res.data.user));
//   //     navigate('/dashboard');
//   //   } catch (err) {
//   //     setError(err.response?.data?.msg || 'Signup failed');
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
    
//     // Show success message (optional)
//     alert('Signup successful! Please login.');
    
//     // Redirect to login page instead of dashboard
//     navigate('/login');
    
//   } catch (err) {
//     setError(err.response?.data?.msg || 'Signup failed');
//   }
// };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
//       <h2>Sign Up</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           style={{ width: '100%', padding: '10px', margin: '10px 0' }}
//         />
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
//         <button type="submit" style={{ width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
//           Sign Up
//         </button>
//       </form>
//       <p>Already have an account? <a href="/login">Login</a></p>
//     </div>
//   );
// }

// export default Signup;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // ✨ FRONTEND PASSWORD VALIDATION (optional but good UX) ✨
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      
      setSuccess('Account created successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    }
  };
  // Change the success part to redirect to verification:

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setSuccess('');
  
//   if (formData.password !== formData.confirmPassword) {
//     setError('Passwords do not match');
//     return;
//   }

//   if (formData.password.length < 6) {
//     setError('Password must be at least 6 characters');
//     return;
//   }
  
//   try {
//     const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
    
//     setSuccess('Account created! Check your email for verification code.');
    
//     // ✨ REDIRECT TO VERIFICATION PAGE ✨
//     setTimeout(() => {
//       navigate('/verify-email', { state: { email: formData.email } });
//     }, 1500);
    
//   } catch (err) {
//     setError(err.response?.data?.msg || 'Signup failed');
//   }
// };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px' }}>{error}</p>}
      {success && <p style={{ color: 'green', padding: '10px', background: '#e6ffe6', borderRadius: '5px' }}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters) *"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />

        {/* ✨ CONFIRM PASSWORD FIELD ✨ */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ 
            width: '100%', 
            padding: '10px', 
            margin: '10px 0', 
            border: '1px solid #ccc', 
            borderRadius: '5px',
            borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? 'red' : '#ccc'
          }}
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p style={{ color: 'red', fontSize: '12px', margin: '-5px 0 10px 0' }}>Passwords don't match!</p>
        )}

        {/* ✨ PHONE NUMBER FIELD ✨ */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (optional)"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Please enter a 10-digit phone number"
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />

        {/* ✨ ADDRESS FIELD ✨ */}
        <textarea
          name="address"
          placeholder="Address (optional)"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px', resize: 'vertical' }}
        />

        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'green', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Sign Up
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <a href="/login" style={{ color: 'blue', textDecoration: 'none' }}>Login</a>
      </p>
    </div>
  );
}

export default Signup;