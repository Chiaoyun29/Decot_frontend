import { Link } from 'react-router-dom';
import logo from "../../image/DECOT.png";
import React from "react";

export default function Navbar({ fixed }) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <nav className={`relative flex flex-wrap items-center justify-between px-2 py-3 bg-yellow-200 mb-3 ${fixed ? 'fixed top-0 left-0 right-0' : ''}`}>
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
        <div
          className={
            "lg:flex flex-grow items-center" +
            (navbarOpen ? " flex" : " hidden")
          }
          id="example-navbar-danger"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="nav-item">
              <Link to="/register" className="px-3 py-2 flex items-center text-s uppercase font-bold leading-snug text-black hover:opacity-75"><span className="ml-2">Register</span></Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="px-3 py-2 flex items-center text-s uppercase font-bold leading-snug text-black hover:opacity-75"><span className="ml-2">Login</span></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
