import React, { useState } from 'react';
import '../Styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    isVendor: false,
    isInternal: false,
    email: '',
    mobile: '',
    concern: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, like sending an email
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
    // Reset form
    setFormData({
      isVendor: false,
      isInternal: false,
      email: '',
      mobile: '',
      concern: ''
    });
  };

  return (
    <div className="contact-us-container">
      <h2>Get in Touch with Us...           <img className="logo-header" src="/Images/smalllogo.png" height="30px" alt="RhythmForge Logo"/>
      </h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="checkbox-container">
          <label>
            <input 
              type="checkbox" 
              name="isVendor" 
              checked={formData.isVendor} 
              onChange={handleChange} 
            />
            Vendor
          </label>
          <label>
            <input 
              type="checkbox" 
              name="isInternal" 
              checked={formData.isInternal} 
              onChange={handleChange} 
            />
            Internal
          </label>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <span>Please mention your concern if you are facing issue while registering or login and the error you are observing..</span>
        <textarea
          name="concern"
          placeholder="Your concern..."
          value={formData.concern}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
