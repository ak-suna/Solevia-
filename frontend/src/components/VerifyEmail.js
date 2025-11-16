// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// function VerifyEmail() {
//   const [code, setCode] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(600); // 10 minutes in seconds
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;

//   // Countdown timer
//   useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [timer]);

//   // Format timer (MM:SS)
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
//         email,
//         code
//       });

//       // Save token and user data
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));

//       setSuccess('Email verified successfully! Redirecting...');
      
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1500);

//     } catch (err) {
//       setError(err.response?.data?.msg || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
//       setSuccess('New verification code sent to your email!');
//       setTimer(600); // Reset timer
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Failed to resend code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!email) {
//     navigate('/signup');
//     return null;
//   }

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
//       <h2>Verify Your Email</h2>
//       <p style={{ color: '#666', marginBottom: '20px' }}>
//         We've sent a 6-digit code to<br />
//         <strong>{email}</strong>
//       </p>

//       {error && <p style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px' }}>{error}</p>}
//       {success && <p style={{ color: 'green', padding: '10px', background: '#e6ffe6', borderRadius: '5px' }}>{success}</p>}

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter 6-digit code"
//           value={code}
//           onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//           required
//           maxLength="6"
//           style={{
//             width: '100%',
//             padding: '15px',
//             margin: '20px 0',
//             border: '2px solid #ccc',
//             borderRadius: '8px',
//             fontSize: '24px',
//             textAlign: 'center',
//             letterSpacing: '10px'
//           }}
//         />

//         <p style={{ color: timer < 60 ? 'red' : '#666', marginBottom: '20px' }}>
//           Code expires in: <strong>{formatTime(timer)}</strong>
//         </p>

//         <button
//           type="submit"
//           disabled={loading || code.length !== 6}
//           style={{
//             width: '100%',
//             padding: '12px',
//             background: loading || code.length !== 6 ? '#ccc' : '#4CAF50',
//             color: 'white',
//             border: 'none',
//             cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
//             borderRadius: '5px',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             marginBottom: '15px'
//           }}
//         >
//           {loading ? 'Verifying...' : 'Verify Email'}
//         </button>
//       </form>

//       <div style={{ marginTop: '20px' }}>
//         <p style={{ color: '#666', fontSize: '14px' }}>Didn't receive the code?</p>
//         <button
//           onClick={handleResend}
//           disabled={loading || timer > 540} // Can resend after 1 minute
//           style={{
//             background: 'none',
//             border: 'none',
//             color: timer > 540 ? '#ccc' : 'blue',
//             cursor: timer > 540 ? 'not-allowed' : 'pointer',
//             textDecoration: 'underline',
//             fontSize: '14px'
//           }}
//         >
//           Resend Code {timer > 540 && `(wait ${formatTime(600 - timer)})`}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default VerifyEmail;