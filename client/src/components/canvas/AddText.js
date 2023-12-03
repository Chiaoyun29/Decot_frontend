import React, { useState } from 'react';
import Draggable from 'react-draggable';

const AddText = ({ textboxRef }) => {
  const [text, setText] = useState('');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSizeChange = (e) => {
    setWidth(e.target.offsetWidth);
    setHeight(e.target.offsetHeight);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - position.x;
      const newY = e.clientY - position.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Draggable>
      <input
        ref={textboxRef}
        type="text"
        style={{
          position: 'absolute',
          left: position.x + 'px',
          top: position.y + 'px',
          width: width + 'px',
          height: height + 'px',
          border: '1px solid #ccc',
          padding: '5px',
          resize: 'both',
          overflow: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          direction: 'ltr',
          verticalAlign: 'top',
        }}
        value={text}
        onInput={handleTextChange}
        onBlur={handleSizeChange}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </Draggable>
  );
};

export default AddText;
