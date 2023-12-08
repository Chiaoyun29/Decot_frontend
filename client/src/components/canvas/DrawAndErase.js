import './Canvas.css';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.js';

const DrawAndErase=({
    drawingCanvasRef,
    drawingContextRef,
    isDrawing,
    setIsDrawing,
    setIsChanged,
    isStickyNoteMode,
    setDrawingData,
})=>{
    // const [drawingData, setDrawingData] = useState([]);
    // const { token } = useAuthContext();

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        drawingContextRef.current.beginPath();
        drawingContextRef.current.moveTo(offsetX, offsetY);
        drawingContextRef.current.lineTo(offsetX, offsetY);
        drawingContextRef.current.stroke();
        setIsDrawing(true);

        setDrawingData((prevDrawingData) => [
            ...prevDrawingData,
            { type: 'start', x: offsetX, y: offsetY },
        ]);
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
        setDrawingData((prevDrawingData) => [
            ...prevDrawingData,
            { type: 'draw', x: offsetX, y: offsetY },
        ]);
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        drawingContextRef.current.closePath();
        setIsDrawing(false);
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