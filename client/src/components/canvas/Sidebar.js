import React, { useState } from 'react';
import { Palette } from '../canvas/Palette';
import { PiPencil, PiEraser, PiStickerDuotone, PiDownload, PiUploadSimpleDuotone, PiShapes } from 'react-icons/pi';
import { RiDeleteBinLine } from 'react-icons/ri';

const Sidebar = ({ setToDraw, setToErase, handleAddingNote, deleteCanvas, saveImageToLocal, HandleUploadAndDisplay, showDropdown, handleAddingShape }) => {
  const [showPalette, setShowPalette]=useState(false);

  const handleTogglePalette=()=>{
    setShowPalette(!showPalette);
  };

  const onDrop = (type) => {
    console.log(`Selected shape: ${type}`);
    handleAddingShape(type);
  };

  return (
    <div className="sidebar">
      <button className="sidebar-button" onClick={setToDraw}>
        <PiPencil/><span>Draw</span>
      </button>
      <button className="sidebar-button" onClick={setToErase}>
        <PiEraser/><span>Erase</span>
      </button>
      <button className="sidebar-button" onClick={handleAddingNote}>
        <PiStickerDuotone/><span>Sticky Notes</span>
      </button>
      <button className="sidebar-button" onClick={deleteCanvas}>
        <RiDeleteBinLine/><span>Delete</span>
      </button>
      <a className="sidebar-button" href="download_link" onClick={saveImageToLocal}>
        <PiDownload/><span>Download Image</span>
      </a>
      <label htmlFor="fileInput" className="sidebar-button" onClick={HandleUploadAndDisplay}>
        <PiUploadSimpleDuotone/><span>Upload Image</span>
      </label>
      <button className="sidebar-button" onClick={handleTogglePalette}>
        <PiShapes/><span>Insert Shapes</span>
      </button>
      {showPalette&&(
        <Palette onShapeSelect={(type)=>{
          console.log(`Selected shape: ${type}`);
        }}/>
      )}
      {/* <input type="file" id="fileInput" onChange={handleFileInput} style={{ display: 'none' }}/> */}
    </div>
  );
};

export default Sidebar;