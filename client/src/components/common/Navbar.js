import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../image/DECOT.png";
import CustomModal from './CustomModal';
import { useAuthContext } from '../../context/AuthContext';
import NotificationButton from '../common/NotificationButton';
import FeedbackButton from '../feedback/Feedback';
//import ChatButton from '../chat/Chat';

const Navbar = (props) => {
  const { setUser, setToken } = useAuthContext();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const handleLogout = () => {
    setUser(null); // clear the user
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/Decot_frontend'); // navigate to homepage
  };

  const confirmLogout = () => {
    setShowConfirmationModal(true);
  };

  return (
    <nav
        className={
          (props.transparent
            ? 'top-0 absolute z-50 w-full'
            : 'relative shadow-lg bg-white shadow-lg') +
          ' flex flex-wrap items-center justify-between px-2 py-3'
        }
      >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link to="/Decot_Frontend">
            <img src={logo} alt="Logo" className="w-1/4 h-1/4" />
          </Link>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i className={(props.transparent ? 'text-white' : 'text-gray-800') + ' fas fa-bars'}></i>
          </button>
        </div>
        <div className={"lg:flex flex-grow items-center" + (navbarOpen ? " block rounded shadow-lg" : " hidden")} id="example-navbar-danger">
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">

            {/* Notification Bell */}
            <li className="nav-item relative px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75 z-10" onClick={() => setShowNotifications(!showNotifications)}>
              <NotificationButton />
            </li>

            {/* Dashboard Link */}
            <li className="nav-item">
              <Link to="/dashboard" className="px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75">
                <span className="z-10 ml-2">DASHBOARD</span>
              </Link>
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item relative z-10">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75"
              >
                <span className="ml-2">PROFILE</span>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-2 z-100">
                  <button onClick={() => navigate('/profile')} className="block w-full text-left p-2 hover:bg-gray-200">Manage Profile</button>
                  <button onClick={confirmLogout} className="block w-full text-left p-2 hover:bg-gray-200">Logout</button>
                </div>
              )}
            </li>

            {/* Feedback Button */}
            <li className="nav-item relative px-3 py-2 flex items-center text-s font-bold leading-snug text-black hover:opacity-75 z-10">
              <FeedbackButton />
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
        <button onClick={handleLogout} className="px-4 py-2 mt-4 text-white bg-red-500 rounded">
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