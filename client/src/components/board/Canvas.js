import './Canvas.css';
import {useEffect, useRef, useState} from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Canvas = () => {
  const drawingCanvasRef = useRef(null);
  const drawingContextRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const gridContextRef = useRef(null);
  const stickyNoteCanvasRef = useRef(null);
  const stickyNoteContextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isStickyNoteMode, setIsStickyNoteMode] = useState(false);

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

    return()=>{
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
      "Are you sure you want to delete the drawing?"
    );
    if(confirmDelete){
      drawingContextRef.current.clearRect(
        0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height
      );
    }
  };

  return (
    <div>
      <Sidebar
        setToDraw={setToDraw}
        setToErase={setToErase}
        toggleStickyNoteMode={toggleStickyNoteMode}
        //isStickyNoteMode={isStickyNoteMode}
        deleteCanvas={deleteCanvas}
        saveImageToLocal={saveImageToLocal}
      />
      {/* <div>
      <button class="display_under" onClick={setToDraw}>
          Draw
        </button>
        <button class="display_under" onClick={setToErase}>
          Erase
        </button>
        <button class="display_under" onClick={toggleStickyNoteMode}>
          {isStickyNoteMode?"Exit Sticky Notes": "Sticky Notes"}
        </button>
        <button class="display_under" onClick={deleteCanvas}>
          Delete
        </button>
        <a class="display_under" id="download_image_link" href="download_link" onClick={saveImageToLocal}>Download Image</a>
      </div> */}
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