import React, { useState } from 'react';
import { Palette } from '../canvas/Palette';
import { PiPencil, PiEraser, PiStickerDuotone, PiUploadSimpleDuotone, PiShapes } from 'react-icons/pi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoMenu } from 'react-icons/io5';
import { BsTextareaT } from "react-icons/bs";
import GridLines from './GridLines';
import { MdSaveAlt } from "react-icons/md";
import { BiExport } from "react-icons/bi";

const Sidebar = ({ activateDrawingMode, activateErasingMode, isDrawing, isErasing, handleAddingNote, deleteCanvas, saveImageToLocal, handleUploadAndDisplay, handleAddingShape, handleAddingTextbox, gridCanvasRef, handleSaveCanvas, setIsDrawing, onSelectShape, setIsErasing }) => {
  const [showPalette, setShowPalette]=useState(false);
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const handleTogglePalette=()=>{
    setShowPalette(!showPalette);
  };

  const handleToggleDrawing=()=>{
    //setToDraw();
    setIsDrawing(true);
    // setIsErasing(false);
    if (true) {
      activateDrawingMode(); // Activate drawing mode only if isDrawing was false
    }
  };

  const handleToggleErasing=()=>{
    // setToErase();
    setIsErasing(true);
    // setIsDrawing(false);
    if (!isErasing) {
      activateErasingMode(); // Activate erasing mode only if isErasing was false
    }
  };

  const buttons = [
    { label: 'Draw', icon: <PiPencil />, onClick: handleToggleDrawing },
    { label: 'Erase', icon: <PiEraser />, onClick: handleToggleErasing },
    { label: 'Sticky Notes', icon: <PiStickerDuotone />, onClick: handleAddingNote },
    { label: 'Delete', icon: <RiDeleteBinLine />, onClick: deleteCanvas },
    { label: 'Upload Image', icon: <PiUploadSimpleDuotone />, onClick: handleUploadAndDisplay },
    { label: 'Add Text', icon: <BsTextareaT />, onClick: handleAddingTextbox },
    { label: 'Save Canvas', icon: <MdSaveAlt />, onClick: handleSaveCanvas },
    { label: 'Insert Shapes', icon: <PiShapes />, onClick: handleTogglePalette },
  ];

  const handleButtonClick = (event, onClick, buttonLabel) => {
    if(event){
      event.preventDefault();
    }
    if(activeButton === buttonLabel){
      setActiveButton(null);
    }else{
      setActiveButton(buttonLabel);
    }
    onClick(event);
  };

  return (
    <div className="flex">
      <div className={`bg-[#FCD34D] ${open ? 'w-72' : 'w-16'} h-screen duration-500 text-black-100 overflow-x-hidden transition-all z-10 relative`}>
        <div className="mt-4 flex flex-col relative">
          <div className={`py-3 flex ${open ? 'justify-start pl-2' : 'justify-center'}`}>
            <IoMenu size={26} className="cursor-pointer" onClick={()=>setOpen(!open)}
            />
          </div>
          {open
            ?buttons.map((button, index)=>(
              <button
                key={index}
                className={`sidebar-button ${activeButton === button.label ? 'active-button-class' : ''}`}
                onClick={(e)=> handleButtonClick(e, button.onClick, button.label)}>
                {button.icon}<span>{button.label}</span>
              </button>
            ))
            :buttons.map((button, index)=>(
              <button
              key={index}
              className={`sidebar-button ${!open ? 'sidebar-button-center' : ''}`}
              onClick={(e) => handleButtonClick(undefined, button.onClick)}
            >
              {button.icon}
            </button>
          ))}

          {showPalette&&(
            <Palette onSelectShape={onSelectShape}/>
          )}

          {open ? (
          <>
            <button className="sidebar-button"  onClick={saveImageToLocal}>
              <BiExport />
              <span>Export Image</span>
            </button>
          </>
        ) : (
          <>
            <button className={`sidebar-button ${!open ? 'sidebar-button-center' : ''}`}  onClick={(e) => handleButtonClick(e, saveImageToLocal)}>
              <BiExport />
            </button>
          </>
        )}
        </div>
      </div>
      <GridLines gridCanvasRef={gridCanvasRef} sidebarWidth={open?72:16}/>
    </div>
  );
};

export default Sidebar;