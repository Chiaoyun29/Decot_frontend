import './Canvas.css';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import Sidebar from './Sidebar';
import GridLines from './GridLines';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import DrawAndErase from './DrawAndErase';
import StickyNote from './StickyNote';
import { PropertiesPanel } from './PropertiesPanel';
import { useShapes } from "./state";
import ShapeCanvas from "./ShapeCanvas";
import AddText from './AddText';

const Canvas = () => {
  const { boardId, workspaceId, canvasId } = useParams();
  const drawingCanvasRef = useRef(null);
  const drawingContextRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const stickyNoteCanvasRef = useRef(null);
  const saveInterval = useRef(null);
  const shapeCanvasRef = useRef(null);
  const shapeContextRef = useRef(null);
  const { user } = useAuthContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isStickyNoteMode, setIsStickyNoteMode] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const shapes = useShapes((state)=>Object.entries(state.shapes));
  const [isAddingShape, setIsAddingShape] = useState(false);
  const stageRef=useRef(null);
  const [isAddingTextbox, setIsAddingTextbox] = useState(false);
  const textboxRef = useRef(null);
  
  useEffect(()=>{
    if(user){
      navigate(`/workspace/${workspaceId}/board/${boardId}/canvas/${canvasId}`)
    }
  })
  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");
    drawingContextRef.current = drawingContext;

    const resizeCanvas=()=>{
      const { width, height }=window.screen;
      drawingCanvas.width=width;
      drawingCanvas.height=height;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    /* const saveCanvasData = (canvasData) =>{
      axios.post('/api/saveCanvas', { canvasData })
        .then((response) => {
          console.log('Canvas data saved successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error saving canvas data:', error);
        });
    };
    saveInterval.current = setInterval(saveCanvasData, 1000);
    */
    return()=>{
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(saveInterval.current);
    };
  }, [isChanged]);

  const setToDraw = () => {
    drawingContextRef.current.globalCompositeOperation = 'source-over';
  };

  const setToErase = () => {
    drawingContextRef.current.globalCompositeOperation = 'destination-out';
  };

  const addNote = (event)=>{
    event.preventDefault();
    console.log('Note added:', event.target.elements[0].value);
    setIsAddingNote(false);
  };

  const handleAddingNote=()=>{
    setIsAddingNote(!isAddingNote);
  };

  const saveImageToLocal = (event) => {
    let link = event.currentTarget;
    link.setAttribute('download', 'canvas.png');
    let image = drawingCanvasRef.current.toDataURL('image/png');
    link.setAttribute('href', image);
  };

  const deleteCanvas = ()=>{
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the drawing in the canvas?"
    );
    if(confirmDelete){
      drawingContextRef.current.clearRect(
        0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height
      );
    }
  };

  const HandleUploadAndDisplay = () => {//need to use socket?
    axios.post('http://localhost:5000/canvas/imageUpload', image)
    .then(res =>{
      console.log('Axios response: ', res)
    })
  };

  const handleFileInput = (e) => {
    console.log('handleFileInput working!')
  };

  const handleAddingShape=()=>{
    setIsAddingShape(!isAddingShape);
  };

  const addShape = (event)=>{
    event.preventDefault();
    console.log('Shape added:', event.target.elements[0].value);
    setIsAddingShape(false);
  };

  const handleAddingTextbox=()=>{
    setIsAddingTextbox(!isAddingTextbox);
  };

  const addText = (event)=>{
    event.preventDefault();
    console.log('Text added:', event.target.elements[0].value);
    setIsAddingTextbox(false);
  };

  return (
    <div>
      <Sidebar
        setToDraw={setToDraw}
        setToErase={setToErase}
        handleAddingNote={handleAddingNote}
        deleteCanvas={deleteCanvas}
        saveImageToLocal={saveImageToLocal}
        HandleUploadAndDisplay={HandleUploadAndDisplay}
        handleAddingShape={handleAddingShape}
        handleAddingTextbox={handleAddingTextbox}
      />
      <DrawAndErase 
        drawingCanvasRef={drawingCanvasRef}
        drawingContextRef={drawingContextRef}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        setIsChanged={setIsChanged}
        isStickyNoteMode={isStickyNoteMode}
      />
      {isAddingNote&&(
        <StickyNote
          stickyNoteCanvasRef={stickyNoteCanvasRef}
          isAddingNote={isAddingNote}
          addNote={addNote}
        />
      )}
      {isAddingShape&&(
        <ShapeCanvas 
          stageRef={stageRef}
          handleAddingShape={handleAddingShape}
          addShape={addShape}
      />
      )}
      {isAddingTextbox&&(
        <AddText 
          textboxRef={textboxRef}
          handleAddingTextbox={handleAddingTextbox}
          AddText={addText}
      />
      )}
      {/* <PropertiesPanel />*/}
    </div>
  );
};

export default Canvas;