import React, { useState } from "react";
import { DraggableCore } from 'react-draggable';
import 'react-resizable/css/styles.css';

const UploadAndDisplayImage = ({ drawingCanvasRef }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div className="canvas-container" ref={drawingCanvasRef}>
      {selectedImage && (
        <DraggableCore onDrag={handleDrag}>
            <div
              style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: '250px',
                height: '200px',
              }}
            >
              <img
                alt="not found"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                src={URL.createObjectURL(selectedImage)}
              />
              <button onClick={() => setSelectedImage(null)}>Remove</button>
            </div>
        </DraggableCore>
      )}
      
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};

export default UploadAndDisplayImage;