import React from "react";
import "../Styles/SharedLayoutHome.css"; 
import { Link, useNavigate } from "react-router-dom";

const SharedLayoutHome = ({ children }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLogout = () => {
      localStorage.removeItem("userDetails"); // Clear user data
      navigate("/LoginPage"); // Redirect to login
    };
  return (
    <div className="layout-home">
     {/* Header */}
     <header className="header fixed-header">
        <div className="header-left">
          <Link to="/">
            <img
              src="/Images/logo2.png"
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

      {/* Navbar */}
      <nav className="navbar-home">
        <ul className="dropdown-left">
          <li>
            My Requests
            <ul className="dropdown-menu">
              <li>New Request</li>
              <li>Draft Requests</li>
              <li>Modify Requests</li>
            </ul>
          </li>
          <li>
            Functions
            <ul className="dropdown-menu">
              <li>Escalate</li>
              <li>Teams</li>
              <li>Reminders</li>
            </ul>
          </li>
          <li>
            Contracts
            <ul className="dropdown-menu">
              <li>A123</li>
              <li>B123</li>
              <li>C123</li>
            </ul>
          </li>
        </ul>
        <ul className="dropdown-right">
          <li>
            Help
            <ul className="dropdown-menu">
              <li>Contact</li>
              <li>Chat</li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-home">
        {/* Left Box */}
        <div className="left-box-home">
          <h2>Trend Analysis</h2>
          <div className="chart">
            <h3>Delivery Impact</h3>
            <div id="pie-chart" style={{ width: "100%", height: "200px" }}>
              {/* Add pie chart here */}
            </div>
          </div>
          <div className="chart">
            <h3>Bar Graph</h3>
            <div id="bar-graph" style={{ width: "100%", height: "200px" }}>
              {/* Add bar graph here */}
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="body-home">{children}</div>

        {/* Right Box */}
        <div className="right-box-home">
          <h2>Quick Links</h2>
          <button>Recent Activity</button>
          <button>Actions Need your Attention</button>
          <button>Billing Details</button>
          <button>Add/Review/Update Request</button>
          <div className="circle-buttons">
            <button className="circle">Help</button>
            <button className="circle">Files</button>
          </div>
          <div className="circle-buttons">
            <button className="circle">Event</button>
            <button className="circle">Chat</button>
          </div>
        </div>
      </div>

      <section className="info-section">
        <h2>About RhythmForge</h2>
        <p>
        RhythmForge is an advanced platform designed to streamline
          organizational workflows and enhance collaboration among teams. With
          a focus on efficiency, our system provides tailored solutions for
          developers, testers, and project managers, enabling them to perform
          their tasks seamlessly. Whether you are working on large-scale
          projects or managing daily operations, RhythmForge equips you with
          tools that ensure productivity and effective communication
        </p>
        <p>
        At its core, RhythmForge integrates cutting-edge technologies to
          ensure secure and real-time access to project resources. With its
          intuitive interface and robust architecture, users can easily track
          project progress, allocate resources, and collaborate on deliverables.
          The platform supports a wide range of customization options to suit
          your organization's specific requirements, making it an indispensable
          tool for both large enterprises and small teams.
        </p>
        <p>
          Explore our platform today to unlock the full potential of your team
          and drive success in every project.
        </p>
      </section>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
  <div className="page-width">


    {/* "Our Services" and "Conditions of Use" sections */}
    <div className="site-footer__section">
      <div className="site-footer__subsection">
        <h4>OUR SERVICES</h4>
        <ul>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/help">Help</Link></li>
        </ul>
      </div>
    </div>
    <div className="site-footer__section">
      <div className="site-footer__subsection">
        <h4>SOCIAL LINKS</h4>
        <ul>
          <li><Link to="/about-us">Linkedin</Link></li>
          <li><Link to="/contact">Facebook</Link></li>
          <li><Link to="/help">Instagram</Link></li>
        </ul>
      </div>
    </div>
    <div className="site-footer__section">
      <div className="site-footer__subsection">
        <h4>SUPPORT</h4>
        <ul>
          <li><Link to="/about-us">Profile details</Link></li>
          <li><Link to="/contact">Register process</Link></li>
          <li><Link to="/help">Login process</Link></li>
        </ul>
      </div>
    </div>
    
    <div className="site-footer__section">
      <div className="site-footer__subsection">
        <h4>CONDITIONS OF USE</h4>
        <ul>
          <li><Link to="/faqs">FAQs</Link></li>
          <li><Link to="/privacy">Privacy Notice</Link></li>
          <li><Link to="/terms">Terms and Conditions</Link></li>
        </ul>
      </div>
    </div>
  </div>
      {/* "Be in the Know" section */}
      <div className="site-footer__section">
      <h4 className="site-footer__section-title h1">Be in the Know</h4>
      <form method="post" action="/contact#contact_form" id="contact_form" className="contact-form">
        <label htmlFor="NewsletterEmail" className="site-footer__newsletter-label">
          Sign up for the latest news and offers
        </label>
        <div className="input-group">
          <input
            type="email"
            placeholder="Your email"
            name="contact[email]"
            id="NewsletterEmail"
            className="input-group__field site-footer__newsletter-input"
            autoComplete="off"
          />
          <div className="input-group__btn">
            <button type="submit" className="btn btn--narrow" name="commit" id="Subscribe">
              Subscribe
            </button>
          </div>
        </div>
      </form>
    </div>

  <div className="site-footer__copyright">
    <medium>
      © 2024 <Link to="/">RhythmForge</Link>. All Rights Reserved.
    </medium>
  </div>
</footer>
    </div>
  );
};

export default SharedLayoutHome;
