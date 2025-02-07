import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedLayout from "../JSX/SharedLayout";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "./utils";

const RegisterPage2 = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    lineManagerEmail: "",
    sapId: "",
    businessJustification: "",
    role: "",
    projectCode: "",
    accessType: "",
    password: "",
    userType: "Internal",
  });
  const navigate = useNavigate();
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      lineManagerEmail,
      sapId,
      businessJustification,
      role,
      projectCode,
      accessType,
      password,
    } = signupInfo;

    // Validate required fields
    if (
      !name ||
      !email ||
      !lineManagerEmail ||
      !sapId ||
      !businessJustification ||
      !role ||
      !projectCode ||
      !accessType ||
      !password
    ) {
      return handleError("All fields are required.");
    }

    try {
      const url = `https://rhythm-forge-api.vercel.app/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/LoginPage");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details || "Signup failed. Please check logs");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || "Something went wrong.");
    }
  };

  return (
    <SharedLayout>
      <div className="register-box">
        <div className="register-info">
          <h3>You are 1 step away to Register :)</h3>
          <img
            className="logo-header"
            src="/Images/smalllogo.png"
            height="30px"
            alt="RhythmForge Logo"
          />
        </div>
        <div>
          <p>Please fill out the form below to proceed with raising Access.</p>
          <span className="tooltipregister">
            <i className="fa fa-info-circle"></i>
            <span className="tooltipregister-text1">
              You are going to raise an access request to a confidential portal.
              Please make sure you have a valid business justification to
              access.
            </span>
          </span>
        </div>
        <form onSubmit={handleSignup}>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Full Name as per Organization ID"
            className="form-input"
            value={signupInfo.name}
          />
          <input
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="HCL Email Address"
            className="form-input"
            value={signupInfo.email}
          />
          <input
            onChange={handleChange}
            name="lineManagerEmail"
            type="email"
            placeholder="Line Manager Email Address"
            className="form-input"
            value={signupInfo.lineManagerEmail}
          />
          <input
            onChange={handleChange}
            name="sapId"
            type="text"
            placeholder="HCL SAP ID"
            className="form-input"
            value={signupInfo.sapId}
          />
          <input
            onChange={handleChange}
            name="businessJustification"
            type="text"
            placeholder="Business justification..."
            className="form-input"
            value={signupInfo.businessJustification}
          />
          <select
            name="role"
            className="form-input"
            onChange={handleChange}
            value={signupInfo.role}
          >
            <option value="">Select Role</option>
            <option>Scrum Master</option>
            <option>QA Analyst</option>
            <option>Project Manager</option>
            <option>L3 Head</option>
            <option>L4 Head</option>
            <option>HR Manager</option>
          </select>
          <select
            name="projectCode"
            className="form-input"
            onChange={handleChange}
            value={signupInfo.projectCode}
          >
            <option value="">Select Project Code</option>
            <option>A123</option>
            <option>B123</option>
            <option>123</option>
          </select>
          <select
            name="accessType"
            className="form-input"
            onChange={handleChange}
            value={signupInfo.accessType}
          >
            <option value="">Select Access Type</option>
            <option>Permanent</option>
            <option>Temporary</option>
            <option>Custom</option>
          </select>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            placeholder="Create a Password"
            className="form-input"
            value={signupInfo.password}
          />
          <div className="terms-container">
            <input
              type="checkbox"
              id="termsCheckbox"
              className="small-checkbox"
              required
              style={{ width: "50px", marginTop: "12px" }}
            />
            <label htmlFor="termsCheckbox" className="terms-label">
              I accept the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
        <ToastContainer />
      </div>
    </SharedLayout>
  );
};

export default RegisterPage2;
