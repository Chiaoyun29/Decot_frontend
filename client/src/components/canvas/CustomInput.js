import React, { useRef, useEffect } from 'react';
import Canvas from './Canvas';

const CustomInput = ({ isStickyNoteMode, isDrawing, onChange}) =>{
    const canvasRef = useRef(null);

    useEffect(() => {
        // Ensure that canvas elements are available before accessing them
        if (Canvas.drawingCanvasRef.current) {
          Canvas.drawingCanvasRef.current.addEventListener('mousedown', startDrawing);
          Canvas.drawingCanvasRef.current.addEventListener('mousemove', draw);
          Canvas.drawingCanvasRef.current.addEventListener('mouseup', stopDrawing);
          Canvas.drawingCanvasRef.current.addEventListener('mouseleave', stopDrawing);
        }
    }, []);

    const startDrawing = ({nativeEvent}) => {
        if(!Canvas.drawingContextRef.current) return;

        const {offsetX, offsetY} = nativeEvent;
        Canvas.drawingContextRef.current.beginPath();
        Canvas.drawingContextRef.current.moveTo(offsetX, offsetY);
        Canvas.drawingContextRef.current.lineTo(offsetX, offsetY);
        Canvas.drawingContextRef.current.stroke();
        Canvas.setIsDrawing(true);
        nativeEvent.preventDefault();
    };
    
    const draw = ({nativeEvent}) => {
        if(!isDrawing||isStickyNoteMode) {
          return;
        }
        
        const {offsetX, offsetY} = nativeEvent;
        Canvas.drawingContextRef.current.lineTo(offsetX, offsetY);
        Canvas.drawingContextRef.current.stroke();
        nativeEvent.preventDefault();
    };
    
    const stopDrawing = () => {
        Canvas.drawingContextRef.current.closePath();
        Canvas.setIsDrawing(false);
    };
    
    const setToDraw = () => {
        Canvas.drawingContextRef.current.globalCompositeOperation = 'source-over';
    };
    
    const setToErase = () => {
        Canvas.drawingContextRef.current.globalCompositeOperation = 'destination-out';
    };
    
    const startStickyNote = ({ nativeEvent })=>{
        const{ offsetX, offsetY }=nativeEvent;
        Canvas.stickyNoteContextRef.current.fillStyle='yellow';
        Canvas.stickyNoteContextRef.current.fillRect(
          offsetX,
          offsetY,
          100,
          100
        );
    };
    
    const stopStickyNote=()=>{
        Canvas.setIsStickyNoteMode(!isStickyNoteMode);
    };
    
    return(
        <canvas className="canvas-container"
            ref={canvasRef}
        ></canvas>
    );
};



export default CustomInput;