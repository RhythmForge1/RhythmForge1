import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/LoginPage.css";
<link
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  rel="stylesheet"
/>


const SharedLayout = ({ children }) => {
  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom to 90%

    return () => {
      document.body.style.zoom = "100%"; // Reset zoom when leaving the page
    };
  }, []);
  return (
    <div className="login-page">
      {/* Header */}
      <header className="header fixed-header">
        <div className="header-left">
          <Link to="/">
            <img
              src="/Images/Headernew.png"
              alt="RhythmForge Logo"
              className="logo-header"
              style={{height:50, width:250}}
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
          <button className="icon-button">
            <i className="fa fa-question-circle" aria-hidden="true"></i> Support
          </button>
          <button className="icon-button">
            <i className="fa fa-exchange" aria-hidden="true"></i> Switch User
          </button>
          <button className="icon-button">
            <i className="fa fa-user" aria-hidden="true"></i> Profile
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="body">
        <div className="body-left">
          <Link to="/">
            <img
              src="/Images/leftimagenew.png"
              alt="Additional Content"
              className="body-image"
              style={{height:300, width:520}}
            />
          </Link>
        </div>
        <div className="body-main">{children}</div>
        <div className="body-right">
          <div className="read-me-box">
            <h3>Need Help in knowing your login?</h3>
            <div className="help-buttons">
              <Link to="/VendorFAQ" className="help-button">
                <span className="icon">❓</span> FAQs
              </Link>
              <Link to="/ContactUs" className="help-button">
                <span className="icon">📞</span> Get in Touch
              </Link>
            </div>
            <Link to="/about-us" className="know-more-button">
              Know More About Us
            </Link>
          </div>
        </div>
      </main>

      {/* Informational Section */}
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

export default SharedLayout;
