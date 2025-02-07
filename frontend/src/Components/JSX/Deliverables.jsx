import React, { useState, useEffect } from "react";
import "../Styles/Deliverables.css"; // Import the external CSS file
import Internalsharedlayout from "./Internalsharedlayout";

const Deliverables = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliverables, setDeliverables] = useState([]);
    const [filteredDeliverables, setFilteredDeliverables] = useState([]);
    const [filters, setFilters] = useState({
      projectCode: "",
      stage: "",
      status: "",
      startDate: "",
      endDate: "",
      actualStartDate: "",
      actualEndDate: "",
      teamMembers: "",
    });
  

  useEffect(() => {
    // Fetch all deliverables data from the backend
    const fetchDeliverables = async () => {
      try {
        const response = await fetch("https://rhythm-forge-api.vercel.app/api/deliverables"); // API endpoint for all deliverables
        if (!response.ok) {
          throw new Error("Failed to fetch deliverables");
        }
        const data = await response.json();
        setDeliverables(data.deliverables);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverables();
  }, []);

  // Handle input changes for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      filterDeliverables(newFilters);
      return newFilters;
    });
  };

  // Filter deliverables based on the filters
  const filterDeliverables = (filters) => {
    const filtered = deliverables.filter((deliverable) => {
      return (
        (filters.projectCode === "" || deliverable.projectCode.includes(filters.projectCode)) &&
        (filters.stage === "" || deliverable.stage.includes(filters.stage)) &&
        (filters.status === "" || deliverable.status.includes(filters.status)) &&
        (filters.startDate === "" ||
          new Date(deliverable.startDate).toLocaleDateString().includes(filters.startDate)) &&
        (filters.endDate === "" ||
          new Date(deliverable.endDate).toLocaleDateString().includes(filters.endDate)) &&
        (filters.actualStartDate === "" ||
          deliverable.actualStartDate.includes(filters.actualStartDate)) &&
        (filters.actualEndDate === "" ||
          deliverable.actualEndDate.includes(filters.actualEndDate)) &&
        (filters.teamMembers === "" ||
          deliverable.teamMembers.includes(filters.teamMembers))
      );
    });
    setFilteredDeliverables(filtered);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h6>Loading deliverables...</h6>
      </div>
    );
  }


  return (
    
    <div className="deliverables-container">
        <Internalsharedlayout />
        <div className="deliverables-main">
      <h2 className="page-title">All Deliverables</h2>
      {/* Filter Inputs */}
      <div className="filters">
          <input
            type="text"
            name="projectCode"
            placeholder="Filter by Project Code"
            value={filters.projectCode}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="stage"
            placeholder="Filter by Stage"
            value={filters.stage}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Filter by Status"
            value={filters.status}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="startDate"
            placeholder="Filter by Start Date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="endDate"
            placeholder="Filter by End Date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="actualStartDate"
            placeholder="Filter by Actual Start Date"
            value={filters.actualStartDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="actualEndDate"
            placeholder="Filter by Actual End Date"
            value={filters.actualEndDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="teamMembers"
            placeholder="Filter by Team Members"
            value={filters.teamMembers}
            onChange={handleFilterChange}
          />
        </div>

      <table className="deliverables-table">
        <thead>
          <tr>
            <th>Project Code</th>
            <th>Stage</th>
            <th>Status</th>
            <th>Planned Start Date</th>
            <th>Planned End Date</th>
            <th>Actual Start Date</th>
            <th>Actual End Date</th>
            <th>Team Members</th>
          </tr>
        </thead>
        <tbody>
            {filteredDeliverables.map((deliverable, index) => (
              <tr key={index}>
                <td>{deliverable.projectCode}</td>
                <td>{deliverable.stage}</td>
                <td
                  className={
                    deliverable.status === "Completed" ? "completed" : "pending"
                  }
                >
                  {deliverable.status}
                </td>
                <td>{new Date(deliverable.startDate).toLocaleDateString()}</td>
                <td>{new Date(deliverable.endDate).toLocaleDateString()}</td>
                <td>
                  {deliverable.actualStartDate === "Not Available"
                    ? "-"
                    : new Date(deliverable.actualStartDate).toLocaleDateString()}
                </td>
                <td>
                  {deliverable.actualEndDate === "Not Available"
                    ? "-"
                    : new Date(deliverable.actualEndDate).toLocaleDateString()}
                </td>
                <td>
  {deliverable.teamMembers.map((member, index) => (
    <div key={index}>{member.name}</div>
  ))}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Deliverables;
