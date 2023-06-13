import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-5 bg-blue-500">
      {/* Here goes the website icon, profile icon, and notification button */}
      <div>Website Icon</div>
      <div>Notification Button</div>
      <div>Profile Icon</div>
    </nav>
  );
};

export default Navbar;