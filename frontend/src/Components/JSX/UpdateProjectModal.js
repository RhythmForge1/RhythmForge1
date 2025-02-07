import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../Styles/VendorHomepage.css"

const customStyles = {
    content: {
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      backgroundColor: "white",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1050, // Ensure it is above other elements
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay to emphasize modal
      zIndex: 1040, // Ensure it covers the screen
    },
  };

const UpdateProjectModal = ({ isOpen, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(""); // Track selected project
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [projectCodes, setProjectCodes] = useState([]); // Store project codes

  // Fetch available projects when the modal opens
  useEffect(() => {
    const fetchProjectCodes = async () => {
      try {
        const response = await axios.get("https://rhythm-forge-api.vercel.app/api/projects");
        if (Array.isArray(response.data)) {
          const codes = response.data.map((project) => project.projectCode);
          setProjectCodes(codes);
        } else {
          console.error("Unexpected response format.");
        }
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };

    fetchProjectCodes();
  }, []);

  // Handle update request
  const handleUpdate = async () => {
    if (!selectedProject) {
      alert("Please select a project to update.");
      return;
    }
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const token = userDetails ? userDetails.jwtToken : null;
    if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }
    try {
      const response = await axios.patch(
        `https://rhythm-forge-api.vercel.app/api/projects/${selectedProject}/update`,        
        {
            shortDescription,
            detailedDescription,
            severity,
          },
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      alert(response.data.message);
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} ariaHideApp={false}>
      <h2>Update Project Details</h2>
      <div>
        <label>Select Project:</label>
        <select
          name="selectedProject"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          required
        >
          <option value="">-- Select a Project --</option>
          {projectCodes.map((code, index) => (
            <option key={index} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Short Description:</label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Enter short description"
        />
      </div>
      <div>
        <label>Detailed Description:</label>
        <textarea
          value={detailedDescription}
          onChange={(e) => setDetailedDescription(e.target.value)}
          placeholder="Enter detailed description"
        />
      </div>
      <div>
        <label>Severity:</label>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Select Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
      <button className="update-buttons" onClick={handleUpdate}>Update</button>
      <button className="update-buttons" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default UpdateProjectModal;
