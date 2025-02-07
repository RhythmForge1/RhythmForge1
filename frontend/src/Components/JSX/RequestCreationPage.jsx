import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Vendorsharedlayout from '../JSX/Vendorsharedlayout';
import "../Styles/RequestCreationPage.css";

const RequestCreationPage = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
  
    const handleLogout = () => {
        localStorage.removeItem("userDetails"); // Clear user data
        navigate("/LoginPage"); // Redirect to login
      };
    const [formData, setFormData] = useState({
    area: '',
    shortDescription: '',
    detailedDescription: '',
    expectedDate: '',
    mutualBenefits: '',
    severity: '',
    documents: null,
    lineManagerEmail: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documents: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Trim any extra spaces before submitting the form
    if (!formData.shortDescription || formData.shortDescription.trim() === "") {
        alert("Short Description is required.");
        return;
      }
    
      // Trim any extra spaces before submitting the form
      const trimmedData = {
          ...formData,
          shortDescription: formData.shortDescription.trim(),
          detailedDescription: formData.detailedDescription.trim(),
          area: formData.area.trim(),
          lineManagerEmail: formData.lineManagerEmail.trim(),
      };
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const token = userDetails ? userDetails.jwtToken : null;
      console.log("Extracted Token:", token);

    try {
        const response = await fetch('https://rhythm-forge-api.vercel.app/api/projects/create', {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trimmedData)
        }); 
      if (response.ok) {
        const data = await response.json();
        alert(`Project Created with Code: ${data.project.projectCode}`);
        handleReset(); // Reset form
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create project. Please try again.');
    }
  };
  

  const handleReset = () => {
    setFormData({
      area: '',
      shortDescription: '',
      detailedDescription: '',
      expectedDate: '',
      mutualBenefits: '',
      severity: '',
      documents: null,
      lineManagerEmail: ''
    });
  };

  return (
    
      <div className="Request-page">

<Vendorsharedlayout></Vendorsharedlayout>
      <div className='NewRequest-container'>
        <h2>Create a New Request</h2>
        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group1">
            <label htmlFor="area" className="form-label">Select Your Area of Requirement</label>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="form-input1"
              required
            >
              <option value="">--Select--</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="form-group1">
            <label htmlFor="shortDescription" className="form-label">Provide Short Description (Format: AppCode-short description.. Example: EV1-Ammendement of New Feature)</label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-input1"
              required
            />
          </div>

          <div className="form-group1">
            <label htmlFor="detailedDescription" className="form-label">Provide Detailed Description</label>
            <textarea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleChange}
              className="form-input1"
              required
            />
          </div>

          <div className="form-group1">
            <label htmlFor="expectedDate" className="form-label">Expected Completion Date</label>
            <input
              type="date"
              id="expectedDate"
              name="expectedDate"
              value={formData.expectedDate}
              onChange={handleChange}
              className="form-input1"
              required
            />
          </div>

          <div className="form-group1">
            <label htmlFor="mutualBenefits" className="form-label">Provide Mutual Benefits (if any)</label>
            <textarea
              id="mutualBenefits"
              name="mutualBenefits"
              value={formData.mutualBenefits}
              onChange={handleChange}
              className="form-input1"
            />
          </div>

          <div className="form-group1">
            <label htmlFor="severity" className="form-label">Select Severity</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="form-input1"
              required
            >
              <option value="">--Select--</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group1">
            <label htmlFor="documents" className="form-label">Attach Documents</label>
            <input
              type="file"
              id="documents"
              name="documents"
              onChange={handleFileChange}
              className="form-input1"
            />
          </div>

          <div className="form-group1">
            <label htmlFor="lineManagerEmail" className="form-label">Line Manager Email</label>
            <input
              type="email"
              id="lineManagerEmail"
              name="lineManagerEmail"
              value={formData.lineManagerEmail}
              onChange={handleChange}
              className="form-input1"
              required
            />
          </div>

          <div className="form-actions1">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
          </div>
        </form>
        </div>
          <footer className="site-footer" role="contentinfo">
              <div className="page-width">
                {/* "Our Services" and "Conditions of Use" sections */}
                <div className="site-footer__section">
                  <div className="site-footer__subsection">
                    <h4>OUR SERVICES</h4>
                    <ul>
                      <li><Link to="/about-us">About Us</Link></li>
                      <li><Link to="/contact">Contact Us</Link></li>
                      <li><Link to="/help">Help</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="site-footer__section">
                  <div className="site-footer__subsection">
                    <h4>SOCIAL LINKS</h4>
                    <ul>
                      <li><Link to="/about-us">Linkedin</Link></li>
                      <li><Link to="/contact">Facebook</Link></li>
                      <li><Link to="/help">Instagram</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="site-footer__section">
                  <div className="site-footer__subsection">
                    <h4>SUPPORT</h4>
                    <ul>
                      <li><Link to="/about-us">Customer Support</Link></li>
                      <li><Link to="/help">FAQs</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="site-footer__copyright">
                <p>© 2024 RhythmForge. All rights reserved.</p>
              </div>
            </footer>
      </div>
      
  );
  
};

export default RequestCreationPage;
