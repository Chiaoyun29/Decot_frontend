import React from 'react';

const Sidebar = ({ setToDraw, setToErase, toggleStickyNoteMode, isStickyNoteMode, deleteCanvas, saveImageToLocal, navigateToCreateBoard, HandleUploadAndDisplay, handleFileInput }) => {
  return (
    <div className="sidebar">
      <button className="sidebar-button" onClick={setToDraw}>
        Draw
      </button>
      <button className="sidebar-button" onClick={setToErase}>
        Erase
      </button>
      <button className="sidebar-button" onClick={toggleStickyNoteMode}>
        {isStickyNoteMode ? "Exit Sticky Notes" : "Sticky Notes"}
      </button>
      <button className="sidebar-button" onClick={deleteCanvas}>
        Delete
      </button>
      <a className="sidebar-button" href="download_link" onClick={saveImageToLocal}>
        Download Image
      </a>
      <button className="sidebar-button" onClick={navigateToCreateBoard}>
        Create New Board
      </button>
      <label htmlFor="fileInput" className="sidebar-button">
        Upload Image
      </label>
      <input type="file" id="fileInput" onChange={handleFileInput} style={{ display: 'none' }}/>
    </div>
  );
};

export default Sidebar;