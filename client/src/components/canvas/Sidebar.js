import React, { useState } from 'react';
import { Palette } from '../canvas/Palette';
import { PiPencil, PiEraser, PiStickerDuotone, PiUploadSimpleDuotone, PiShapes } from 'react-icons/pi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoMenu } from 'react-icons/io5';
import { BsTextareaT } from "react-icons/bs";
import GridLines from './GridLines';
import { MdSaveAlt } from "react-icons/md";
import { BiExport } from "react-icons/bi";
import DrawAndErase from './DrawAndErase';

const Sidebar = ({ setToDraw, setToErase, handleAddingNote, deleteCanvas, saveImageToLocal, handleUploadAndDisplay, handleAddingShape, toggleSidebar, handleAddingTextbox, gridCanvasRef, drawingCanvasRef, handleSaveCanvas }) => {
  const [showPalette, setShowPalette]=useState(false);
  const [open, setOpen] = useState(false);

  const handleTogglePalette=()=>{
    setShowPalette(!showPalette);
  };

  const buttons = [
    { label: 'Draw', icon: <PiPencil />, onClick: setToDraw },
    { label: 'Erase', icon: <PiEraser />, onClick: setToErase },
    { label: 'Sticky Notes', icon: <PiStickerDuotone />, onClick: handleAddingNote },
    { label: 'Delete', icon: <RiDeleteBinLine />, onClick: deleteCanvas },
    { label: 'Upload Image', icon: <PiUploadSimpleDuotone />, onClick: handleUploadAndDisplay },
    { label: 'Add Text', icon: <BsTextareaT />, onClick: handleAddingTextbox },
    { label: 'Insert Shapes', icon: <PiShapes />, onClick: handleTogglePalette },
    { label: 'Save Canvas', icon: <MdSaveAlt />, onClick: handleSaveCanvas },
  ];

  const onDrop = (type) => {
    console.log(`Selected shape: ${type}`);
    handleAddingShape(type);
  };

  const handleButtonClick = (event, onClick) => {
    if(event){
      event.preventDefault();
    }
    onClick(event);
  };

  return (
    <section className="flex">
      <div className={`bg-[#FCD34D] ${open ? 'w-72' : 'w-16'} h-screen duration-500 text-black-100 overflow-x-hidden transition-all`}>
        <div className="mt-4 flex flex-col relative">
          <div className={`py-3 flex ${open ? 'justify-start pl-2' : 'justify-center'}`}>
            <IoMenu size={26} className="cursor-pointer" onClick={()=>setOpen(!open)}
            />
          </div>
          {open
            ?buttons.map((button, index)=>(
              <button
                key={index}
                className="sidebar-button"
                onClick={(e)=> handleButtonClick(undefined, button.onClick)}>
                {button.icon}<span>{button.label}</span>
              </button>
            ))
            :buttons.map((button, index)=>(
              <button
              key={index}
              className="sidebar-button"
              onClick={(e) => handleButtonClick(undefined, button.onClick)}
            >
              {button.icon}
            </button>
          ))}

          {showPalette&&(
            <Palette onShapeSelect={(type)=>{
              console.log(`Selected shape: ${type}`);
            }}/>
          )}

          {open ? (
          <>
            <a className="sidebar-button" href="download_link" onClick={saveImageToLocal}>
              <BiExport />
              <span>Export Image</span>
            </a>
          </>
        ) : (
          <>
            <a className="sidebar-button" href="download_link" onClick={(e) => handleButtonClick(e, saveImageToLocal)}>
              <BiExport />
            </a>
          </>
        )}
        </div>
          {/* <input type="file" id="fileInput" onChange={handleFileInput} style={{ display: 'none' }}/> */}
      </div>
      <GridLines gridCanvasRef={gridCanvasRef} sidebarWidth={open?72:16}/>
      <DrawAndErase drawingCanvasRef={drawingCanvasRef} sidebarWidth={open?72:16}/>
    </section>
  );
};

export default Sidebar;