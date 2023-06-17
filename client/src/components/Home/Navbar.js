import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../image/DECOT.png';

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = useState(false);

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
        <div
          className={
            'lg:flex flex-grow items-center' +
            (navbarOpen ? ' block rounded shadow-lg' : ' hidden')
          }
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row list-none mr-auto">
            {/* Other list items can go here */}
          </ul>
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="flex items-center">
              <Link
                to="/register"
                className="px-3 py-4 lg:py-2 flex items-center text-l uppercase font-bold text-black hover:text-gray-600"
              >
                Register
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to="/login"
                className="px-3 py-4 lg:py-2 flex items-center text-l uppercase font-bold text-black hover:text-gray-600"
              >
                Login
              </Link>
            </li>
            {/* Other list items can go here */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
