import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../Styles/MilestoneModal.css"; // Import the CSS for styling

Modal.setAppElement("#root"); // Set the root element for accessibility

const MilestoneModal = ({ isOpen, closeModal }) => {
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    description: "",
    criteria: "",
    targetValue: "",
    rewardPoints: "",
    badge: "",
    levelUp: false,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMilestoneData({
      ...milestoneData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit the form data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://rhythm-forge-api.vercel.app/api/milestones/create", milestoneData);
      if (response.status === 201) {
        alert("Milestone created successfully!");
        closeModal(); // Close the modal after successful submission
      }
    } catch (error) {
      console.error("Error creating milestone:", error);
      alert("Error creating milestone. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="milestone-modal" overlayClassName="milestone-overlay">
      <h2 className="modal-title">Create Milestone</h2>
      <form onSubmit={handleSubmit} className="milestone-form">
        <label htmlFor="title" className="input-label">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={milestoneData.title}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="description" className="input-label">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={milestoneData.description}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="criteria" className="input-label">Criteria</label>
        <input
          type="text"
          id="criteria"
          name="criteria"
          value={milestoneData.criteria}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="targetValue" className="input-label">Target Value</label>
        <input
          type="number"
          id="targetValue"
          name="targetValue"
          value={milestoneData.targetValue}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="rewardPoints" className="input-label">Reward Points</label>
        <input
          type="number"
          id="rewardPoints"
          name="rewardPoints"
          value={milestoneData.rewardPoints}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="badge" className="input-label">Badge</label>
        <input
          type="text"
          id="badge"
          name="badge"
          value={milestoneData.badge}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label htmlFor="levelUp" className="input-label">
          Level Up
          <input
            type="checkbox"
            id="levelUp"
            name="levelUp"
            checked={milestoneData.levelUp}
            onChange={handleChange}
            className="checkbox-input"
          />
        </label>

        <div className="button-container">
          <button type="submit" className="submit-button">Create Milestone</button>
          <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default MilestoneModal;
