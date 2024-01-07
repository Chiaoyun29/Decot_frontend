import React, { useEffect, useRef } from 'react';
import { Layer, Stage } from "react-konva";

const GridLines=({ drawingCanvasRef })=>{
    const gridCanvasRef = useRef(null);
    const gridContextRef = useRef(null);
    const saveInterval = useRef(null);

    useEffect(()=>{
        const drawGridLines=()=>{
            const gridCanvas = gridCanvasRef.current;
            const gridContext = gridCanvas.getContext('2d');
            gridContextRef.current = gridContext;
            const { width, height }=window.screen;
            const gridSize=20;
            const scrollX = gridCanvas.scrollLeft;
            const scrollY = gridCanvas.scrollTop;
      
            gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      
            gridContext.beginPath();
            for (let x = -scrollX%gridSize; x <= gridCanvas.width; x += gridSize) {
              gridContext.moveTo(x, 0);
              gridContext.lineTo(x, gridCanvas.height);
            }
      
            for (let y = -scrollY%gridSize; y <= gridCanvas.height; y += gridSize) {
              gridContext.moveTo(0, y);
              gridContext.lineTo(gridCanvas.width, y);
            }
      
            gridContext.strokeStyle = '#ddd'; // Adjust this value to change the grid color
            gridContext.stroke();
        };
        const resizeCanvas=()=>{
            const gridCanvas = gridCanvasRef.current;
            // drawingCanvas.width=width;
            // drawingCanvas.height=height;
            gridCanvas.width=window.innerWidth;
            gridCanvas.height=window.innerHeight;
            drawGridLines();
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        //gridCanvas.addEventListener('scroll', drawGridLines);

        return()=>{
            window.removeEventListener('resize', resizeCanvas);
            clearInterval(saveInterval.current);
        };
    },[]);

    return(
      <div className="canvas">
        <canvas
          className="grid-container"
          ref={gridCanvasRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>

    );
};

export default GridLines;