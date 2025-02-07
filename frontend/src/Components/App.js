import React from "react";
import { Route, Routes } from "react-router-dom";
import "../Components/Styles/App.css";
import LoginPage from "../Components/JSX/LoginPage";
import RegisterPage from "../Components/JSX/Register";
import RegisterPage2 from "../Components/JSX/Register2";
import VendorLogin from "../Components/JSX/VendorLogin";
import InternalLogin from "../Components/JSX/InternalLogin";
import VendorHomepage from "../Components/JSX/VendorHomepage";
import InternalHomepage from "../Components/JSX/InternalHomepage";
import EmpHomepage from "../Components/JSX/EmpHomepage";
import EmpEngagement from "../Components/JSX/EmpEngagement";
import RequestCreationPage from "../Components/JSX/RequestCreationPage";
import VendorProjects from "../Components/JSX/VendorProjects";
import Vendorsharedlayout from "../Components/JSX/Vendorsharedlayout";
import EmployeesPage from "../Components/JSX/EmployeesPage"
import Deliverables from "../Components/JSX/Deliverables";
import Profile from "../Components/JSX/Profile";
import ChatWidget from "../Components/JSX/chatwidget";
import VendorFAQ from "../Components/JSX/VendorFAQ"
import ContactUs from "../Components/JSX/ContactUs"
import Calendar from "../Components/JSX/Calendar";
import Empsharedlayout from "../Components/JSX/EmpSharedlayout"
import EscalationModal from "../Components/JSX/EscalationModal"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register2" element={<RegisterPage2 />} />
        <Route path="/VendorLogin" element={<VendorLogin />} />
        <Route path="/InternalLogin" element={<InternalLogin />} />
        <Route path="/VendorHomepage" element={<VendorHomepage/>} />
        <Route path="/InternalHomepage" element={<InternalHomepage />} />
        <Route path="/EmpHomepage" element={<EmpHomepage />} />
        <Route path="/EmpEngagement" element={<EmpEngagement />} />
        <Route path="/RequestCreationPage" element={<RequestCreationPage />} />
        <Route path="/VendorProjects" element={<VendorProjects />} />
        <Route path="/Vendorsharedlayout" element={<Vendorsharedlayout />} Vendorsharedlayout/>
        <Route path="/EmployeesPage" element={<EmployeesPage />} EmployeesPage/> 
        <Route path="/Deliverables" element={<Deliverables />} Deliverables/>
        <Route path="/Profile" element={<Profile />} Profile />
        <Route path="/chatwidget" element={<ChatWidget />} chatwidget/>
        <Route path="/VendorFAQ" element={<VendorFAQ />} VendorFAQ/>
        <Route path="/ContactUs" element={<ContactUs />} ContactUs/>
        <Route path="/VendorHomepage/:projectCode" element={<VendorHomepage />} />
        <Route path="/ProjectCalendar" element={<Calendar/>} />
        <Route path="/Empsharedlayout" element={<Empsharedlayout/>} />
        <Route path="/EmpHomepage/:projectCode" element={<EmpHomepage />} />
        <Route path="/EscalationModal" element={<EscalationModal />} />
      </Routes>
    </div>
  );
}

export default App;
