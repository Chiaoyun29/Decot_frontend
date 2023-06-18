import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../image/DECOT.png";
import CustomModal from './customModal';
import { useAuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    setUser(null); // clear the user
    localStorage.removeItem('user');
    navigate('/Decot_frontend'); // navigate to homepage
  };

  const confirmLogout = () => {
    setShowConfirmationModal(true);
  };

  return (
    <nav className={`relative flex flex-wrap items-center justify-between px-2 py-3 bg-yellow-200`}>
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <div>
            <img src={logo} alt="Logo" className="w-1/4 h-1/4" />
          </div>
          <button
            className="text-black cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div className={"lg:flex flex-grow items-center" + (navbarOpen ? " flex" : " hidden")} id="example-navbar-danger">
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            
            {/* Dashboard Link */}
            <li className="nav-item">
              <Link to="/dashboard" className="px-3 py-2 flex items-center text-s uppercase font-bold leading-snug text-black hover:opacity-75">
                <span className="ml-2">Dashboard</span>
              </Link>
            </li>

            {/* Notification Bell */}
            <li className="nav-item relative mr-4 cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {/* Notifications Container */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-2">
                  {/* Notification Items Here */}
                  <div className="p-2">Notification 1</div>
                  <div className="p-2">Notification 2</div>
                </div>
              )}
            </li>

            {/* Logout Button */}
            <li className="nav-item">
              <button onClick={confirmLogout} className="px-3 py-2 flex items-center text-s uppercase font-bold leading-snug text-black hover:opacity-75">
                <span className="ml-2">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <CustomModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      >
        <button onClick={handleLogout} className="px-4 py-2 mt-4 text-black bg-red-500 rounded">
          Confirm Logout
        </button>
        <button onClick={() => setShowConfirmationModal(false)} className="px-4 py-2 mt-4 ml-4 text-white bg-gray-500 rounded">
          Cancel
        </button>
      </CustomModal>
    </nav>
  );
};

export default Navbar;
