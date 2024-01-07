import React, { useState } from "react";
import { DraggableCore } from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const UploadAndDisplayImage = ({ drawingCanvasRef }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 250, height: 200 });

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e, { size }) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <div className="canvas-container" ref={drawingCanvasRef}>
      {selectedImage && (
        <DraggableCore onDrag={handleDrag}>
          <ResizableBox
            width={size.width}
            height={size.height}
            minConstraints={[100, 100]}
            maxConstraints={[500, 500]}
            onResize={handleResize}
            handle={<span className="react-resizable-handle" />}
          >
            <div
              style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
              }}
            >
              <img
                alt="not found"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                src={URL.createObjectURL(selectedImage)}
              />
              <button onClick={() => setSelectedImage(null)}>Remove</button>
            </div>
          </ResizableBox>
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