import './Rectangle.css';
import {useEffect, useRef, useState} from 'react';

const Rectangle = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const canvasOffSetX = useRef(null);
  const canvasOffSetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();
    canvasOffSetX.current = canvasOffSet.top;
    canvasOffSetY.current = canvasOffSet.left;

    const resizeCanvas=()=>{
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;
      drawGridLines();
    };
    const drawGridLines=()=>{
      const { width, height }=canvas;
      const gridSize=20;
      const numColumns = Math.ceil(width / gridSize);
      const numRows = Math.ceil(height / gridSize);

      context.clearRect(0, 0, width, height);

      context.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }

      for (let y = 0; y <= height; y += gridSize) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }

      context.strokeStyle = '#ddd'; // Adjust this value to change the grid color
      context.stroke();
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return()=>{
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const startDrawingRectangle = ({nativeEvent}) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    startX.current = nativeEvent.clientX - canvasOffSetX.current;
    startY.current = nativeEvent.clientY - canvasOffSetY.current;

    setIsDrawing(true);
  };

  const drawRectangle = ({nativeEvent}) => {
    if (!isDrawing) {
      return;
    }

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
    const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

    const rectWidht = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    contextRef.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
  };

  const stopDrawingRectangle = () => {
    setIsDrawing(false);
  };

  const saveImageToLocal = (event) => {
    let link = event.currentTarget;
    link.setAttribute('download', 'canvas.png');
    let image = canvasRef.current.toDataURL('image/png');
    link.setAttribute('href', image);
  };
  return (
    <div>
      <canvas ref={canvasRef} className="canvas-container-rect"
        onMouseDown={startDrawingRectangle}
        onMouseMove={drawRectangle}
        onMouseUp={stopDrawingRectangle}
        onMouseLeave={stopDrawingRectangle}>
      </canvas>
      <div>
        <button>
          <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>Download Image</a>
          </button>
      </div>
    </div>
  )
}

export default Rectangle;