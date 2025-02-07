import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ProjectCalendar = () => {
  const [deployDates, setDeployDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetch("https://rhythm-forge-api.vercel.app/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const dates = [];
        data.forEach((project) => {
          const deployedStage = project.stages.find((stage) => stage.stage === "Deployed");
          if (deployedStage) {
            const start = new Date(deployedStage.startDate);
            const end = new Date(deployedStage.endDate);
            let currentDate = new Date(start);
            while (currentDate <= end) {
              dates.push(currentDate.toISOString().split("T")[0]);
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        });
        setDeployDates(dates);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const tileClassName = ({ date }) => {
    const dateString = date.toISOString().split("T")[0];
    if (dateString === currentDate) {
      return "current-date"; // Yellow for current date
    }
    return deployDates.includes(dateString) ? "deploy-highlight" : "";
  };

  const handleMonthChange = (newDate) => {
    // Update currentDate to the new month when the user navigates to a different month
    setCurrentDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div>
      <h2>Project Deployment Schedules</h2>
      <Calendar
        tileClassName={tileClassName}
        onMonthChange={handleMonthChange} // Handle month change
      />
      <div className="legend">
        <h3>Legend:</h3>
        <ul>
          <li><span className="yellow-box"></span> Yellow - Current Date</li>
          <li><span className="green-box"></span> Green - Deployment Dates</li>
        </ul>
      </div>
      <style>
        {`
        .react-calendar{
        color: black !important;
        background-color: white !important;
        }
          .react-calendar__tile {
            color: black !important; /* Set date text color to black */
            background-color: white !important; /* Set tile background color to white */
          }

          .deploy-highlight {
            background-color: rgba(0, 128, 0, 0.3) !important;
            border-radius: 5px;
          }

          .current-date {
            background-color: rgba(255, 255, 0, 0.3) !important;
            border-radius: 5px;
          }

          .legend {
            margin-top: 20px;
            font-size: 14px;
          }

          .legend ul {
            list-style-type: none;
            padding: 0;
          }

          .legend li {
            margin-bottom: 10px;
          }

          .yellow-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-color: yellow;
            margin-right: 10px;
          }

          .green-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-color: green;
            margin-right: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default ProjectCalendar;
