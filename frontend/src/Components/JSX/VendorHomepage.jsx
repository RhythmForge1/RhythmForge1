import React, { useState } from "react";
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import "../Styles/VendorHomepage.css";
import "../Styles/EscalationPopup.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { handleError, handleSuccess } from './utils';
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors,
} from "chart.js";
import Vendorsharedlayout from "./Vendorsharedlayout";
import ChatWidget from "../JSX/chatwidget.js";
import UpdateProjectModal from "../JSX/UpdateProjectModal.js";
import { useParams } from "react-router-dom";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
const element = <FontAwesomeIcon icon={faFileInvoice} />

const VendorHomepage = () => {
  const { projectCode: paramProjectCode } = useParams();
  const [projectCode, setProjectCode] = useState(null);
  const [refresh, setRefresh] = useState(false); 
  const [description, setDescription] = useState("");
  const [sprintPriority, setSprintPriority] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [showAttentionPopup, setShowAttentionPopup] = useState(false);
  const [showEscalationPopup, setShowEscalationPopup] = useState(false);
  const [projectCodes, setProjectCodes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [statusWidths, setStatusWidths] = useState({
    completed: 0,
    inProgress: 0,
    upcoming: 100,
  });
  const [formData, setFormData] = useState({
    selectedProject: "",
    reason: "",
    timeslot: "",
    severity: "Low",
    usersAffected: "",
    attachments: null,
  });
  const tasks = [
    {
      taskName: "Review Requirements",
      blocksProjectCode: "A123",
      pendingFrom: "2025-01-10",
    },
    {
      taskName: "Review User Acceptance Testing",
      blocksProjectCode: "B123",
      pendingFrom: "2025-01-12",
    },
  ];
  // Fetch projects from API
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
  const handlePopupOpen = () => setShowPopup(true);
  const handlePopupClose = () => {
    setShowAttentionPopup(false);
    setShowEscalationPopup(false);
  };

  useEffect(() => {
    if (paramProjectCode) {
      setProjectCode(paramProjectCode); // Set projectCode from URL param
    } else {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        const storedProjectCode = userDetails.projectCode;
        setProjectCode(storedProjectCode); // Fallback to localStorage if no URL param
      }
    }
  }, [paramProjectCode]);
  // Data for Pie Chart
  const pieData = {
    labels: ["On-Time", "Delayed", "Cancelled"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };
  const barData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Delivery Count",
        data: [200, 150, 300, 250],
        backgroundColor: "#36A2EB",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  const [showAttachments, setShowAttachments] = React.useState(false);
  const [attachments, setAttachments] = React.useState([]);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newAttachment = {
        name: file.name,
        date: new Date().toLocaleDateString(),
      };
      setAttachments((prev) => [...prev, newAttachment]); // Add the new attachment
      handleDescriptionOrAttachmentChange(); // Update Modified Date
    }
  };
  const uploadFile = () => {
    // Simulate a successful upload
    console.log("File uploaded successfully");
    handleDescriptionOrAttachmentChange(); // Update Modified Date
  };
  // On component mount, calculate delivery date (4 weeks from creation)
  React.useEffect(() => {
    const today = new Date();
    const delivery = new Date(today.setDate(today.getDate() + 28)); // Adds 28 days
    setDeliveryDate(delivery.toLocaleDateString());
  }, []);

  // Update modified date when attachments or description changes
  const handleDescriptionOrAttachmentChange = () => {
    setModifiedDate(new Date().toLocaleDateString());
  };
  const [activity, setActivity] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {}; // Retrieve logged-in user info from local storage
  console.log("Stored User Details:", localStorage.getItem("userDetails"));
  const handleRecentActivityClick = () => {
    // Simulate fetching activity data (could be from API or state)
    const activityData = {
      lastUpdatedBy: loggedInUser.name || 'Unknown User',
      lastUpdatedAt: new Date().toLocaleString(),
      changesMade: 'Added new product category, Updated stock levels.',
    };

    // If no changes, show "Not authorized"
    if (!activityData.changesMade) {
      activityData.changesMade = 'Not authorized to view';
    }

    setActivity(activityData);
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup by updating the state
  };
  // Fetch project details from API
useEffect(() => {
  if (projectCode) {
    console.log("Fetching project details for:", projectCode);
    const fetchProjectDetails = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const token = userDetails ? userDetails.jwtToken : null;
      const response = await fetch(`https://rhythm-forge-api.vercel.app/api/projects/${projectCode}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data); // Log the entire response

        if (data) {
          setProjectData(data);
                      // Extract required fields
        setDescription(data.detailedDescription || "No description available.");
        setSprintPriority(data.severity || "Not Set");
        setCreatedDate(new Date(data.createdAt).toLocaleDateString());
        setDeliveryDate(new Date(data.expectedDate).toLocaleDateString());
          // Find the latest completed stage
          const completedStages = data.stages.filter(stage => stage.status === "Completed");
          if (completedStages.length > 0) {
            const latestCompletedStage = completedStages.reduce((latest, stage) => 
              new Date(stage.endDate) > new Date(latest.endDate) ? stage : latest
            );
            setModifiedDate(new Date(latestCompletedStage.endDate).toLocaleDateString());
          } else {
            setModifiedDate("Not Available");
          }

          // Get approval status from "Approval" stage
          const approvalStage = data.stages.find(stage => stage.stage === "Approval");
          setApprovalStatus(approvalStage ? approvalStage.status : "Not Available");


          // Define the standard stage order
          const stages = [
            "Review",
            "Design",
            "Approval",
            "Development",
            "Integration Testing",
            "UAT",
            "Deployed",
            "Closed",
          ];

          // Retrieve the project stages from the API response
          const projectStages = data.stages;

          // Identify the latest pending stage
          const pendingStages = projectStages.filter((stage) => stage.status === "Pending");
          const sortedPendingStages = pendingStages.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          const latestPendingStage = sortedPendingStages[0]; // The latest "Pending" stage

          if (latestPendingStage) {
            const currentStageIndex = stages.indexOf(latestPendingStage.stage);

            if (currentStageIndex !== -1) {
              const totalStages = stages.length;

              // Calculate completed width based on stages marked as "Completed"
              const completedStages = projectStages.filter((stage) => stage.status === "Completed");
              const completedStageIndex = completedStages.length - 1;

              const completedWidth = ((completedStageIndex + 1) / totalStages) * 100;

              // Calculate in-progress width (only for the latest "Pending" stage)
              const inProgressWidth = 100 / totalStages;

              // Calculate upcoming width
              const upcomingWidth = 100 - completedWidth - inProgressWidth;

              setStatusWidths({
                completed: completedWidth,
                inProgress: inProgressWidth,
                upcoming: upcomingWidth,
              });
            } else {
              console.error("Current stage not found in the stages list.");
            }
          } else {
            console.error("No pending stages found.");
          }
        } else {
          console.error("Project data is missing in the response.");
          console.log("Response data:", data); // Log the raw response to investigate the structure
        }
      } else {
        console.error("Failed to fetch project data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

    fetchProjectDetails();
  }
}, [projectCode,refresh]);
const handleRefreshClick = () => {
  setRefresh((prev) => !prev);  // Toggle the refresh state to trigger the effect
};

return (
  <div className="Homepage-main">
    <Vendorsharedlayout></Vendorsharedlayout>
    <div className="main-homecontainer">
      {/* Left Box */}
      <div className="left-box-home">
        <p className="main-Trend">TREND ANALYSIS</p>
        <div className="chart">
          <h3>Delivery Impact</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart">
          <h3>Bar Graph</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>


      {/* Middle Section */}
      <div className="middle-section">
        {/* Description Box */}
        <div className="description-box">

          <h3 className="Project-name">PROJECT - {projectCode}</h3>
          {/* Horizontal Status Bar */}
          <div className="status-bar">
            <b>Current Project Stage: <span className="refresh-btn" onClick={handleRefreshClick}><i class="fa fa-refresh" aria-hidden="true"></i></span></b>
            <div className="status-line">
              <div
                className="completed"
                style={{ width: `${statusWidths.completed}%` }}
              ></div>
              <div
                className="in-progress"
                style={{ width: `${statusWidths.inProgress}%` }}
              ></div>
              <div
                className="upcoming"
                style={{ width: `${statusWidths.upcoming}%` }}
              ></div>
            </div>
            <div className="status-labels">
              {[
                "Review",
                "Design",
                "Approval",
                "Development",
                "Integration Testing",
                "UAT",
                "Deployed",
                "Closed",
              ].map((stage, index) => (
                <div key={index} className="label">
                  {stage}
                </div>
              ))}
            </div>
          </div>
          <div className="description-content">
            {description}
            {/* <p>
  This project solved the pain area of Service Delivery in middleware by streamlining processes and enhancing efficiency. Middleware, the crucial layer facilitating communication between different applications, often encounters challenges in ensuring seamless service delivery. These challenges become more pronounced with the increasing complexity of IT environments and the rising demand for real-time data processing.
  </p> */}
          </div>
          <div className="description-features">
            {/* First Row: Attachments Section */}
            <div className="row-Description-attachments">
              <div className="attachments-section">
                <h6 className="toggle-attachments1">
                  View All Attachments
                </h6>
                <h6 onClick={() => setShowAttachments(true)} className="toggle-attachments">
                  <i className="bx bx-paperclip"></i> Attachments
                </h6>

                {showAttachments && (
                  <div className="attachments-popup">
                    <div className="popup-content">
                      <h6>Existing Attachments</h6>
                      <ul>
                        {attachments.length > 0 ? (
                          attachments.map((attachment, index) => (
                            <li key={index}>
                              {attachment.name} - <em>Uploaded on: {attachment.date}</em>
                            </li>
                          ))
                        ) : (
                          <li>No attachments uploaded yet.</li>
                        )}
                      </ul>
                      <div className="upload-section">
                        <input
                          type="file"
                          id="fileInput"
                          onChange={handleFileUpload}
                          className="file-input"
                        />
                        <button className="btn btn-primary" onClick={uploadFile}>
                          Upload
                        </button>
                      </div>
                      <button
                        className="btn btn-danger close-popup"
                        onClick={() => setShowAttachments(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Approval Status */}
              <div className="approval-status">
                <h6 className="approval-header">Approval Status</h6>
                <select className="approval-dropdown">
                  <option value="approved">🟢 Approved</option>
                  <option value="pending">🟠 Pending</option>
                  <option value="rejected">🔴 Rejected</option>
                </select>
              </div>

              {/* Priority Indicator */}
              <div className="priority-indicator">
                <h6 className="Priority-header">Sprint Priority</h6>
                <select className="priority-dropdown" value={sprintPriority.toLowerCase()}>
                  <option value="high">🔺High</option>
                  <option value="medium">🔼Medium</option>
                  <option value="low">🔽Low</option>
                  <option value="severe">⛔Severe</option>
                </select>
              </div>
            </div>
            {/* Second Row: Dates Section */}
            <div className="row-Description-Dates">
              <div className="Created-date">
                <h6 className="Created-header">Created On:</h6>
                <span>{createdDate}</span>
              </div>
              <div className="Modified-date">
                <h6 className="Modified-header">Modified On:</h6>
                <span>{modifiedDate}</span>
              </div>
              <div className="Tentative-date">
                <h6 className="Modified-header">Delivery On:</h6>
                <span>{deliveryDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Box */}
      <div className="right-box-home">
        <p className="main-Owner">MANAGED BY</p>
        <div className="Owner">
          <Link to="#"><i class='bx bxs-user-detail'></i> John Doe, HCLTech</Link>
        </div>
        <p className="main-Links">QUICK LINKS</p>
        <div className="main-Links1">
          <div className="help-buttons-home">
            <>
              <Link to="#" className="help-button1" onClick={() => setModalOpen(true)}>
                <span className="QL"><FontAwesomeIcon icon={faPenToSquare} /></span> Add/Review/Update Request
              </Link>
              <UpdateProjectModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                projectCode={projectCode}
              />
            </>
            <div>
              {/* Button to open popup */}
              <span onClick={handleRecentActivityClick} className="help-button1">Recent Activity</span>
              {/* Popup */}
              {isPopupOpen && (
                <div className="popup-bg">
                  <div className="popup-content2">
                    <h3>Recent Activity</h3>
                    <p><strong>Last Updated by:</strong> {activity.lastUpdatedBy}</p>
                    <p><strong>Last Updated at:</strong> {activity.lastUpdatedAt}</p>
                    <p><strong>Changes Made:</strong> {activity.changesMade}</p>
                    <button onClick={closePopup}>Close</button>
                  </div>
                </div>
              )}
            </div>
            <a href="#!" className="help-button1" onClick={() => setShowAttentionPopup(true)}><span className="QL"><FontAwesomeIcon icon={faBell} /></span>
              Actions Need Your Attention
            </a>
            {showAttentionPopup && (
              <div className="popup-overlay">
                <div className="popup-container">
                  <button className="close-popup" onClick={() => setShowAttentionPopup(false)}>
                    &times;
                  </button>
                  <h2>Below tasks need your Sign Off</h2>
                  <ul className="task-list">
                    {tasks.map((task, index) => (
                      <li key={index} className="task-item">
                        <strong>Task Name:</strong> {task.taskName} <br />
                        <strong>This Task Blocks Parent:</strong>{" "}
                        {projectCode}
                        <br />
                        <strong>Pending From:</strong> {task.pendingFrom}
                        <button className="help-button1" ><Link to="/VendorProjects" style={{ textDecoration: 'none' }}>Take Action</Link></button>
                      </li>
                    ))}
                  </ul>
                  <p className="warning-text">
                    If not completed, it may impact main project completion end dates.
                  </p>
                </div>
              </div>
            )}
            <Link to="/contact" className="help-button1">
              <span className="QL"><FontAwesomeIcon icon={faFileInvoice} /></span> Billing Details
            </Link>
          </div>
        </div>
        <div className="main-Links2">

          <span>
            <button className="QL-B">
              <i class='bx bx-support'></i> support
            </button>
            <button className="QL-B">
              <i class='bx bxs-bookmark-star'></i> Bookmark
            </button>

          </span>

        </div>
        <ChatWidget />
      </div>
    </div>
    {/* Informational Section */}
    <section className="info-section">
      <h2>About RhythmForge</h2>
      <p>
        RhythmForge is an advanced platform designed to streamline
        organizational workflows and enhance collaboration among teams. With
        a focus on efficiency, our system provides tailored solutions for
        developers, testers, and project managers, enabling them to perform
        their tasks seamlessly. Whether you are working on large-scale
        projects or managing daily operations, RhythmForge equips you with
        tools that ensure productivity and effective communication
      </p>
      <p>
        At its core, RhythmForge integrates cutting-edge technologies to
        ensure secure and real-time access to project resources. With its
        intuitive interface and robust architecture, users can easily track
        project progress, allocate resources, and collaborate on deliverables.
        The platform supports a wide range of customization options to suit
        your organization's specific requirements, making it an indispensable
        tool for both large enterprises and small teams.
      </p>
      <p>
        Explore our platform today to unlock the full potential of your team
        and drive success in every project.
      </p>
    </section>

    {/* Footer */}
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

export default VendorHomepage;
