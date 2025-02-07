import React from 'react';
import '../Styles/FAQ.css';

const VendorFAQ = () => {
  return (
    <div className="faq-container">
      <h2>FAQ: RhythmForge <img className="logo-header" src="/Images/smalllogo.png" height="30px" alt="RhythmForge Logo"/>
      </h2>
      
      <div className="faq-item">
        <h3>What is RhythmForge?</h3>
        <p>RhythmForge is a platform built for two different parties: vendors and internal users. It offers various features and functionalities tailored to the needs of each party.</p>
      </div>

      <div className="faq-item">
        <h3>Who are the vendors?</h3>
        <p>Vendors can be third-party users, business stakeholders, or external parties. They need to register first using the register link and log in using the Business User Login button, which redirects them to the business user login page.</p>
      </div>

      <div className="faq-item">
        <h3>Who are the internal users?</h3>
        <p>Internal users are HCLTech users. HCLTech users registering on RhythmForge need to use their HCL details. Depending on their role, users like "Scrum Master" and "QA Analyst" are redirected to the Employee Homepage, while other roles are redirected to the Internal Homepage.</p>
      </div>

      <div className="faq-item">
        <h3>What happens after selecting a project code at the login screen?</h3>
        <p>Vendors are redirected to the specific project page for the project code they selected. If they wish to change the project, they can do so by selecting it in the navigation bar.</p>
      </div>

      <div className="faq-item">
        <h3>How can vendors create new projects?</h3>
        <p>Vendors can create new projects by selecting "Create New Request" in the navigation bar. This redirects them to the request creation page. Requests created here will be treated as new projects, tracked with a project code (the first four letters of the short description), and set with the default state as Review, with each stage having a duration of 7 days.</p>
      </div>

      <div className="faq-item">
        <h3>How can vendors raise an escalation for an overdue project?</h3>
        <p>Vendors can raise an escalation by using the "Escalation" option in the navigation bar, which opens a popup form to fill out all the mandatory information required to raise the escalation.</p>
      </div>

      <div className="faq-item">
        <h3>How can vendors track recent activity on their projects?</h3>
        <p>Vendors can track recent activity done on their projects using the "Recent Activity" button.</p>
      </div>

      <div className="faq-item">
        <h3>How can vendors view pending approvals?</h3>
        <p>Vendors can view any pending approvals using the "Actions Needed Your Attention" feature.</p>
      </div>

      <div className="faq-item">
        <h3>Can vendors initiate a chat with internal users?</h3>
        <p>Yes, vendors can initiate a chat with internal users by clicking the chat widget. Any available internal user can pick up the chat and reply to the vendor user.</p>
      </div>
    </div>
  );
};

export default VendorFAQ;
