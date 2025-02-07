import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SharedLayout from "../JSX/SharedLayout";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from './utils';

const InternalLogin = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
    userType: 'Internal',
    projectCode: '',
  });

  const navigate = useNavigate();
  const [projectCodes, setProjectCodes] = useState([]); 
  const [currentUser, setCurrentUser] = useState([]); 
useEffect(() => {
  // Fetch project codes on component mount
  const fetchProjectCodes = async () => {
    try {
      const response = await fetch('https://rhythm-forge-api.vercel.app/api/projects');
      const data = await response.json();
      // Extract projectCode values from the response
      if (Array.isArray(data)) {
        const codes = data.map((project) => project.projectCode);
        setProjectCodes(codes);
      } else {
        handleError('Unexpected response format.');
      }
    } catch (error) {
      handleError('Error fetching project codes.');
    }
  };

  fetchProjectCodes();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  }; 

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, userType, projectCode } = loginInfo;

    if (!email || !password || !projectCode) {
      return handleError('All fields are required.');
    }

    try {
      const response = await fetch('https://rhythm-forge-api.vercel.app/auth/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType, projectCode }),
      });

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        localStorage.setItem('userId', result._id);
        const userDetails = {
          userId: result._id,
          message: result.message,
          success: result.success,
          jwtToken: result.jwtToken,  
          name: result.name,          
          userType: result.userType,  
          projectCode: projectCode,   
        };
        
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        setCurrentUser(userDetails);
        console.log("Stored userId:", localStorage.getItem("userId"));
        // Redirect based on the `redirectPage` from the backend
        if (result.redirectPage === 'EmpHomepage') {
          navigate('/EmpHomepage');
        } else {
          navigate('/InternalHomepage');
        }
      } else {
        handleError(result.message || 'Login failed. Please check logs');
      }
    } catch (err) {
      handleError('Login request failed.');
    }
  };

  return (
    <SharedLayout>
      <div className="register-box">
        <div className="register-info">
          <h3>Login to RhythmForge</h3>
          <img
            className="logo-header"
            src="/Images/smalllogo.png"
            height="30px"
            alt="RhythmForge Logo"
          />
        </div>
        <form onSubmit={handleLogin}>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Registered Email Address"
            className="form-input"
            value={loginInfo.email}
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="form-input"
            value={loginInfo.password}
          />
          <select             
          className="form-input"
          name="projectCode"
          onChange={handleChange}
          value={loginInfo.projectCode}
          required>
          <option value="">Select Project Code</option>
          {projectCodes.length > 0 ? (
            projectCodes.map((code, index) => (
              <option key={index} value={code}>{code}</option>
            ))
          ) : (
            <option value="">No project codes available</option>
          )}
        </select>
          <input type="checkbox" id="termsCheckbox" className="small-checkbox" required />
          <label htmlFor="termsCheckbox">I accept the Terms and Conditions</label>
          <button type="submit" className="form-button">Login</button>
        </form>
        <ToastContainer />
      </div>
    </SharedLayout>
  );
};

export default InternalLogin;
