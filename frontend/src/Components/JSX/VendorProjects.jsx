import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Styles/VendorHomepage.css";
import Vendorsharedlayout from "./Vendorsharedlayout";

const VendorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [stageData, setStageData] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [projectCodes, setProjectCodes] = useState([]);
  const [rejectPopup, setRejectPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(null);

  useEffect(() => {
    const fetchProjectCodes = async () => {
      try {
        const response = await axios.get("https://rhythm-forge-api.vercel.app/api/projects");
        setProjectCodes(response.data.map((project) => project.projectCode));
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };

    fetchProjectCodes();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchStageData = async () => {
        try {
          const response = await axios.get(`https://rhythm-forge-api.vercel.app/api/projects/${selectedProject}`);
          const stages = response.data.stages.map((stage) => ({
            ...stage,
            selectedAction: stage.selectedAction || "Actions", // Default value
            completed: stage.completed || false,
            endDate: stage.endDate || "Not Available", // Handle endDate dynamically
          }));
          setStageData(stages);
        } catch (error) {
          console.error("Error fetching stage data:", error);
        }
      };

      fetchStageData();
    }
  }, [selectedProject]);

  const handleApprove = async (stage, index) => {
    if (stage.status === "Completed") {
      alert("You cannot approve this stage as it is already completed.");
      return;
    }
    if (stage.status === "In-Progress") {
      alert("Stage has already been approved by you.");
      return;
    }
  
    if (!selectedProject || !stage.stage) {
      console.error("Selected project or stage is missing.");
      return;
    }
    if (isProjectClosed()) {
      alert(
        "This project has been closed, you cannot Approve/Reject anymore. Please raise a new request through the request creation page."
      );
      return;
    }
  
    try {
      // Log the data being sent for debugging
      console.log("Approving stage:", {
        selectedProject,
        stage: stage.stage,
      });
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
const token = userDetails ? userDetails.jwtToken : null;
console.log("Extracted Token:", token);
      if (!token) {
        alert("Authorization token not found. Please log in.");
        return;
      }
      // Make the API call to update the stage status
      const response = await axios.patch(
        `https://rhythm-forge-api.vercel.app/api/projects/${selectedProject}/stages/${stage.stage}`,
        { status: "In-Progress" },
        {
          headers: {
            Authorization: `${token}`, // Add the token to the Authorization header
          },
        }
      );
  
      console.log("API Response:", response.data);
  
      // Update the local state with the new status
      const updatedStages = [...stageData];
      updatedStages[index].status = "In-Progress";
      setStageData(updatedStages);
    } catch (error) {
      console.error("Error approving stage:", error);
    }
  };
  const [pendingRejection, setPendingRejection] = useState(null);

  const handleRejectPopup = (index) => {
    const stage = stageData[index];
    if (stage.status === "Completed") {
      alert("You cannot reject this stage as it is already completed.");
      return;
    }
    if (isProjectClosed()) {
      alert(
        "This project has been closed, you cannot Approve/Reject anymore. Please raise a new request through the request creation page."
      );
      return;
  }
  setCurrentStageIndex(index);
  setRejectPopup(true);
};
  const handleProceedReject = () => {
    setPendingRejection({
      stage: stageData[currentStageIndex]?.stage,
      index: currentStageIndex,
    }); // Save rejection details
    setRejectPopup(false); // Close the reject popup
    setSuccessPopup(true); // Show the success confirmation popup
  };
  
  const handleConfirmReject = async () => {
    if (!pendingRejection) {
      console.error("No pending rejection details found.");
      return;
    }
  
    try {
      // Retrieve the token for authentication
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
const token = userDetails ? userDetails.jwtToken : null;
console.log("Extracted Token:", token);
      if (!token) {
        alert("Authorization token not found. Please log in.");
        return;
      }
      // Prepare the payload
      const rejectionPayload = {
        status: "Rejected", // Explicitly set the status
      };
  
      console.log("Reject Request Data:", rejectionPayload);
  
      // API call to update the stage status
      const response = await axios.patch(
        `https://rhythm-forge-api.vercel.app/api/projects/${selectedProject}/stages/${stageData[currentStageIndex]?.stage}`,
        rejectionPayload,
        {
          headers: {
            Authorization: `${token}`, // Include token in the request
          },
        }
      );
      
      if (response.status === 200) {
        const updatedProject = response.data.project; // Get updated project details
        console.log("API Response:", updatedProject);
  
        // Update local state based on the backend response
        setStageData(updatedProject.stages);
  
        setRejectPopup(false); // Close the rejection popup
        setSuccessPopup(true); // Show success confirmation popup
  
        console.log("Stage rejected and updated successfully!");
      } else {
        console.error("Unexpected response from API:", response);
      }
    } catch (error) {
      console.error("Error rejecting stage:", error);
      alert("An error occurred while rejecting the stage. Please try again.");
    } finally {
      setPendingRejection(null); // Clear the pending rejection details
      setSuccessPopup(false); // Close the success popup after clicking "OK"
    }
  };
  const isProjectClosed = () => {
    return stageData.some((stage) => stage.status === "Rejected");
  };

  return (
    <div>
      <main className="vendor-projects">
        <Vendorsharedlayout />
        <label>
          <h3><strong>Track My Projects:</strong></h3>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select Project Code</option>
            {projectCodes.map((code, index) => (
              <option key={index} value={code}>{code}</option>
            ))}
          </select>
        </label>

        {stageData && (
          <div className="stages-section">
            <h2>Project Stages</h2>
            <table className="stages-table">
              <thead>
                <tr>
                  <th>STAGE</th>
                  <th>STATUS</th>
                  <th>END DATE</th> {/* Added end date column */}
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {stageData.map((stage, index) => (
                  <tr key={index}>
                    <td>{stage.stage}</td>
                    <td>{stage.status}</td>
                    <td>{stage.endDate}</td> {/* Dynamically displaying end date */}
                    <td>
                      {["Review", "Approval", "UAT"].includes(stage.stage) && (
                        <button
                          className="action-btn"
                          onClick={() => handleApprove(stage, index)}
                          disabled={stage.status === "In-Progress"}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="action-btn"
                        onClick={() => handleRejectPopup(index)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reject Confirmation Popup */}
        {rejectPopup && (
          <div className="popup-overlay">
            <div className="rejection-popup">
              <h3>Are you sure?</h3>
              <p>
                Rejection at this stage is possible, the cost incurred up to this
                stage will still be considerable.
              </p>
              <button className="proceed-btn" onClick={handleProceedReject}>
                Proceed
              </button>
              <button
                className="cancel-btn"
                onClick={() => setRejectPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {successPopup && (
          <div className="popup-overlay">
            <div className="rejection-popup">
              <h3>Stage Rejected Successfully!</h3>
              <button className="close-popup" onClick={() => setSuccessPopup(false)}>
                &times;
            </button>
              <button className="ok-btn" onClick={handleConfirmReject}>
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorProjects;
