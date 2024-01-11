import React from 'react';
import panel_button from '../../image/palette.png';

const PaletteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-14 right-4 z-20 bg-white p-2 rounded-full shadow-lg"
      aria-label="Toggle properties panel"
    >
      <img src={panel_button} className="w-6 h-6 text-black" alt="Properties" />
    </button>
  );
};

export default PaletteButton;
