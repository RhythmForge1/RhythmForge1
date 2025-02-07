import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Profile.css"; // Ensure the correct path to the CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [previousVouchers, setPreviousVouchers] = useState([]);
  const [currentCycleVoucher, setCurrentCycleVoucher] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userDetails"); // Clear user data
    navigate("/LoginPage"); // Redirect to login
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        const token = userDetails?.jwtToken;
        const response = await axios.get("https://rhythm-forge-api.vercel.app/api/profile/", {
          headers: { Authorization: `${token}` },
        });

        // Check the full response and map data to state
        console.log(response.data); // Log the API response to check the structure

        setUser(response.data.user || {});
        setPreviousVouchers(response.data.user?.previousVouchers || []); // Ensure previousVouchers is set
        setCurrentCycleVoucher(response.data.user?.currentCycleVoucher || null); // Ensure currentCycleVoucher is set
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser({}); // Set an empty object on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-placeholder"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
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
          <button className="icon-button1" onClick={() => navigate("/LoginPage")}>
            <i className="fa fa-exchange" aria-hidden="true"></i> Switch user
          </button>

          {/* Account Dropdown */}
          <div className="dropdown-account">
            <button
              className="icon-button1"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <i className="fa fa-user" aria-hidden="true"></i> Account
            </button>

            {showDropdown && (
              <div className="dropdown-account-content">
                <button onClick={() => navigate("/Profile")}>Profile</button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="profile-card">
        <div className="profile-info">
          <h2><strong>User Profile</strong></h2>
          <p><strong>Name:</strong> {user.name || "N/A"}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Project Code:</strong> {user.projectCode || "N/A"}</p>
          <p><strong>Role:</strong> {user.role || "N/A"}</p>
          <p><strong>User Type:</strong> {user.userType || "N/A"}</p>
          <p><strong>Access Type:</strong> {user.accessType || "N/A"}</p>
          <p><strong>Line Manager Email:</strong> {user.lineManagerEmail || "N/A"}</p>

          {user.userType === "Internal" && (
            <>
              <p><strong>SAP ID:</strong> {user.sapId || "N/A"}</p>
              <p><strong>Business Justification:</strong> {user.businessJustification || "N/A"}</p>
            </>
          )}
          <p><strong>Total Points:</strong> {user.totalPoints || 0}</p>
          <p><strong>Level:</strong> <span className="level-badge">{user.level || "N/A"}</span></p>

          </div>

          <div className="rewards">
        <div className="Voucher-currentbox">
  <p><strong>Current Cycle Voucher:</strong></p>
  {user.currentCycleVoucher ? (
    <div>
      <strong>Code:</strong> {user.currentCycleVoucher.code} <br />
      <strong>Discount:</strong> {user.currentCycleVoucher.discount} <br />
      <strong>Valid Until:</strong> {new Date(user.currentCycleVoucher.validUntil).toLocaleDateString()}
    </div>
  ) : (
    <p>Voucher is being processed...</p>
  )}
</div>
<div className="Voucher-prevbox">
  <p><strong>Previous Vouchers:</strong></p>
  {user.previousVouchers && user.previousVouchers.length > 0 ? (
    <ul>
      {user.previousVouchers.map((voucher, index) => (
        <li key={index}>
          <strong>Code:</strong> {voucher.code || "N/A"} <br />
          <strong>Discount:</strong> {voucher.discount || "N/A"} <br />
          <strong>Valid Until:</strong> {voucher.validUntil ? new Date(voucher.validUntil).toLocaleDateString() : "N/A"}
        </li>
      ))}
    </ul>
  ) : user.currentCycleVoucher ? (  
    <p>Previous vouchers will be displayed once the current cycle voucher is used or expired.</p>  
  ) : (
    <p>All your previous vouchers will be displayed here.</p>
  )}
</div>
        <div className="badges-container">
          <h4><strong>Badges</strong></h4>
          {Array.isArray(user.badge) && user.badge.length > 0 ? (
            user.badge.map((badge, index) => (
              <span key={index} className="badge">{badge}</span>
            ))
          ) : (
            <p>No Badges Earned</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
