import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectDetails = ({ projectCode }) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        const token = userDetails ? userDetails.jwtToken : null;
        const response = await axios.get(`https://rhythm-forge-api.vercel.app/api/projects/${projectCode}`, {
          headers: {
            Authorization: `${token}`, 
          },
        });

        const data = response.data;

        // Extract necessary fields
        const approvalStatus = data.stages.find(stage => stage.stage === "Approval")?.status || "Pending";
        const modifiedDate = data.stages
          .filter(stage => stage.status === "Completed")
          .map(stage => stage.endDate)
          .pop() || "Not modified yet"; // Get latest completed stage endDate

        setProjectData({
          description: data.detailedDescription,
          approvalStatus,
          sprintPriority: data.severity,
          createdDate: new Date(data.createdAt).toLocaleDateString(),
          deliveryDate: new Date(data.expectedDate).toLocaleDateString(),
          modifiedDate: modifiedDate !== "Not modified yet" ? new Date(modifiedDate).toLocaleDateString() : modifiedDate,
        });
      } catch (error) {
        setError("Failed to fetch project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (projectCode) fetchProjectDetails();
  }, [projectCode]);

  if (!project) return <p>Loading...</p>;

  // Extract necessary fields from API response
  const description = project.detailedDescription;
  const approvalStage = project.stages.find((stage) => stage.stage === "Approval");
  const approvalStatus = approvalStage ? approvalStage.status : "Pending";

  const sprintPriority = project.severity;

  const createdDate = new Date(project.createdAt).toLocaleDateString();
  const deliveryDate = new Date(project.expectedDate).toLocaleDateString();

  // Get the latest completed stage for "Modified On"
  const completedStages = project.stages.filter((stage) => stage.status === "Completed");
  const latestCompletedStage = completedStages.length
    ? completedStages[completedStages.length - 1]
    : null;
  const modifiedDate = latestCompletedStage ? new Date(latestCompletedStage.endDate).toLocaleDateString() : "Not modified yet";

  return (
    <div>
      {/* Project Description */}
      <div className="description-content">
        <p>{description}</p>
      </div>

      {/* Approval Status */}
      <div className="approval-status">
        <h6 className="approval-header">Approval Status</h6>
        <select className="approval-dropdown" value={approvalStatus.toLowerCase()}>
          <option value="completed">🟢 Approved</option>
          <option value="pending">🟠 Pending</option>
          <option value="rejected">🔴 Rejected</option>
        </select>
      </div>

      {/* Sprint Priority */}
      <div className="priority-indicator">
        <h6 className="priority-header">Sprint Priority</h6>
        <select className="priority-dropdown" value={sprintPriority.toLowerCase()}>
          <option value="high">🔺 High</option>
          <option value="medium">🔼 Medium</option>
          <option value="low">🔽 Low</option>
          <option value="severe">⛔ Severe</option>
        </select>
      </div>

      {/* Dates Section */}
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
  );
};

export default ProjectDetails;
