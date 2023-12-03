import React, { useEffect, useRef } from 'react';

const GridLines=({ drawingCanvasRef })=>{
    const gridCanvasRef = useRef(null);
    const gridContextRef = useRef(null);
    const saveInterval = useRef(null);

    useEffect(()=>{
        const gridCanvas = gridCanvasRef.current;
        const gridContext = gridCanvas.getContext('2d');
        gridContextRef.current = gridContext;

        const drawGridLines=()=>{
            const { width, height }=window.screen;
            const gridSize=20;
            const scrollX = gridCanvas.scrollLeft;
            const scrollY = gridCanvas.scrollTop;
      
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
        const resizeCanvas=()=>{
            const { width, height }=window.screen;
            // drawingCanvas.width=width;
            // drawingCanvas.height=height;
            gridCanvas.width=width;
            gridCanvas.height=height;
            drawGridLines();
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        gridCanvas.addEventListener('scroll', drawGridLines);

        return()=>{
            window.removeEventListener('resize', resizeCanvas);
            clearInterval(saveInterval.current);
        };
    },[drawingCanvasRef]);

    return(
      <div className="canvas">
        <canvas
          className="grid-container"
          ref={gridCanvasRef}
          style={{ position: 'absolute' }}
        />
      </div>

    );
};

export default GridLines;