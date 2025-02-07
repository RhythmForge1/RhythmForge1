import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, navigate } from "react-router-dom";
import "../Styles/EmployeesPage.css";
import Internalsharedlayout from "./Internalsharedlayout";

const EmployeesPage = () => {
  const [members, setMembers] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [assignData, setAssignData] = useState({
    team: "",
    project: "",
  });
  const navigate = useNavigate(); // Updated hook
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const memberListRef = useRef(null);
  useEffect(() => {
    // Fetch members on page load
    fetchMembers();
  }, []);
  useEffect(() => {
    const fetchTeamsAndProjects = async () => {
      try {
        const [teamsResponse, projectsResponse] = await Promise.all([
          axios.get("https://rhythm-forge-api.vercel.app/api/get-teams"), // Adjust endpoint
          axios.get("https://rhythm-forge-api.vercel.app/api/projects"), // Adjust endpoint
        ]);
        console.log("Projects Response:", projectsResponse.data);

        // Map projects to extract relevant fields for the dropdown
        const projectsData = projectsResponse.data.map((project) => ({
          _id: project._id, 
          projectCode: project.projectCode
        }));
        setTeamsList(teamsResponse.data); // Example response: [{_id: "1", name: "HCL Dev"}]
        setProjectsList(projectsResponse.data); // Example response: [{_id: "2", name: "SAND"}]
      } catch (error) {
        console.error("Error fetching teams/projects:", error);
      }
    };
  
    fetchTeamsAndProjects();
  }, []);

  // Fetch employees from the backend
  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get("https://rhythm-forge-api.vercel.app/api/employees");
  //     setEmployees(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //     setLoading(false);
  //   }
  // };
   // Fetch members from the backend
   const fetchMembers = async () => {
    try {
      const response = await axios.get("https://rhythm-forge-api.vercel.app/api/users");
      console.log("Members Response:", response.data); // Log the response
  
      // Ensure the response is an array (check for 'users' array)
      if (Array.isArray(response.data.users)) {
        setMembers(response.data.users);  // Set the fetched users to the state
      } else {
        console.error("Error: Response data is not an array", response.data);
        setMembers([]);  // Default to an empty array if the response is not an array
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);  // In case of an error, default to an empty array
      setLoading(false);
    }
  };

  // Create new employee
  // const handleCreateEmloyee = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("https://rhythm-forge-api.vercel.app/api/employees/create", formData);
  //     alert(response.data.message);
  //     setFormData({ name: "", email: "", role: "" }); // Reset form
  //     setEmployees((prev) => [...prev, response.data.employee]); // Add new employee to list
  //     // Scroll to the employee list after successful creation
  //     if (employeeListRef.current) {
  //       employeeListRef.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //   } catch (error) {
  //     console.error("Error creating employee:", error);
  //     alert("Failed to create employee");
  //   }
  // };
// Create new user
const handleCreateUser = async (e) => {
  e.preventDefault();

  // Log formData to check if accessType is included
  console.log("Form Data Before Submit:", formData);

  const userFormData = {
    name: formData.name,
    email: formData.email,
    role: formData.role,
    userType: formData.userType,
    lineManagerEmail: formData.lineManagerEmail,
    sapId: formData.sapId,
    businessJustification: formData.businessJustification,
    accessType: formData.accessType,  // Ensure this line is correct
    projectCode: formData.projectCode,
    password: formData.password,
  };

  // Log the userFormData before sending the request
  console.log("User Form Data to be sent:", userFormData);

  try {
    const response = await axios.post("https://rhythm-forge-api.vercel.app/api/users", userFormData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.user) {
      alert(response.data.message);
      setFormData({
        name: "",
        email: "",
        role: "",
        userType: "",
        lineManagerEmail: "",
        sapId: "",
        businessJustification: "",
        accessType: "",
        projectCode: "",
        password: ""
      });

      setMembers((prev) => [...prev, response.data.user]);
      if (memberListRef.current) {
        memberListRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      console.error("Unexpected response format:", response.data);
      alert("Failed to create user. Invalid response format.");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    alert("Failed to create user");
  }
};

 // Assign teams/projects to employee
//  const handleAssignTeamsProjects = async (employeeId) => {
//     try {
//       // Use arrays directly without split()
//       const mappedTeams = assignData.team.map(
//         (teamId) => teamsList.find((team) => team._id === teamId)?._id
//       );
//       const mappedProjects = assignData.project.map(
//         (projectCode) =>
//           projectsList.find((project) => project.projectCode === projectCode)?._id
//       );
  
//       // Check for invalid mappings
//       if (mappedTeams.includes(undefined) || mappedProjects.includes(undefined)) {
//         alert("Invalid team or project selection.");
//         return;
//       }
  
//       const payload = { teams: mappedTeams, projects: mappedProjects };
//       console.log("Assigning Payload:", payload);
  
//       const response = await axios.patch(
//         `https://rhythm-forge-api.vercel.app/api/employees/${employeeId}/assign`,
//         payload
//       );
  
//       alert(response.data.message);
//       setAssignData({ team: [], project: [] }); // Reset to empty arrays
//       setSelectedEmployeeId(null);
//     } catch (error) {
//       console.error("Error assigning teams/projects:", error.response?.data || error.message);
//       alert("Failed to assign teams/projects.");
//     }
//   };
//   if (loading) return <p>Loading...</p>;
  // Assign teams/projects to member
  const handleAssignTeamsProjects = async (userId) => {
    try {
      // Map the selected team and project IDs using the correct logic
      const mappedTeams = assignData.team.map(
        (teamId) => teamsList.find((team) => team._id === teamId)?._id
      );
      const mappedProjects = assignData.project.map(
        (projectCode) =>
          projectsList.find((project) => project.projectCode === projectCode)?._id
      );
  
      // Check for invalid mappings (if any team or project is not found)
      if (mappedTeams.includes(undefined) || mappedProjects.includes(undefined)) {
        alert("Invalid team or project selection.");
        return;
      }
  
      // Construct payload with the mapped teams and projects
      const payload = { teams: mappedTeams, projects: mappedProjects };
      console.log("Assigning Payload:", payload);
  
      // Make the API call to assign teams and projects to the user
      const response = await axios.put(
        `https://rhythm-forge-api.vercel.app/api/users/${userId}/assign`,
        payload
      );
  
      // Show success message and reset the form
      alert(response.data.message);
      setAssignData({ team: [], project: [] }); // Reset selected teams and projects
      setSelectedMemberId(null); // Deselect member
    } catch (error) {
      console.error("Error assigning teams/projects:", error.response?.data || error.message);
      alert("Failed to assign teams/projects.");
    }
  };


  return (

    <div className="Emp-main">
            <div>
            <Internalsharedlayout />
        </div>
      <h2>RESOURCE MANAGEMENT</h2>
<div className="Emp-main-form">
      {/* Employee Creation Form */}
      <div className="Emp-form">
        <h3><strong>Add a New Employee</strong></h3>
        <form onSubmit={handleCreateUser}>
  <label>Name:</label>
  <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    required
  />
  
  <label>Email:</label>
  <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    required
  />
  
  <label>Role:</label>
  <input
    type="text"
    value={formData.role}
    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
    required
  />
  
  <label>User Type:</label>
  <select
    value={formData.userType}
    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
    required>
    <option value="Internal">Internal</option>
    <option value="Vendor">Vendor</option>
  </select>
  
  <label>Line Manager Email:</label>
  <input 
  type="email"
    value={formData.lineManagerEmail}
    onChange={(e) => setFormData({ ...formData, lineManagerEmail: e.target.value })}
    required
  />
  
  <label>SAP ID (only for Internal users):</label>
  <input
    type="text"
    value={formData.sapId}
    onChange={(e) => setFormData({ ...formData, sapId: e.target.value })}
    disabled={formData.userType !== "Internal"}
  />
  
  <label>Business Justification (only for Internal users):</label>
  <textarea
    value={formData.businessJustification}
    onChange={(e) => setFormData({ ...formData, businessJustification: e.target.value })}
    disabled={formData.userType !== "Internal"}
  />
<label>Access Type:</label>
    <input
      type="text"
      value={formData.accessType}
      onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
      required
    />
  
  <label>Project Code:</label>
  <input
    type="text"
    value={formData.projectCode}
    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
    required
  />
  
  <label>Password:</label>
  <input
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    required
  />
  
  <button type="submit">Create User</button>
</form>
      </div>
      <div className="Emp-form-info">
        As a Resource Manager, You can add new Employee, Assign them to a Team and project within HCL, please ensure to plan the Employee details accurately. 
      </div>
      </div>

      {/* Employees List */}
      <div ref={memberListRef} className="Emp-table-container">
  <h3><strong>Employees in the Org.</strong></h3>
  <table className="Emp-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Project Code</th>
        <th>Total Points</th>
        <th>User Type</th>
        <th>Level</th>
        <th>Badges</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(members) && members.length > 0 ? (
        members.map((member) => (
          <tr key={member._id}>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.role}</td>
            <td>{member.projectCode}</td>
            <td>{member.totalPoints}</td>
            <td>{member.userType}</td>
            <td>{member.level}</td>
            <td>{member.badges.join(", ") }</td>
            <td>
              <button onClick={() => setSelectedMemberId(member._id)}>
                Assign Teams & Projects
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7">No members available</td> {/* Updated colspan to match the number of columns */}
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* Assign Teams/Projects Form */}

 {/* Assign Teams/Projects Form */}
<div className="Emp-assign-form">
  <h3>Assign Teams and Projects</h3>
  {selectedMemberId ? (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Team Selection */}
      <label>Select a Team:</label>
      <select
        multiple
        value={assignData.team}
        onChange={(e) =>
          setAssignData({
            ...assignData,
            team: Array.from(e.target.selectedOptions, (option) => option.value),
          })
        }
      >
        {teamsList.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>

      {/* Project Selection */}
      <label>Select a Project:</label>
      <select
        multiple
        value={assignData.project}
        onChange={(e) =>
          setAssignData({
            ...assignData,
            project: Array.from(e.target.selectedOptions, (option) => option.value),
          })
        }
      >
        {projectsList.map((project) => (
          <option key={project._id} value={project.projectCode}>
            {project.projectCode}
          </option>
        ))}
      </select>

      {/* Assign Button */}
      <button onClick={() => handleAssignTeamsProjects(selectedMemberId)}>
        Assign
      </button>
    </form>
  ) : (
    <p>Please select an employee to assign teams/projects.</p>
  )}
</div>
    </div>
  
  );
};

export default EmployeesPage;
