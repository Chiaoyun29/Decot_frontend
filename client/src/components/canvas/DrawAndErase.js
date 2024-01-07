import './Canvas.css';
import React, { useState } from 'react';

const DrawAndErase=({
    drawingCanvasRef,
    drawingContextRef,
    setIsChanged,
    setDrawingData,
    isDrawing,
    setIsDrawing,
    isErasing,
    setIsErasing
})=>{
    const [isMouseDown, setIsMouseDown] = useState(false);

    const startDrawing = ({nativeEvent}) => {
        if (!isDrawing) return;
        setIsMouseDown(true);
        const {offsetX, offsetY} = nativeEvent;
        drawingContextRef.current.beginPath();
        drawingContextRef.current.moveTo(offsetX, offsetY);
        drawingContextRef.current.lineTo(offsetX, offsetY);
        drawingContextRef.current.stroke();
        setIsDrawing(true);

        setDrawingData((prevDrawingData) => {
            if(!Array.isArray(prevDrawingData)){
                console.error('prevDrawingData is not an array:', prevDrawingData);
                return [];
            }
            return [...prevDrawingData,
            { type: 'start', x: offsetX, y: offsetY }];
        });
        nativeEvent.preventDefault();
    };

    const draw = ({nativeEvent}) => {
    if(!isMouseDown||!isDrawing) return;
        const {offsetX, offsetY} = nativeEvent;
        drawingContextRef.current.lineTo(offsetX, offsetY);
        drawingContextRef.current.stroke();
        setIsChanged(true);
        setDrawingData((prevDrawingData) => [
            ...prevDrawingData,
            { type: 'draw', x: offsetX, y: offsetY },
        ]);
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        setIsMouseDown(false);
        if(!isDrawing) return;
        drawingContextRef.current.closePath();
    };

    return(
        <div>
            <canvas className="canvas-container"
                ref={drawingCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}>
            </canvas>
        </div>
    );
};
export default DrawAndErase;