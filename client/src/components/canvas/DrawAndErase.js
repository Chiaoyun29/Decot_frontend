import './Canvas.css';
import React from 'react';

const DrawAndErase=({
    drawingCanvasRef,
    drawingContextRef,
    isDrawing,
    setIsDrawing,
    setIsChanged,
    isStickyNoteMode,
})=>{
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

    return(
        <canvas className="canvas-container"
            ref={drawingCanvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}>
        </canvas>
    );
};
export default DrawAndErase;