import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/VendorSharedLayout.css";
import "../Styles/EscalationPopup.css";
import "../Styles/EmployeesPage.css"
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { handleError } from './utils';
import { useNavigate } from "react-router-dom";

const Internalsharedlayout = () => {
    const [projectCode, setProjectCode] = useState('');
    const [showEscalationPopup, setShowEscalationPopup] = useState(false);
    const [projectCodes, setProjectCodes] = useState([]);
    const [formData, setFormData] = useState({
        selectedProject: "",
        reason: "",
        timeslot: "",
        severity: "Low",
        usersAffected: "",
        attachments: null,
    });
    const [previewData, setPreviewData] = useState(null);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    
    const handleLogout = () => {
        localStorage.removeItem("userDetails"); // Clear user data
        navigate("/LoginPage"); // Redirect to login
    };
    // Fetch projects from API
    useEffect(() => {
        const fetchProjectCodes = async () => {
            try {
                const response = await fetch('https://rhythm-forge-api.vercel.app/api/projects');
                const data = await response.json();
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

    useEffect(() => {
        // Retrieve the project code from localStorage
        const code = localStorage.getItem('projectCode');
        if (code) {
            setProjectCode(code);
        } else {
            console.error('Project code not found in localStorage.');
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, attachments: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPreviewData(formData); // Show preview of the form
    };

    const handleConfirm = async () => {
        try {
            const formDetails = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDetails.append(key, value);
            });

            await axios.post("https://rhythm-forge-api.vercel.app/api/escalation", formDetails, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Escalation submitted and email sent successfully!");
            setShowEscalationPopup(false);
            setFormData({
                selectedProject: "",
                reason: "",
                timeslot: "",
                severity: "Low",
                usersAffected: "",
                attachments: null,
            });
        } catch (error) {
            console.error("Error submitting escalation:", error);
            alert("Failed to submit escalation.");
        }
    };

    return (
        <div className="Sharedlayout-main">
            <header className="headerHome">
                <div className="headerhome-left">
                    <Link to="/">
                        <img
                            src="/Images/headernew.png"
                            alt="RhythmForge Logo"
                            className="logo-header"
                        />
                    </Link>
                </div>
                <div className="header-middle">
                    <input
                        type="text"
                        placeholder="Search Articles"
                        className="search-bar"
                        aria-label="Search Articles"
                    />
                </div>
                <div className="header-right">
      <button className="icon-button1">
        <i className="fa fa-question-circle" aria-hidden="true"></i> Support
      </button>
      <button className="icon-button1" onClick={() => navigate("/LoginPage")}>
        <i className="fa fa-exchange" aria-hidden="true"></i> Switch user
      </button>

      {/* Account Dropdown */}
      <div className="dropdown-account">
        <button
          className="icon-button1"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <i className="fa fa-user" aria-hidden="true"></i> Account
        </button>

        {showDropdown && (
          <div className="dropdown-account-content">
            <button onClick={() => navigate("/Profile")}>Profile</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </div>
            </header>

      {/* Navbar 1 */}
      <nav className="navbar1" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <div className="nav-left">
          <button onClick={() => navigate("/EmployeesPage")}>Resources</button>
          <button onClick={() => navigate("/Deliverables")}>Deliverables</button>
          <button onClick={() => navigate("/EmpEngagement")}>Employee Engagement</button>
          <button onClick={() => navigate("/InternalHomepage")}>Home</button>
        </div>
        <div className="nav-right">
          <button>Approvals</button>
          <button>Notifications</button>
        </div>
      </nav>
      {/* Navbar 2 */}
      <nav className="navbar2" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <div className="dropdown">
          Select Project <i className='bx bxs-chevron-down'></i>
          <div className="dropdown-content" style={{ minWidth: 140 }}>
            <a href="#">A123</a>
            <a href="#">A789</a>
            <a href="#">Add New projects</a>
          </div>
        </div>
        <div className="dropdown">
          Select Sprint <i className='bx bxs-chevron-down'></i>
          <div className="dropdown-content" style={{ minWidth: 140 }}>
            <a href="#">November </a>
            <a href="#">December</a>
            <a href="#">Schedules</a>
          </div>
        </div>
        <div className="dropdown">
          Select Stage <i className='bx bxs-chevron-down'></i>
          <div className="dropdown-content" style={{ minWidth: 140 }}>
            <a href="#">In Development</a>
            <a href="#">In Testing</a>
            <a href="#">In Production</a>
          </div>
        </div>
        <div className="right-dropdown">
          <div className="dropdown">
            Help <i className='bx bxs-chevron-down'></i>
            <div className="dropdown-content" style={{ minWidth: 140 }}>
              <a href="#">Chat</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </nav>
        </div>
    );
};

export default Internalsharedlayout;
