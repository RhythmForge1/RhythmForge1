import React from "react";
import { Link } from "react-router-dom"; 
import "../Styles/LoginPage.css";
import "font-awesome/css/font-awesome.min.css"; 
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import logo2 from "../Images/logo2.png";
// import smalllogo from "/Images/smalllogo.png";
// import leftimage from "../Images/leftimage.png"
import SharedLayout from "../JSX/SharedLayout";

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom to 90%

    return () => {
      document.body.style.zoom = "100%"; // Reset zoom when leaving the page
    };
  }, []);
  return (
 
    <SharedLayout>
      {/* Body */}
        <div className="login-box">
          <div className="login-info">
            <h3>Welcome to RhythmForge..</h3>
            <img className="logo-header" src="/Images/smalllogo.png" height="30px" alt="RhythmForge Logo"/>
          </div>
          <div>
            <p>
              Please log in using your organization's registered credentials at
              HCLTech <span className="tooltip1">
              <i className="fa fa-info-circle"></i>
              <span className="tooltip-text1">
                Ensure you have your identity registered with HCL. If not,
                please proceed to Register.
              </span>
            </span>
            </p>

          </div>
          <button className="login-button" onClick={() => navigate("/VendorLogin")}>Business User login <span className="tooltipH">
              <i className="fa fa-info-circle"></i>
              <span className="tooltipH-text">
                Ensure you have access. If not, please proceed to
                raise access request using register button.
              </span>
            </span></button>
            <span className="register-link"><Link to="/register">New User? Register Here</Link></span>
          <button className="login-button" onClick={() => navigate("/InternalLogin")}>HCLTech Internal Login <span className="tooltipH">
              <i className="fa fa-info-circle"></i>
              <span className="tooltipH-text">
                Ensure you have HCL internal access. If not, please proceed to
                raise access request using register button.
              </span>
            </span>
          </button>
          <span className="register-link"><Link to="/register2">New User? Register Here</Link></span>
        </div>
      </SharedLayout>
  );
};

export default LoginPage;
