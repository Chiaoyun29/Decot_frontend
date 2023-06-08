import React from "react";
import { Link } from "react-router-dom";
import icon_facebook from "../../image/icon_facebook.svg";
import icon_github from "../../image/icon_github.svg";
import icon_insta from "../../image/icon_insta.svg";

const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 bg-neutral-100 text-center text-neutral-600 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left">
      <div className="flex items-center justify-center border-b-2 border-neutral-200 p-6 dark:border-neutral-500 lg:justify-between">
        <div className="absolute right-10 flex justify-center">
          <div className="mr-6 text-neutral-600 dark:text-neutral-200">
            <img src={icon_facebook} alt="Facebook Icon" className="h-5 w-5" />
          </div>
          <div className="mr-6 text-neutral-600 dark:text-neutral-200">
            <img src={icon_insta} alt="Instagram Icon" className="h-5 w-5" />
          </div>
          <div>
            <img src={icon_github} alt="Github Icon" className="h-5 w-5" />
          </div>
        </div>
        <div className="p-4 text-center text-neutral-700 dark:text-neutral-200">
          © 2023 Copyright:
          Decot
        </div>
      </div>
    </footer>
  );
};

export default Footer;
