import React, { useEffect, useRef } from 'react';

const GridLines = () => {
    const gridCanvasRef = useRef(null);

    const drawGridLines = () => {
        const gridCanvas = gridCanvasRef.current;
        const gridContext = gridCanvas.getContext('2d');
        const gridSize = 20;

        gridCanvas.width = window.innerWidth;
        gridCanvas.height = window.innerHeight;

        gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      
        gridContext.beginPath();
        for (let x = 0; x <= gridCanvas.width; x += gridSize) {
            gridContext.moveTo(x, 0);
            gridContext.lineTo(x, gridCanvas.height);
        }
      
        for (let y = 0; y <= gridCanvas.height; y += gridSize) {
            gridContext.moveTo(0, y);
            gridContext.lineTo(gridCanvas.width, y);
        }
      
        gridContext.strokeStyle = '#ddd'; // Grid color
        gridContext.stroke();
    };

    useEffect(() => {
        const resizeCanvas = () => drawGridLines();

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
      <div className="canvas" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
        <canvas
          ref={gridCanvasRef}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
      </div>
    );
};

export default GridLines;
