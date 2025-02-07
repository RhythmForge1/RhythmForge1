import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Styles/InternalHomepage.css"; 
import { FaShareAlt, FaUserPlus, FaFolder } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import ChatWidget from "../JSX/chatwidget.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'


ChartJS.register(ArcElement, Tooltip, Legend);

const InternalHomepage = () => {
    const [projectCode, setProjectCode] = useState(null);
   const [showAttentionPopup, setShowAttentionPopup] = useState(false);
  const [filteredAttachments, setFilteredAttachments] = useState([]); // Holds attachments for selected project
  const [attachments, setAttachments] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTaskSection, setSelectedTaskSection] = useState("overview");
  const [projectPopup, setProjectPopup] = useState(null); // For project details popup
  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [backlogProjects, setBacklogProjects] = React.useState([]);
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]); // Stores the list of teams
  const [formData, setFormData] = useState({
    name: "",
    projectCode: [],
    size: "",
    projectsInProgress: "",
    projectsClosed: "",
    valueAdds: "",
    escalations: "",
  }); // Stores the new team form data
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState("");
  const [projectCodes, setProjectCodes] = useState([]); 
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    // Fetch project codes from API
    axios
      .get("https://rhythm-forge-api.vercel.app/api/projects")
      .then((response) => {
        setProjectCodes(response.data.map((project) => project.projectCode)); // Extract only project codes
      })
      .catch((error) => {
        console.error("Error fetching project codes:", error);
      });
  }, []);
   // Fetch teams from the backend
   const fetchTeams = async () => {
    try {
      const response = await axios.get("https://rhythm-forge-api.vercel.app/api/get-teams");
      setTeams(response.data.slice(0, 5)); // Display only up to 3 teams
    } catch (err) {
      console.error("Error fetching teams:", err.message);
    }
  };
    // Fetch data on component mount
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          // Fetch project details (Stages, Status, Severity, Date)
          const projectResponse = await fetch("https://rhythm-forge-api.vercel.app/api/projects");
          const projectData = await projectResponse.json();
    
          // Updated projects with team size based on 'members' count
          const updatedProjects = projectData.map(project => {
            // Get team size from the 'members' array length
            const teamSize = project.members && project.members.length > 0 ? project.members.length : "N/A";
    
            return { ...project, teamSize };
          });
    
          setProjects(updatedProjects);
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
    
      fetchProjects();
    }, []);

    const getLatestStage = (stages) => {
      if (!stages || stages.length === 0) return null; // Handle empty or undefined stages array
    
      // Find the index of the last completed stage
      let completedStageIndex = stages
        .map(stage => stage.status)
        .lastIndexOf("Closed") || 
        stages.map(stage => stage.status).lastIndexOf("Rejected") || 
        stages.map(stage => stage.status).lastIndexOf("Completed");
    
      // Slice stages after the last completed one
      let validStages = completedStageIndex !== -1 ? stages.slice(completedStageIndex + 1) : stages;
    
      // Find the latest stage based on the given statuses
      let latestStage = validStages.find(stage => 
        ["In-Progress", "Pending", "Closed"].includes(stage.status)
      );
    
      return latestStage || stages[stages.length - 1] || null; // Return latest valid stage or last stage if none found
    };

    const toggleExpand = (projectId) => {
      setExpandedProject((prev) => (prev === projectId ? null : projectId));
    };
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
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prevState) => ({
      ...prevState,
      projectCode: selectedOptions, // Assign an array of selected values
    }));
  };
  React.useEffect(() => {
    // Fetch backlog projects (where all stages are pending)
    const fetchBacklogData  = async () => {
      try {
        const projectsResponse = await fetch('https://rhythm-forge-api.vercel.app/api/projects'); // Replace with the actual projects API endpoint
        const projectsData = await projectsResponse.json();
  
        const teamsResponse = await fetch('https://rhythm-forge-api.vercel.app/api/get-teams'); // Replace with the actual teams API endpoint
        const teamsData = await teamsResponse.json();
  
        // Filter projects where all stages are pending
        const pendingProjects = projectsData.filter(project =>
          project.stages.every(stage => stage.status === 'Pending')
        );
         // Map projects to their assigned teams
      const backlogWithTeams = pendingProjects.map(project => {
        const assignedTeam = teamsData.find(team =>
          team.projectCode.includes(project.projectCode)
        )?.name || 'Unassigned';

        // Calculate date difference (days)
        const createdAt = new Date(project.createdAt);
        const today = new Date();
        const timeDifference = today - createdAt; // Difference in milliseconds
        const dueByDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

        return { ...project, assignedTeam, dueByDays };
      });
  
        setBacklogProjects(backlogWithTeams);
      } catch (error) {
        console.error('Error fetching backlog projects:', error);
      }
    };
  
    fetchBacklogData ();
  }, []);
  // Add a new team
  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://rhythm-forge-api.vercel.app/api/add-team", formData);
      setTeams([...teams, response.data.team].slice(0, 5)); // Add the new team and limit to 3
      setFormData({
        name: "",
        projectCode: [],
        size: "",
        projectsInProgress: "",
        projectsClosed: "",
        valueAdds: "",
        escalations: "",
      });
      setFormVisible(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding team");
    }
  };

  // Fetch teams on component load
  useEffect(() => {
    fetchTeams();
  }, []);
  const [messages, setMessages] = useState([
    {
      sender: "John Doe",
      text: "This is the first message in the discussion.",
      timestamp: "2024-11-28 10:00 AM",
    },
    {
      sender: "You",
      text: "Thanks for the update.",
      timestamp: "2024-11-28 10:10 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [discussionStopped, setDiscussionStopped] = useState(false);
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { sender: "You", text: newMessage, timestamp: new Date().toLocaleString() },
      ]);
      setNewMessage("");
    }
  };
  const toggleDiscussion = () => {
    setDiscussionStopped((prev) => !prev);
  };
  const replyToMessage = (message, replyAll) => {
    const prefix = replyAll ? "Replying to All: " : `Replying to ${message.sender}: `;
    setNewMessage(prefix);
  };
  const today = new Date();
  // Helper function to calculate overdue days
  const calculateOverdueDays = (dueDate) => {
    const dateDiff = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    return dateDiff > 0 ? dateDiff : 0;
  };
  const dataByMonth = {
    January: { completed: 12, inProgress: 5, overdue: 3 },
    February: { completed: 15, inProgress: 7, overdue: 2 },
    March: { completed: 8, inProgress: 10, overdue: 6 },
  };
  const StatusSection = () => {
    const [selectedMonth, setSelectedMonth] = useState("January");
    const [selectedYear, setSelectedYear] = useState("2024");  
  };
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  // Fetch data based on the selected month
  const currentData = dataByMonth[selectedMonth];
  const pieData = {
    labels: ["Completed", "In Progress", "Overdue"],
    datasets: [
      {
        data: [currentData.completed, currentData.inProgress, currentData.overdue],
        backgroundColor: ["#4CAF45", "#FF9800", "#F44336"],
      },
    ],
  };

  const openProjectPopup = (project) => {
    setSelectedProject(project);
  };
  const closeProjectPopup = () => {
    setSelectedProject(null);
  };

const handleAttachmentUpload = async (category) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "*/*"; // Accept all file types
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("projectId", selectedProject.id);

    try {
      const response = await fetch("https://rhythm-forge-api.vercel.app/api/attachments/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload attachment");
      }

      const newAttachment = await response.json();
      setAttachments((prev) => [...prev, newAttachment]); // Update state with new file
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  fileInput.click();
};
const handleAttachmentDelete = async (category) => {
  const attachmentToDelete = attachments.find((att) => att.category === category);
  if (!attachmentToDelete) return;

  try {
    const response = await fetch(`https://rhythm-forge-api.vercel.app/api/attachments/${attachmentToDelete._id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete attachment");
    }

    setAttachments((prev) => prev.filter((att) => att._id !== attachmentToDelete._id)); // Remove from state
  } catch (error) {
    console.error("Error deleting attachment:", error);
  }
};
 // Fetch attachments from API
 useEffect(() => {
  fetch("https://rhythm-forge-api.vercel.app/api/attachments")
    .then((response) => response.json())
    .then((data) => setAttachments(data || [])) // Ensuring it is always an array
    .catch((error) => console.error("Error fetching attachments:", error));
}, []);

const handleAttachmentPopup = (project) => {
  setSelectedProject(project);
  
  fetch(`https://rhythm-forge-api.vercel.app/api/attachments/${project.projectId}`)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setAttachments(data); // Ensure data is an array before setting state
      } else {
        console.error("Unexpected data format:", data);
        setAttachments([]); // Set empty array to prevent undefined issues
      }
    })
    .catch((error) => {
      console.error("Error fetching attachments:", error);
      setAttachments([]); // Prevent undefined state
    });

  setIsPopupOpen(true);
};

const handleClosePopup = () => {
  setIsPopupOpen(false);
  setSelectedProject(null);
  setFilteredAttachments([]);
};

const handleDelete = (id) => {
  fetch(`https://rhythm-forge-api.vercel.app/api/attachments/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then(() => {
      setAttachments(attachments.filter((att) => att._id !== id));
    })
    .catch((error) => console.error("Error deleting file:", error));
};
const handleShare = (filePath) => {
  const fileUrl = `https://rhythm-forge-api.vercel.app/${filePath}`;
  navigator.clipboard.writeText(fileUrl)
    .then(() => alert("Link copied to clipboard!"))
    .catch((err) => console.error("Error copying link:", err));
};

  return (
    <div className="internal-homepage">
      {/* Header */}
      <header className="header1">
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
          <button className="icon-button1">
            <i className="fa fa-exchange" aria-hidden="true"></i> Switch User
          </button>
          <button className="icon-button1" onClick={() => navigate("/Profile")}>
            <i className="fa fa-user" aria-hidden="true"></i> Profile
          </button>
        </div>
      </header>
      {/* Navbar 1 */}
      <nav className="navbar1" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <div className="nav-left">
        <button onClick={() => navigate("/EmployeesPage")}>Resources</button>
        <button onClick={() => navigate("/Deliverables")}>Deliverables</button>
          <button onClick={() => navigate("/EmpEngagement")}>Employee Engagement</button>
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
      {/* Main Content */}
      <div className="main-content">
        {/* Tasks Section */}
        <section className="tasks-section">
          <header className="tasks-header">
            <button
              className={selectedTaskSection === "overview" ? "active" : ""}
              onClick={() => setSelectedTaskSection("overview")}>
              Overview
            </button>
            <button
              className={selectedTaskSection === "timelines" ? "active" : ""}
              onClick={() => setSelectedTaskSection("timelines")}>
              Timelines
            </button>
            <button
              className={selectedTaskSection === "repository" ? "active" : ""}
              onClick={() => setSelectedTaskSection("repository")}>
              Repository
            </button>
            <button
              className={selectedTaskSection === "discussion" ? "active" : ""}
              onClick={() => setSelectedTaskSection("discussion")}>
              Discussion
            </button>
          </header>
          {/* Overview Section */}
          {selectedTaskSection === "overview" && (
            <div className="overview-section">
 <div className="overview-box team-overview">
      <h4>Team</h4>
      <div className="scrollable">
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <div
              className="team-header"
              onClick={(e) => {
                const content = e.currentTarget.nextElementSibling;
                content.style.maxHeight = content.style.maxHeight
                  ? null
                  : `${content.scrollHeight}px`;
              }}
            >
              {team.name}
            </div>
            <div className="team-content">
              <p>Current Team Size: {team.size}</p>
              <p>Projects allocated: {team.projectCode.join(", ")}</p>
              <p>Projects In-Progress: {team.projectsInProgress}</p>
              <p>Projects Closed: {team.projectsClosed}</p>
              <p>Value-Adds: {team.valueAdds}</p>
              <p>Escalations: {team.escalations}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Team Creation Form */}
      {teams.length < 5 && (
        <div className="team-form-container">
          <div
            className="add-team-header"
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? "Collapse Add Team Form" : "Click to Add New Team"}
          </div>
          {formVisible && (
            <form onSubmit={handleAddTeam} className="team-form">
              {error && <p className="error">{error}</p>}
              <input
                type="text"
                name="name"
                placeholder="Team Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
<select
  name="projectCode"
  value={formData.projectCode}
  onChange={handleSelectChange}
  multiple
  required
>
  <option value="" disabled>
    Select one or more projects
  </option>
  {projectCodes.map((code) => (
    <option key={code} value={code}>
      {code}
    </option>
  ))}
</select>
{formData.projectCode.length > 0 && (
  <div className="selected-projects">
    <p>Projects selected: {formData.projectCode.join(", ") || "None selected"}</p>
  </div>
)}
              <input
                type="number"
                name="size"
                placeholder="Team Size"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="projectsInProgress"
                placeholder="Projects In-Progress"
                value={formData.projectsInProgress}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="projectsClosed"
                placeholder="Projects Closed"
                value={formData.projectsClosed}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="valueAdds"
                placeholder="Value-Adds"
                value={formData.valueAdds}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="escalations"
                placeholder="Escalations"
                value={formData.escalations}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Add Team</button>
            </form>
          )}
        </div>
      )}
    </div>
    <div className="overview-box in-progress-overview">
  <h4>In Progress</h4>
  <div className="in-progress-scrollable">
    {projects.length === 0 ? (
      <p>No projects found.</p>
    ) : (
      projects.map((project) => {
        const latestStage = getLatestStage(project.stages);
        return (
          <div className="project-card" key={project._id}>
            <div
              className="project-header"
              onClick={() => toggleExpand(project._id)}
            >
              <p>
                <strong>Project:</strong> {project.projectCode}
              </p>
              <p>
                <strong>Team Size:</strong> {project.teamSize}
              </p>
            </div>
            <div
              className={`project-details ${
                expandedProject === project._id ? "expanded" : ""
              }`}
            >
              {expandedProject === project._id && latestStage && (
                <>
                  
                  <p><strong>Short Description:</strong>{project.shortDescription}</p>
                  <p>
                    <strong>Latest Stage:</strong> {latestStage.stage}
                  </p>
                  <p>
                    <strong>Status:</strong> {latestStage.status}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(latestStage.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(latestStage.endDate).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
</div>
<div className="overview-box backlog-overview">
    <h4>Backlog</h4>
    <div className="backlog-scrollable">
      {backlogProjects.length === 0 ? (
        <p>No projects in backlog.</p>
      ) : (
        backlogProjects.map(project => (
          <div className="backlog-card" key={project._id}>
            <div
              className="backlog-header"
              onClick={(e) => {
                const content = e.currentTarget.nextElementSibling;
                content.style.maxHeight = content.style.maxHeight ? null : `${content.scrollHeight}px`;
              }}
            >
              <span><strong>Project:</strong> {project.projectCode}</span>
              <span><strong>Due By:</strong> {project.dueByDays} days</span>
            </div>
            <div className="backlog-content">
              <p>
                <strong>Severity:</strong> {project.severity || 'Not Defined'}
              </p>
              <p>
                <strong>Assigned Team:</strong> {project.assignedTeam}
              </p>
              <p>
                <strong>Expected Date:</strong> {new Date(project.expectedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
            </div>
          )}
          {/* Timelines Section */}
          {selectedTaskSection === "timelines" && (
  <section className="timelines-section">
    <h4>Project Timelines</h4>
    <table className="project-table">
      <thead>
        <tr>
          <th>Project Code</th>
          <th>Start Date</th>
          <th>Due Date</th>
          <th>Overdue By</th>
          <th>Responsible Stage</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => {
          const completedStages = project.stages.filter(stage => stage.status === "Completed");
          const latestCompletedStage = completedStages[completedStages.length - 1];

          const pendingStages = project.stages.filter(stage => stage.status === "Pending");
          const latestPendingStage = pendingStages.length > 0 ? pendingStages[0] : null;

          const startDate = latestPendingStage ? new Date(latestPendingStage.startDate) : null;
          const dueDate = latestPendingStage ? new Date(latestPendingStage.endDate) : null;

          const today = new Date();
          const overdueDays = dueDate && today > dueDate 
            ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)) 
            : 0;

          return (
            <tr key={index} onClick={() => openProjectPopup(project)}>
              <td>{project.projectCode}</td>
              <td>{startDate ? startDate.toDateString() : "N/A"}</td>
              <td>{dueDate ? dueDate.toDateString() : "N/A"}</td>
              <td className={overdueDays > 0 ? "overdue" : "not-overdue"}>
                {overdueDays > 0 ? `${overdueDays} days` : "Not Overdue"}
              </td>
              <td>{latestPendingStage ? latestPendingStage.stage : "None"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </section>
)}
          {/* Project Popup */}
          {selectedProject && (
  <div className="project-popup">
    <div className="popup-content">
      <h3>PROJECT: {selectedProject.projectCode}</h3>
      <h4>Please refer to the below dates for stage progression</h4>
      
      <table className="stages-table">
        <thead>
          <tr>
            <th>Stage Name</th>
            <th>Planned Start</th>
            <th>Planned End</th>
            <th>Actual Start</th>
            <th>Actual End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedProject.stages.map((stage, index) => {
            const isCompleted = stage.status === "Completed";

            return (
              <tr key={index} className={isCompleted ? "completed" : "pending"}>
                <td>{stage.stage}</td>
                <td>{new Date(stage.startDate).toDateString()}</td>
                <td>{new Date(stage.endDate).toDateString()}</td>
                <td>{isCompleted ? new Date(stage.startDate).toDateString() : "N/A"}</td>
                <td>{isCompleted ? new Date(stage.endDate).toDateString() : "N/A"}</td>
                <td className={`status-indicator ${isCompleted ? "green" : "orange"}`}>
                  {isCompleted ? "Completed" : "In Progress"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={closeProjectPopup} className="close-button">
        Go Back
      </button>
    </div>
  </div>
)}
          {/* Repository Popup */}
          {selectedTaskSection === "repository" && (
  <section className="repository-section">
    <h4>Repository</h4>
    <table className="repository-table">
  <thead>
    <tr>
      <th>Project ID</th>
      <th>Stage Name</th>
      <th>Attachments</th>
      <th>Created At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {attachments && attachments.length > 0 ? (
      attachments.map((attachment) => (
        <tr key={attachment._id}>
          <td><strong>{attachment.projectId}</strong></td>
          <td>{attachment.stageName}</td>
          <td>
            <a href={`https://rhythm-forge-api.vercel.app/${attachment.filePath}`} target="_blank" rel="noopener noreferrer">
              {attachment.fileName}
            </a>
          </td>
          <td>{new Date(attachment.uploadedAt).toLocaleString()}</td>
          <td>
            <button onClick={() => handleDelete(attachment._id)}>🗑️</button>
            <a href={`https://rhythm-forge-api.vercel.app/${attachment.filePath}`} download={attachment.fileName}>
              📥
            </a>
            <button onClick={() => handleShare(attachment.filePath)}>📤</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5">No attachments found.</td>
      </tr>
    )}
  </tbody>
</table>
  </section>
)}
          {/* Discussion Section */}
          {selectedTaskSection === "discussion" && (
            <div className="discussion-section">
              <div className="discussion-forums">
                <h4>Discussion Forums</h4>
                <div className="forums-list">
                  {["Discussion-TeamA-TaskA123", "Discussion-TeamB-TaskB123", "Discussion-TeamC-TaskC123"].map(
                    (forum, index) => (
                      <div
                        key={index}
                        className="forum-item"
                        onClick={() => setSelectedForum(forum)}
                      >
                        {forum}
                      </div>
                    )
                  )}
                </div>
              </div>

              {selectedForum && (
                <div className="forum-details">
                  <div className="forum-header">
                    <h4>{selectedForum}</h4>
                    <button
                      onClick={() => setSelectedForum(null)}
                      className="close-forum"
                    >
                      Close
                    </button>
                  </div>
                  <div className="forum-info">
                    <p><strong>Started Date:</strong> 2024-01-01</p>
                    <p><strong>Modified Date:</strong> 2024-01-10</p>
                    <button className="view-attachments">View Attachments</button>
                    <p>
                      <strong>Participants:</strong> Active: 3, Currently Viewing: 2, Inactive: 5
                    </p>
                  </div>
                  <div className="chat-section">
                    <div className="chat-messages">
                      {messages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.sender === "You" ? "own" : ""}`}>
                          <p><strong>{message.sender}:</strong> {message.text}</p>
                          <small>{message.timestamp}</small>
                          <div className="message-actions">
                            <button onClick={() => replyToMessage(message, false)}>Reply 1:1</button>
                            <button onClick={() => replyToMessage(message, true)}>Reply All</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="chat-actions">
                      <textarea
                        className="chat-input"
                        placeholder="Write a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={discussionStopped}
                      />
                      <button className="send-message" onClick={sendMessage} disabled={discussionStopped}>
                        Post Message
                      </button>
                      <button
                        className="stop-discussion"
                        onClick={toggleDiscussion}
                      >
                        {discussionStopped ? "Re-start Discussion" : "Stop Discussion"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

   <div style={{ padding: "20px" }}>
    </div>
        </section>
        {/* Status Section */}
        <section className="status-section">
      <div className="status-box delivery-status">
        <h4 className="Delivery-header">Delivery State</h4>
        <div className="controls">
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>
          <select value={selectedYear} onChange={handleYearChange}>
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
          </select>
        </div>
        <div className="chart-container">
          <Pie data={pieData} />
        </div>
        <pre> 

        </pre>
        <div>
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
        </div>
        <ChatWidget />
      </div>
    </section>
      </div>
    </div>
  );
};

export default InternalHomepage;
