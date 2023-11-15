import './Canvas.css';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import Sidebar from './Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { createBoard } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import Feedback from '../feedback/Feedback';
import DrawAndErase from './DrawAndErase';
import PropertiesPanel from './PropertiesPanel';
import { Layer, Stage } from "react-konva";
import { useShapes, createCircle, createRectangle, clearSelection } from "./state";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";
import Shape from "./Shape";

const handleDragOver = (event)=>event.preventDefault();

const Canvas = () => {
  const drawingCanvasRef = useRef(null);
  const drawingContextRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const gridContextRef = useRef(null);
  const stickyNoteCanvasRef = useRef(null);
  const stickyNoteContextRef = useRef(null);
  const { user } = useAuthContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isStickyNoteMode, setIsStickyNoteMode] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const saveInterval = useRef(null);
  const shapes = useShapes((state)=>Object.entries(state.shapes));
  //const handleDragOver = (event)=>event.preventDefault();
  
  useEffect(()=>{
    if(user){
      navigate('/canvas')
    }
  })
  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const gridCanvas = gridCanvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");
    const gridContext = gridCanvas.getContext("2d");
    const stickyNoteCanvas = stickyNoteCanvasRef.current;
    const stickyNoteContext = stickyNoteCanvas.getContext("2d");
    stickyNoteContextRef.current = stickyNoteContext;

    drawingContextRef.current = drawingContext;
    gridContextRef.current = gridContext;

    const resizeCanvas=()=>{
      const { width, height }=window.screen;
      drawingCanvas.width=width;
      drawingCanvas.height=height;
      gridCanvas.width=width;
      gridCanvas.height=height;
      drawGridLines();
    };
    const drawGridLines=()=>{
      const { width, height }=drawingCanvas;
      const gridSize=20;
      const scrollX = drawingCanvas.scrollLeft;
      const scrollY = drawingCanvas.scrollTop;

      gridContext.clearRect(0, 0, width, height);

      gridContext.beginPath();
      for (let x = -scrollX%gridSize; x <= width; x += gridSize) {
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, height);
      }

      for (let y = -scrollY%gridSize; y <= height; y += gridSize) {
        gridContext.moveTo(0, y);
        gridContext.lineTo(width, y);
      }

      gridContext.strokeStyle = '#ddd'; // Adjust this value to change the grid color
      gridContext.stroke();
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawingCanvas.addEventListener('scroll', drawGridLines);
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

  const startStickyNote = ({ nativeEvent })=>{
    const{ offsetX, offsetY }=nativeEvent;
    stickyNoteContextRef.current.fillStyle='yellow';
    stickyNoteContextRef.current.fillRect(
      offsetX,
      offsetY,
      100,
      100
    );
  };

  const stopStickyNote=()=>{
    setIsStickyNoteMode(!isStickyNoteMode);
  };

  const toggleStickyNoteMode=()=>{
    setIsStickyNoteMode(!isStickyNoteMode);
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

  // const navigateToCreateBoard = async() => {
  //   try{
  //     const response = await createBoard(token, boardTitle, '', '', '');
  //     if(response.status===200){
  //       const boardId = response.boardId;
  //       navigate(`/createBoardModal/${boardId}`);
  //     }else{
  //       console.error('Failed to create board:', response.error);
  //     }
  //   }catch(error){
  //     console.error('Failed to create board:', error);
  //   }
  // };

  const HandleUploadAndDisplay = () => {
    axios.post('http://localhost:5000/canvas/imageUpload', image)
    .then(res =>{
      console.log('Axios response: ', res)
    })
  };

  const handleFileInput = (e) => {
    console.log('handleFileInput working!')
  };

  const handleDrop = useCallback((event)=>{
    const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);
    if(draggedData){
      const{ offsetX, offsetY, type, clientHeight, clientWidth }=JSON.parse(draggedData);
      gridCanvasRef.current.setPointersPositions(event);
      const coords = drawingCanvasRef().current.getPointerPosition();
      if(type===SHAPE_TYPES.RECT){
        createRectangle({
          X: coords.X - offsetX,
          y: coords.y - offsetY,
          width: clientWidth,  // Add width and height properties if needed
          height: clientHeight,
        });
      }else if(type===SHAPE_TYPES.CIRCLE){
        createCircle({
          x: coords.x - (offsetX - clientWidth / 2),
          y: coords.y - (offsetY - clientHeight / 2),
          radius: clientWidth/2,
        });
      }
    }
  }, []);

  return (
    <div>
      {/* <Chat /> */}
      {/* <canvas className="canvas-container" onDrop={handleDrop} onDragOver={handleDragOver}>
        <Stage ref={gridCanvasRef} style={{ position: 'absolute' }} onClick={clearSelection}>
          <Layer>
            {shapes.map(([key, shape]) => (
              <Shape key={key} shape={{ ...shape, id: key }} />
            ))}
          </Layer>
        </Stage>
      </canvas> */}
      <canvas className="canvas-container"
        ref={gridCanvasRef} 
        style={{ position: 'absolute' }}
      />
      <DrawAndErase 
        drawingCanvasRef={drawingCanvasRef}
        drawingContextRef={drawingContextRef}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        setIsChanged={setIsChanged}
        isStickyNoteMode={isStickyNoteMode}
      />
      <canvas
        className="canvas-container"
        ref={stickyNoteCanvasRef}
        style={{
          position: "absolute",
          pointerEvents: isStickyNoteMode ? "auto" : "none"
        }}
        onMouseDown={startStickyNote}
        onMouseUp={stopStickyNote}
      />
      <Sidebar
        setToDraw={setToDraw}
        setToErase={setToErase}
        toggleStickyNoteMode={toggleStickyNoteMode}
        //isStickyNoteMode={isStickyNoteMode}
        deleteCanvas={deleteCanvas}
        saveImageToLocal={saveImageToLocal}
        //navigateToCreateBoard={navigateToCreateBoard}
        HandleUploadAndDisplay={HandleUploadAndDisplay}
      />
      {/* <Feedback /> */}
      <PropertiesPanel />
    </div>
  );
};

export default Canvas;