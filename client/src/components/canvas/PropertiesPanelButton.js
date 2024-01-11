import React from 'react';

const PaletteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-14 right-4 z-20 bg-white p-2 rounded-full shadow-lg"
      aria-label="Toggle properties panel"
    >
      <img src='/image/palette.png' className="w-6 h-6 text-black" alt="Properties" />
    </button>
  );
};

export default PaletteButton;
