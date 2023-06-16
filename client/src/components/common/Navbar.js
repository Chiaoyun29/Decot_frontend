import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../image/DECOT.png";
import CustomModal from '../common/CustomModal';
import { useAuthContext } from '../../context/AuthContext';
import NotificationButton from '../common/NotificationButton';

const Navbar = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
              <Link to="/dashboard" className="px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75">
                <span className="ml-2">DASHBOARD</span>
              </Link>
            </li>

            {/* Notification Bell */}
            <li className="nav-item relative px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75" onClick={() => setShowNotifications(!showNotifications)}>
            <NotificationButton />
            </li>
            {/* Profile Dropdown */}
            <li className="nav-item relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75"
              >
                <span className="ml-2">PROFILE</span>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-2">
                  <button onClick={confirmLogout} className="block w-full text-left p-2 hover:bg-gray-200">Logout</button>
                  <button onClick={() => navigate('/manage-profile')} className="block w-full text-left p-2 hover:bg-gray-200">Manage Profile</button>
                </div>
              )}
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
