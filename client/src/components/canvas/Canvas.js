import './Canvas.css';
import {useEffect, useRef, useState} from 'react';
import Sidebar from './Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { createBoard } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import Chat from '../chat/Chat';
import Feedback from '../feedback/Feedback';

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

      gridContext.clearRect(0, 0, width, height);

      gridContext.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, height);
      }

      for (let y = 0; y <= height; y += gridSize) {
        gridContext.moveTo(0, y);
        gridContext.lineTo(width, y);
      }

      gridContext.strokeStyle = '#ddd'; // Adjust this value to change the grid color
      gridContext.stroke();
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

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    drawingContextRef.current.beginPath();
    drawingContextRef.current.moveTo(offsetX, offsetY);
    drawingContextRef.current.lineTo(offsetX, offsetY);
    drawingContextRef.current.stroke();
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({nativeEvent}) => {
    if(!isDrawing||isStickyNoteMode) {
      return;
    }
    
    const {offsetX, offsetY} = nativeEvent;
    drawingContextRef.current.lineTo(offsetX, offsetY);
    drawingContextRef.current.stroke();
    setIsChanged(true);
    //saveCanvasData(drawingCanvasRef.current.toDataURL('image/png'));
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    drawingContextRef.current.closePath();
    setIsDrawing(false);
  };

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

  return (
    <div>
      {/* <Chat /> */}
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
      <canvas className="canvas-container"
        ref={gridCanvasRef} 
        style={{ position: 'absolute' }}
      />
      <canvas className="canvas-container"
        ref={drawingCanvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}>
      </canvas>
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
    </div>
  );
};

export default Canvas;