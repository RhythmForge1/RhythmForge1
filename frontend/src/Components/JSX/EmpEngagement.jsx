import React, { useState, useEffect, useRef } from "react";
import "../Styles/EmpEngagement.css";
import { Link } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import GaugeComponent from "react-gauge-component";
import Internalsharedlayout from "./Internalsharedlayout";
import MilestoneModal from "./MilestoneModal.jsx";
const EmpEngagement = () => {
      const [members, setMembers] = useState([]);
      const [teamsList, setTeamsList] = useState([]);
      const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(true);
      const memberListRef = useRef(null);
    // Sample Data for Line Graph
    const employeeData = [
        "John Doe (ID: 001)",
        "Jane Smith (ID: 002)",
        "Emily Davis (ID: 003)",
        "Michael Brown (ID: 004)",
        "Chris Johnson (ID: 005)",
        "Jessica Wilson (ID: 006)",
        "David Lee (ID: 007)",
        "Sarah White (ID: 008)",
        "James Miller (ID: 009)",
        "Olivia Martin (ID: 010)",
    ];
  useEffect(() => {
    // Fetch members on page load
    fetchMembers();
  }, []);
    const projectData = ["Project A", "Project B", "Project C", "Project D", "Project E"];

    const [employeeSearch, setEmployeeSearch] = useState("");
    const [projectSearch, setProjectSearch] = useState("");

    const [employeeFocus, setEmployeeFocus] = useState(false);
    const [projectFocus, setProjectFocus] = useState(false);

    // Filtered employee list
    const filteredEmployees = employeeData.filter((employee) =>
        employee.toLowerCase().includes(employeeSearch.toLowerCase())
    );
    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          requestAnimationFrame(() => {
            // Your resizing logic here
            console.log("Resized:", entry.target);
          });
        }
      });
    // Filtered project list
    const filteredProjects = projectData.filter((project) =>
        project.toLowerCase().includes(projectSearch.toLowerCase())
    );

    // Sample Data for Line Graph
    const lineChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "Employee Engagement Rate",
                data: [85, 80, 75, 90, 88, 95, 92, 85, 87, 93, 91, 94],
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
            },
        ],
    };

    // Sample Data for Pie Charts
    const pieChartData1 = {
        labels: ["High", "Medium", "Low"],
        datasets: [
            {
                data: [60, 25, 15],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
            },
        ],
    };
    const pieChartData2 = {
        labels: ["High", "Medium", "Low"],
        datasets: [
            {
                data: [30, 15, 65],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
            },
        ],
    };
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
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

    return (
        <div className="emp-engagement-page">
<Internalsharedlayout />
<div className="emp-engagement-main">
            <div className="dropdown-section-eng">
            
                <div className="search-section">
                <button className="add-milestone" onClick={openModal}>Add Milestone</button>
                <MilestoneModal isOpen={isModalOpen} closeModal={closeModal} />
                </div>
                <div className="right-dropdowns-eng">
                    <div className="dropdown-eng">
                        <label>Set Goals:</label>
                        <select>
                            <option>Select Month</option>
                            {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                            ].map((month) => (
                                <option key={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div className="dropdown-eng">
                        <label>Set Rewards:</label>
                        <select>
                            <option>Select Month</option>
                            {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                            ].map((month) => (
                                <option key={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {/* Employees List */}
<div ref={memberListRef} className="Emp-table-container">
<h3><strong>Milestones Leaderboard</strong></h3>
  <table className="Emp-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Project Code</th>
        <th>Total Points</th>
        <th>Level</th>
        <th>Badges</th>
        <th>Vouchers</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(members) && members.length > 0 ? (
        members.map((member) => (
          <tr key={member._id}>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.projectCode}</td>
            <td>{member.totalPoints}</td>
            <td>{member.level}</td>
            <td>{member.badges.join(", ")}</td>
            <td>
              {member.currentCycleVoucher ? (
                <>
                  <div>Code: {member.currentCycleVoucher.code}</div>
                  <div>Discount: {member.currentCycleVoucher.discount}</div>
                  <div>Valid Until: {new Date(member.currentCycleVoucher.validUntil).toLocaleDateString()}</div>
                </>
              ) : (
                <span>No Voucher</span>
              )}
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
            {/* Line Graph Section */}
            <div className="line-graph-section-eng">
                <b>Employee Engagement Rate</b>
                <p>Below graph shows the Employee engagement rate as per the current or back dated months, please ensure you are viewing for required month.</p>
                <div className="chart-container-eng">
                    <Line data={lineChartData} width={600} height={200} />
                    <div className="summary-box-eng">
                        <h4>Summary</h4>
                        <p>Engagement has steadily increased over the year.</p>
                        <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.01,
              gradient: true,
              subArcs: [
                { limit: 50, color: "#f54242" }, 
                { limit: 80, color: "#f5a142" },  
                { limit: 100, color: "#42f54b" }, 
              ],
            }}
            pointer={{
              type: "needle",
              baseColor: "#000",
              length: 0.7,
            }}
            value={85} 
            minValue={0}
            maxValue={100}
          />
                    </div>
                </div>
            </div>

            {/* Project Values Section */}
            <div className="project-values-section-eng">

                <div className="pie-charts-container-eng">
                    <span className="step-symbol-eng">Project Values</span>
                    <div className="pie-box-eng">
                        <b>Engagement Score</b>
                        <Pie data={pieChartData1} />
                    </div>
                    <div className="pie-box-eng">
                        <b>Value Additions</b>
                        <Pie data={pieChartData1} />
                    </div>
                    <div className="pie-box-eng">
                        <b>Participation Rate</b>
                        <Pie data={pieChartData1} />
                    </div>
                </div>
            </div>
            {/* Personal Growth Section */}
            <div className="personal-growth-section-eng">

                <div className="pie-charts-container-eng">
                    <span className="step-symbol-eng">Personal Growth</span>
                    <div className="pie-box-eng">
                        <b>Relationship with RM</b>
                        <Pie data={pieChartData2} />
                    </div>
                    <div className="pie-box-eng">
                        <b>Number of New Skills</b>
                        <Pie data={pieChartData2} />
                    </div>
                    <div className="pie-box-eng">
                        <b>Compliance Rate</b>
                        <Pie data={pieChartData2} />
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="footereng">
                <h2>Know more about Employee engagement</h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa incidunt itaque voluptas. Fuga error consequatur cum inventore minima, corrupti sint accusantium nam, unde, animi nemo delectus velit beatae. Earum repellat blanditiis ipsam sit, eius saepe vitae asperiores voluptatibus corrupti voluptates iste ex, nihil porro excepturi quasi fugiat? Blanditiis similique iste perferendis, nostrum, suscipit porro dolorem cupiditate numquam laboriosam molestias consequuntur enim voluptatum dolore autem dolor expedita. Necessitatibus magni, cumque eius laboriosam perferendis libero veritatis, ducimus rem facere consectetur totam repellendus! Reprehenderit amet quasi voluptatum molestias magnam voluptatem ducimus adipisci voluptates dolore? Voluptates, officiis magnam! Praesentium quis possimus sunt rem. Consequuntur?</p>
                <div className="site-footer__copyright">
    <medium className="CP">
      © 2024 <Link to="/">RhythmForge</Link>. All Rights Reserved.
    </medium>
  </div>
            </footer>
            </div>
        </div>
    );
};

export default EmpEngagement;
