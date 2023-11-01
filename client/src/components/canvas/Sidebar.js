import React, { useState } from 'react';
import Palette from '../canvas/Palette';
import { PiPencil, PiEraser, PiStickerDuotone, PiDownload, PiUploadSimpleDuotone, PiShapes } from 'react-icons/pi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoCreateOutline } from 'react-icons/io5';

const Sidebar = ({ setToDraw, setToErase, toggleStickyNoteMode, isStickyNoteMode, deleteCanvas, saveImageToLocal, navigateToCreateBoard, HandleUploadAndDisplay, showDropdown }) => {
  const [showPalette, setShowPalette]=useState(false);

  const handleTogglePalette=()=>{
    setShowPalette(!showPalette);
  };

  return (
    <div className="sidebar">
      <button className="sidebar-button" onClick={setToDraw}>
        <PiPencil/>Draw
      </button>
      <button className="sidebar-button" onClick={setToErase}>
        <PiEraser/>Erase
      </button>
      <button className="sidebar-button" onClick={toggleStickyNoteMode}>
        <PiStickerDuotone/>{isStickyNoteMode ? "Exit Sticky Notes" : "Sticky Notes"}
      </button>
      <button className="sidebar-button" onClick={deleteCanvas}>
        <RiDeleteBinLine/>Delete
      </button>
      <a className="sidebar-button" href="download_link" onClick={saveImageToLocal}>
        <PiDownload/>Download Image
      </a>
      <button className="sidebar-button" onClick={navigateToCreateBoard}>
        <IoCreateOutline/>Create New
      </button>
      <label htmlFor="fileInput" className="sidebar-button" onClick={HandleUploadAndDisplay}>
        <PiUploadSimpleDuotone/>Upload Image
      </label>
      <button className="sidebar-button" onClick={handleTogglePalette}>
        <PiShapes/>Insert Shapes
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