import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Styles/EmpHomepage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import { faBell, faCalendar, faPenToSquare, faBug } from "@fortawesome/free-solid-svg-icons";
import { handleError, handleSuccess } from './utils';
import axios from "axios";
import ChatWidget from "../JSX/chatwidget.js";
import Empsharedlayout from "./EmpSharedlayout.jsx";
import { useParams } from "react-router-dom";

const element = <FontAwesomeIcon icon={faFileInvoice} />

const EmpHomepage = () => {
  const { projectCode: paramProjectCode } = useParams();
  const [projectCode, setProjectCode] = useState(null);
  const [refresh, setRefresh] = useState(false); 
  const [description, setDescription] = useState("");
  const [sprintPriority, setSprintPriority] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [previousVouchers, setPreviousVouchers] = useState([]);
  const [currentCycleVoucher, setCurrentCycleVoucher] = useState(null);
  const [voucher, setVoucher] = useState(null); // State to hold the voucher
  const [timelyCompletionsCount, setTimelyCompletionsCount] = useState(0);
  const [assignee, setAssignee] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [currentStage, setCurrentStage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showBugPopup, setShowBugPopup] = useState(false);
  const [status, setStatus] = useState(""); //
  const [projectCodes, setProjectCodes] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [statusWidths, setStatusWidths] = useState({
    completed: 0,
    inProgress: 0,
    upcoming: 100,
  });
  // Sample bugs data
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLogout = () => {
      localStorage.removeItem("userDetails"); // Clear user data
      navigate("/LoginPage"); // Redirect to login
    };
  const [loading, setLoading] = useState(true);
  const [showAttachments, setShowAttachments] = React.useState(false);
  const [attachments, setAttachments] = React.useState([]);

  const fetchUserDetails = async () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userId = localStorage.getItem("userId");
  const token = userDetails?.jwtToken;

  if (!userId || !token) {
    console.error("User not logged in or invalid token.");
    return;
  }

  try {
    // Fetch user details from the backend
    const response = await axios.get(`https://rhythm-forge-api.vercel.app/api/users/profile`, {
      headers: { Authorization: `${token}` },
    });

    if (response.data.success) {
      // Set the timelyCompletionsCount to the latest value from the backend
      const { timelyCompletionsCount } = response.data.user;
      setTimelyCompletionsCount(timelyCompletionsCount); // Update frontend state
      console.log("Fetched timelyCompletionsCount from backend:", timelyCompletionsCount);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};
  
  // Call this function after the page loads or user logs in
  useEffect(() => {
    fetchUserDetails();
  }, []);

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

//  useEffect(() => {
//     const storedUserDetails = localStorage.getItem("userDetails");
//     if (storedUserDetails) {
//       const userDetails = JSON.parse(storedUserDetails);
//       const projectCode = userDetails.projectCode;
//       console.log("Stored projectCode:", projectCode); // Log to confirm retrieval
//       setProjectCode(projectCode); // Set the projectCode
//     } else {
//       console.error('User details not found in localStorage.');
//     }
//   }, []);
   // Fetch Quick Links data
   useEffect(() => {
    if (projectCode) {
      axios
        .get(`https://rhythm-forge-api.vercel.app/api/deliverables/${projectCode}`)
        .then((response) => {
          const data = response.data.deliverables;
  
          console.log("Deliverables API Response:", data);
  
          // Filter completed stages and get the latest pending stage
          const completedStages = data.filter(deliverable => deliverable.status === "Completed");
          const latestCompletedDate = completedStages.length > 0 
            ? new Date(Math.max(...completedStages.map(stage => new Date(stage.endDate)))) 
            : null;
            
          // Find the first "Pending" stage after the latest "Completed" stage
          const latestPendingStage = data
            .filter(deliverable => deliverable.status === "Pending")
            .find(deliverable => new Date(deliverable.startDate) > latestCompletedDate);
  
          console.log("Latest Pending Stage:", latestPendingStage);
  
        // Step 1: Map teamMembers to include both name and employeeId
        const teamMembers = latestPendingStage.teamMembers.map((member) => ({
          name: member.name,
          employeeId: member.employeeId
        }));

        console.log("API Members Data:", teamMembers);
 
     // Format dates to yyyy-MM-dd
     const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Set values in the state with formatted dates
    setAssignees(teamMembers);
    setCurrentStage(latestPendingStage ? latestPendingStage.stage : "");
    setStartDate(latestPendingStage ? formatDate(latestPendingStage.startDate) : "");
    setEndDate(latestPendingStage ? formatDate(latestPendingStage.endDate) : "");
    setPriority(latestPendingStage ? latestPendingStage.severity : "");
    setStatus(latestPendingStage ? latestPendingStage.status : "");
    
    
  })
        .catch((error) => console.error("Error fetching quick links data:", error));
    }
  }, [projectCode, refresh]);

  // Update Current Stage
  const updateStage = (newStage) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")); 
const token = userDetails?.jwtToken; // Extract JWT token
    axios
    .patch(
      `https://rhythm-forge-api.vercel.app/api/projects/${projectCode}/stages/${newStage}`,
      { status: "In Progress" },
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then(() => setCurrentStage(newStage))
      .catch((error) => console.error("Error updating stage:", error));
  };
// Function to update status
const updateStatus = async (newStatus) => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const token = userDetails?.jwtToken;
  const userId = localStorage.getItem("userId");

  if (!token || !projectCode || !currentStage) {
    console.error("Missing required data for updating status.");
    return;
  }

  try {
    const currentDate = new Date();
    const stageEndDate = new Date(endDate);
    let newTimelyCount = timelyCompletionsCount;
    if (newStatus === "Completed" && currentDate < stageEndDate) {
      newTimelyCount++;
      console.log("Incrementing timelyCompletionsCount:", newTimelyCount);
      setTimelyCompletionsCount(newTimelyCount);
    }

    let milestoneId = null;
    let previousMilestone = timelyCompletionsCount; // Store the old count

    // Determine milestone completion based on the updated timelyCompletionsCount
    if (previousMilestone < 1 && newTimelyCount >= 1) {
      milestoneId = "679a170928b4fed5311283e4"; // First milestone
    } else if (previousMilestone < 2 && newTimelyCount >= 2) {
      milestoneId = "679a188c9f08a9d27c7b2a3f"; // Second milestone
    } else if (previousMilestone < 4 && newTimelyCount >= 4) {
      milestoneId = "679a18cd9f08a9d27c7b2a41"; // Third milestone
    } else if (previousMilestone < 6 && newTimelyCount >= 6) {
      milestoneId = "679a19179f08a9d27c7b2a43"; // Final milestone
    }

    console.log("Final timelyCompletionsCount before API:", newTimelyCount);

    // Calculate reward points based on timelyCompletionsCount
    let rewardPoints = 100 + (newTimelyCount - 1) * 50; // Base is 100 points for 1st completion, then add 50 each completion
    console.log("Reward Points calculated:", rewardPoints);

    // Calculate the new level based on milestones completed
    let newLevel = "Beginner";
    let milestonesCompleted = [];
    if (newTimelyCount >= 1) {
      newLevel = "Intermediate";
      milestonesCompleted.push("679a170928b4fed5311283e4"); // First milestone completed
    }
    if (newTimelyCount >= 3) {
      newLevel = "Expert";
      milestonesCompleted.push("679a188c9f08a9d27c7b2a3f"); // Second milestone completed
    }
    if (newTimelyCount >= 4) {
      newLevel = "SME";
      milestonesCompleted.push("679a18cd9f08a9d27c7b2a41"); // Third milestone completed
    }
 // If milestoneId is assigned, proceed to complete the milestone
 if (milestoneId) {
  const response = await axios.patch(
    `https://rhythm-forge-api.vercel.app/api/milestones/${milestoneId}/complete`,
    { userId: userId, milestoneId, timelyCompletionsCount: newTimelyCount, rewardPoints, newLevel },
    { headers: { Authorization: `${token}` } }
  );
  console.log(`Milestone ${milestoneId} completed!`);

  console.log(response.data);

  // **Check if the user received a voucher**
  if (response?.data?.voucher && Object.keys(response.data.voucher).length > 0) {
    setVoucher(response.data.voucher); // Store the voucher in state
  } else {
    setVoucher(null); // Ensure the voucher is reset if not available
  }
  // **Update the user's profile with currentCycleVoucher and previousVouchers**
  const updatedUser = response.data.user; // Assuming the response includes the updated user data
  setPreviousVouchers(updatedUser.previousVouchers);
  setCurrentCycleVoucher(updatedUser.currentCycleVoucher);
}
    // Proceed to update the project stage status
    await axios.patch(
      `https://rhythm-forge-api.vercel.app/api/projects/${projectCode}/stages/${currentStage}`,
      { status: newStatus },
      { headers: { Authorization: `${token}` } }
    );

    setStatus(newStatus);
    alert("Status updated successfully!");

    // Fetch the latest project data to reflect live update
    setRefresh((prev) => !prev); 

  } catch (error) {
    console.error("Error updating status:", error);
  }
};
const fetchLatestProjectData = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("userDetails"))?.jwtToken;
    
    // Fetch latest project data (including current stage and milestones)
    const response = await axios.get(`https://rhythm-forge-api.vercel.app/api/projects/${projectCode}`, {
      headers: { Authorization: `${token}` }
    });

    if (response.data) {
      console.log("Live project update received:", response.data);
      setCurrentStage(response.data.currentStage);
      setStatus(response.data.status); 
    }
  } catch (error) {
    console.error("Error fetching latest project data:", error);
  }
};
const updateStageDates = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const token = userDetails?.jwtToken;
  console.log("Sending data:", { startDate, endDate });
  axios
    .patch(
      `https://rhythm-forge-api.vercel.app/api/projects/${projectCode}/stages/${currentStage}/dates`,
      { startDate, endDate },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      alert("Stage dates updated successfully!");
      console.log("Updated response:", response.data);
    })
    .catch((error) => console.error("Error updating dates:", error));
};

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
            console.log("Fetched data:", data);

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

              const projectStages = data.stages;
              const pendingStages = projectStages.filter((stage) => stage.status === "Pending");
              const sortedPendingStages = pendingStages.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
              const latestPendingStage = sortedPendingStages[0];

              if (latestPendingStage) {
                const currentStageIndex = stages.indexOf(latestPendingStage.stage);

                if (currentStageIndex !== -1) {
                  const totalStages = stages.length;
                  const completedStages = projectStages.filter((stage) => stage.status === "Completed");
                  const completedStageIndex = completedStages.length - 1;

                  const completedWidth = ((completedStageIndex + 1) / totalStages) * 100;
                  const inProgressWidth = 100 / totalStages;
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
  }, [projectCode, refresh]); 
  const handleRefreshClick = () => {
    setRefresh((prev) => !prev);  // Toggle the refresh state to trigger the effect
  };
  const [deliverables, setDeliverables] = useState([]);

  useEffect(() => {
    fetch("https://rhythm-forge-api.vercel.app/api/deliverables")
      .then((res) => res.json())
      .then((data) => {
        if (data.deliverables) {
          setDeliverables(data.deliverables);
        }
      })
      .catch((error) => console.error("Error fetching deliverables:", error));
  }, []);

  // Function to process Overdue and Completed projects
  const getProjectData = () => {
    const overdueProjects = {};
    const completedProjects = {};

    deliverables.forEach((item) => {
      const { projectCode, stage, status, endDate, teamMembers, currentAssignee } = item;

      // Determine Assignee (if available, else take first team member, else "Unassigned")
      let assignee = currentAssignee
        ? currentAssignee
        : teamMembers.length > 0
        ? teamMembers[0].name
        : "Unassigned";

      // Handling Overdue (Latest Pending Stage)
      if (status === "In-Progress" || status === "Pending") {
        if (!overdueProjects[projectCode] || new Date(endDate) > new Date(overdueProjects[projectCode].dueBy)) {
          overdueProjects[projectCode] = {
            project: projectCode,
            assignee,
            dueBy: endDate.split("T")[0], // Format date
          };
        }
      }

      // Handling Completed (Last Completed Stage)
      if (status === "Completed") {
        if (!completedProjects[projectCode] || new Date(endDate) > new Date(completedProjects[projectCode].completedOn)) {
          completedProjects[projectCode] = {
            project: projectCode,
            assignee,
            completedOn: endDate.split("T")[0], // Format date
          };
        }
      }
    });

    return { overdue: Object.values(overdueProjects), completed: Object.values(completedProjects) };
  };

  const { overdue, completed } = getProjectData();
 
  return (
    <div className="Emphome-main">
<Empsharedlayout />
<div className="main-Emphomecontainer">
<div className="left-box-Emphome">
  <p className="Status-emp">My Projects</p>
  {/* Overdue List */}
  <div className="Overdue-list">
    <h3>Overdue</h3>
    <table className="project-table">
      <thead>
        <tr>
          <th>Project</th>
          <th>Assignee</th>
          <th>Due by</th>
        </tr>
      </thead>
      <tbody>
            {overdue.length > 0 ? (
              overdue.map((proj, index) => (
                <tr key={index}>
                  <td>{proj.project}</td>
                  <td>{proj.assignee}</td>
                  <td>{proj.dueBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Overdue Projects</td>
              </tr>
            )}
          </tbody>
    </table>
    <button className="view-all-button">View All</button>
  </div>
  {/* Completed List */}
  <div className="Completed-list">
    <h3>Completed</h3>
    <table className="project-table">
      <thead>
        <tr>
          <th>Project</th>
          <th>Assignee</th>
          <th>Completed on</th>
        </tr>
      </thead>
      <tbody>
            {completed.length > 0 ? (
              completed.map((proj, index) => (
                <tr key={index}>
                  <td>{proj.project}</td>
                  <td>{proj.assignee}</td>
                  <td>{proj.completedOn}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Completed Projects</td>
              </tr>
            )}
          </tbody>
    </table>
    <button className="view-all-button">View All</button>
  </div>

</div>
  {/* Middle Section */}
<div className="middle-section">
{/* Description Box */}
<div className="description-box">
  {/* Horizontal Status Bar */}
  <p className="Status-emp">Currently Viewing: {projectCode}</p>
{/* Horizontal Status Bar */}
<div className="status-bar">
    <b>Current Project Stage:<span className="refresh-btn" onClick={handleRefreshClick}> <i class="fa fa-refresh" aria-hidden="true"></i></span></b>
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
<p>
{description}</p>   <div className="description-features">
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
<select className="priority-dropdown">
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
<span>{modifiedDate ? modifiedDate : "Not modified yet"}</span>
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
  <div className="right-box-Emphome">
<p className="main-Owner">MANAGED BY</p>
<div className="Owner">
  <Link to="#">
    <i className="bx bxs-user-detail"></i> John Doe, HCLTech
  </Link>
</div>
<p className="main-Links">QUICK LINKS</p>
<div className="form-group">
  {/* Assignee Display (Read-Only) */}
<label>Assignee: <span className="tooltipregister">
      <i className="fa fa-info-circle"></i>
      <span className="tooltipregister-text1">
        Assignee are set by your Lead!
      </span></span></label>
<div style={{ backgroundColor: "#f0f0f0", padding: "5px", borderRadius: "4px", color: "#808080" }}>
{assignees.map((member) => member.name).join(", ") || "No Assignee"}
</div>
</div>
<div className="form-group">
  {/* Current Stage Dropdown */}
  <label>Current Stage:</label>
  <select
    value={currentStage}
    onChange={(e) => updateStage(e.target.value)}
  >
    <option value="">Select Stage</option>
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
      <option key={index} value={stage}>
        {stage}
      </option>
    ))}
  </select>
</div>
{/* Status Label */}
<div className="form-group">
<label>Status:</label>
<select
value={status}
onChange={(e) => updateStatus(e.target.value)}
style={{
  padding: "5px",
  borderRadius: "4px",
}}>
<option value="Pending">Pending</option>
<option value="In Progress">In Progress</option>
<option value="Completed">Completed</option>
</select>
</div>
<div className="date-selection">
<label htmlFor="startDate"><strong>Start Date:</strong></label>
<input 
type="date" 
id="startDate" 
value={startDate} 
onChange={(e) => setStartDate(e.target.value)}
/>
<label htmlFor="endDate"><strong>End Date:</strong></label>
<input 
type="date" 
id="endDate" 
value={endDate} 
onChange={(e) => setEndDate(e.target.value)}/>
<button className="update-date" onClick={updateStageDates}>Update Dates</button>
</div>
<div className="form-group">
  {/* Priority Dropdown */}
  <label>Priority set by business</label>
  <select
value={priority}
onChange={(e) => setPriority(e.target.value)}>
<option value="">Select Priority</option>
{[
"High",
"Medium",
"Low",
].map((priorityOption, index) => (
<option key={index} value={priorityOption}>
{priorityOption}
</option>
))}
</select>
</div>
</div>
</div>
<ChatWidget />
    </div>
  );
};

export default EmpHomepage;
