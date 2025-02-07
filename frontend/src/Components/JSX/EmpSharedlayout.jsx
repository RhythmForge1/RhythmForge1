import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/VendorSharedLayout.css";
import "../Styles/EscalationPopup.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { handleError } from './utils';
import ProjectCalendar from "../JSX/Calendar"
import { motion } from 'framer-motion';
import EscalationModal from "../JSX/EscalationModal";

Modal.setAppElement("#root");
const Empsharedlayout = () => {
    const [isEscalationOpen, setIsEscalationOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("userDetails"); // Clear user data
        navigate("/LoginPage"); // Redirect to login
      };
  
useEffect(() => {
const fetchProjects = async () => {
    try {
    // Get user ID from localStorage
    const userId = localStorage.getItem("userId");
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const token = userDetails?.jwtToken;

    if (!userId || !token) return;

    // Fetch projects
    const response = await fetch("https://rhythm-forge-api.vercel.app/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    const data = await response.json();

    // Filter projects where the user is a member
    const filteredProjectCodes = data
        .filter((project) => project.members.includes(userId))
        .map((project) => project.projectCode);

    setProjectCodes(filteredProjectCodes);
    } catch (error) {
    console.error("Error fetching project codes:", error);
    }
};

fetchProjects();
}, []);
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
    const handleProjectSelect = (filteredProjectCodes) => {
        setProjectCode(filteredProjectCodes); 
        navigate(`/EmpHomepage/${filteredProjectCodes}`); // Redirects to VendorHomepage with projectCode
        window.location.reload();
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

<nav className="navbar1" style={{ paddingLeft: 10, paddingRight: 10 }}>
    <div className="dropdown-Vshared">
        Functions <i className="bx bxs-chevron-down"></i>
        <div className="dropdown-content-Vshared" style={{ minWidth: 140 }}>
        <a
  onClick={() => {
    console.log("Opening Calendar Modal");
    setIsCalendarOpen(true);
  }}
  className="Schedules"
>
  Schedules
</a>
        </div>
    </div>
    <div className="dropdown-Vshared">
        Escalations <i className="bx bxs-chevron-down"></i>
        <div className="dropdown-content-Vshared" style={{ minWidth: 140 }}>
                <a 
                    onClick={() => setIsEscalationOpen(true)} 
                    className="Escalation"
                    style={{ cursor: "pointer" }} // Ensure it's clickable
                >
                    Escalation
                </a>
                <EscalationModal 
                isOpen={isEscalationOpen}
                onClose={() => setIsEscalationOpen(false)}
            />
            </div>
     {/* Calendar Modal */}
     <Modal
        isOpen={isCalendarOpen}
        onRequestClose={() => setIsCalendarOpen(false)}
        className="modal-wrapper"
        overlayClassName="modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="modal-content"
        >
          {/* Calendar Component */}
          <ProjectCalendar />

          {/* Close Button */}
          <button
            onClick={() => setIsCalendarOpen(false)}
            className="mt-6 px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
          >
            Close
          </button>
        </motion.div>
      </Modal>
        <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1050;
          }

          .modal-wrapper {
            outline: none;
            border: none;
          }

          .modal-content {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            width: 90%;
            text-align: center;
          }
        `}
      </style>
 

    </div>
    <div className="dropdown-Vshared">
      My Projects <i className="bx bxs-chevron-down"></i>
      <div className="dropdown-content-Vshared" style={{ minWidth: 140 }}>
        {projectCodes.length > 0 ? (
          projectCodes.map((code) => <a key={code} onClick={() => handleProjectSelect(code)}>{code}</a>)
        ) : (
          <a>No projects found</a>
        )}
      </div>
    </div>
    <div className="navbar-Vhome">
        <Link to="/EmpHomepage" >Home</Link>
    </div>
    <div className="right-dropdown">
        <div className="dropdown-Vshared">Help <i className="bx bxs-chevron-down"></i>
            <div className="dropdown-content-Vshared" style={{ minWidth: 140 }}>
                <a href="#">Chat</a>
                <a href="#">Contact</a>
            </div>
        </div>
    </div>
</nav>
</div>
    );
};

export default Empsharedlayout;
