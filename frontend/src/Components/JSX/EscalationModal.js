import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

// Bind Modal to App element for accessibility
Modal.setAppElement("#root");

const EscalationModal = ({ isOpen, onClose }) => {
    const [escalations, setEscalations] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchEscalations();
        }
    }, [isOpen]);

    const fetchEscalations = async () => {
        try {
            const response = await axios.get("https://rhythm-forge-api.vercel.app/api/escalations");
            setEscalations(response.data);
        } catch (error) {
            console.error("Error fetching escalations:", error);
        }
    };

    // Updated Modal Styles
    const modalStyles = {
        content: {
            width: "60%",
            maxWidth: "800px",
            height: "50vh", // Reduced height to ensure visibility
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            background: "white",
            border: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 1050,
        },
        overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1049,
        },
        header: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
        },
        tableContainer: {
            flex: 1, // Takes up available space
            overflowY: "auto", // Enables scrolling if content overflows
            marginTop: "10px",
            maxHeight: "45vh", // Restricts table height for proper scrolling
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
        },
        thTd: {
            border: "1px solid #ddd",
            padding: "10px",
            textAlign: "center",
        },
        th: {
            backgroundColor: "#f8f8f8",
            color: "#444",
            fontWeight: "bold",
            padding: "10px",
            textAlign: "center",
        },
        rowEven: {
            backgroundColor: "#f9f9f9",
        },
        noData: {
            textAlign: "center",
            padding: "15px",
            fontSize: "16px",
            color: "#777",
        },
        footer: {
            paddingTop: "10px",
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "flex-end",
            background: "white",
            paddingBottom: "10px",
        },
        closeModalBtn: {
            background: "#444",
            color: "white",
            border: "none",
            padding: "10px 15px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "5px",
            transition: "background 0.3s",
        },
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Escalations" style={modalStyles}>
            {/* Header */}
            <div style={modalStyles.header}>
                <h2>Escalation Requests</h2>
            </div>

            {/* Scrollable Table Section */}
            <div style={modalStyles.tableContainer}>
                <table style={modalStyles.table}>
                    <thead>
                        <tr>
                            <th style={modalStyles.th}>Project ID</th>
                            <th style={modalStyles.th}>Reason</th>
                            <th style={modalStyles.th}>Severity</th>
                            <th style={modalStyles.th}>Users Affected</th>
                            <th style={modalStyles.th}>Status</th>
                            <th style={modalStyles.th}>Requested Timeslot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {escalations.length > 0 ? (
                            escalations.map((esc, index) => (
                                <tr key={esc._id} style={index % 2 === 0 ? modalStyles.rowEven : {}}>
                                    <td style={modalStyles.thTd}>{esc.projectId}</td>
                                    <td style={modalStyles.thTd}>{esc.reason}</td>
                                    <td style={modalStyles.thTd}>{esc.severity}</td>
                                    <td style={modalStyles.thTd}>{esc.usersAffected}</td>
                                    <td style={modalStyles.thTd}>{esc.status}</td>
                                    <td style={modalStyles.thTd}>{new Date(esc.expectedTimeslot).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={modalStyles.noData}>No escalations found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Close Button */}
            <div style={modalStyles.footer}>
                <button onClick={onClose} style={modalStyles.closeModalBtn}>Close</button>
            </div>
        </Modal>
    );
};

export default EscalationModal;
