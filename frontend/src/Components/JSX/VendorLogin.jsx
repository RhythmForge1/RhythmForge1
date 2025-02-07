import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SharedLayout from "../JSX/SharedLayout";
import "../Styles/LoginPage.css";
import { ToastContainer } from "react-toastify"
import { handleError, handleSuccess } from './utils';

const VendorLogin = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
    projectCode: '',
    userType: 'Vendor',
})
const [currentUser, setCurrentUser] = useState([]); 
const [projectCodes, setProjectCodes] = useState([]); // Store project codes
const navigate = useNavigate();

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
          // localStorage.setItem('token', result.jwtToken);
          // localStorage.setItem('loggedInUser', result.name);
          // localStorage.setItem('projectCode', projectCode);
          localStorage.setItem('userId', result._id);
          const userDetails = {
            message: result.message,
            success: result.success,
            jwtToken: result.jwtToken,  
            name: result.name,          
            userType: result.userType,  
            projectCode: projectCode,   
          };
          
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
          setCurrentUser(userDetails);
          navigate('/VendorHomepage');
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
        <div>
          <p>Please login with your registered email and password. <span className="tooltipregister">
            <i className="fa fa-info-circle"></i>
            <span className="tooltipregister-text1">
              You are logging in to a confidential portal. Please ensure you
              have a valid business justification to log in.
            </span>
          </span></p>

        </div>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Registered Email Address"
              className="form-input"
              value={loginInfo.email}
            />
            <span className="tooltipemail">
              <i className="fa fa-info-circle"></i>
              <span className="tooltipemail-text">
                Please enter the email used while registering access for
                RhythmForge.
              </span>
            </span>
          </div>
          {/* Password Input */}
          <div className="input-container">
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your Password"
              className="form-input"
              value={loginInfo.password}
            />
            <span className="tooltippwd">
              <i className="fa fa-info-circle"></i>
              <span className="tooltippwd-text">
                Please enter the password which you've received on your
                registered email.
              </span>
            </span>
          </div>
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

          {/* Terms and Conditions */}
          <div className="terms-container">
            <input
              type="checkbox"
              id="termsCheckbox"
              className="small-checkbox"
              style={{ width: "50px", marginTop: "12px" }}
            />
            <label htmlFor="termsCheckbox" className="terms-label">
              I accept the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
        <ToastContainer />
      </div>
    </SharedLayout>
  );
};

export default VendorLogin;
