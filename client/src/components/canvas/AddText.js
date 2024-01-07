import React, { useState } from 'react';
import Draggable from 'react-draggable';

const AddText = ({ isAddingTextbox, textboxes, setTextboxes }) => {
  const [text, setText] = useState('');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 });

  const handleTextChange = (event, id) => {
    const updatedTextboxes = textboxes.map(textbox => {
      if (textbox.id === id) {
        return { ...textbox, text: event.target.value };
      }
      return textbox;
    });
    setTextboxes(updatedTextboxes);
  };

  const handleSizeChange = (e) => {
    setWidth(e.target.offsetWidth);
    setHeight(e.target.offsetHeight);
  };

  const addTextbox = () => {
    const offset = 20;
    const newPosition={
      x: 50 + (textboxes.length * offset), // Starting at x: 50 and moving right
      y: 50 + (textboxes.length * offset)// Starting at y: 50 and moving down
    };
    const newTextbox = {
      id: textboxes.length + 1,
      text: '',
      width: 200,
      height: 100,
      position: newPosition
    };
    setTextboxes([...textboxes, newTextbox]);
  };

  const handleDragStop=(e, data, id)=>{
    const updatedTextboxes = textboxes.map(textbox => {
      if (textbox.id === id) {
        return { ...textbox, position: { x: data.x, y: data.y } };
      }
      return textbox;
    });
    setTextboxes(updatedTextboxes);
  };

  return (
    <div>
      {isAddingTextbox&&(
        <button className="absolute top-20 left-80 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg" onClick={addTextbox}>Add Text Box</button>
      )}
      {textboxes.map(({ id, text, width, height, position }) => (
      <Draggable 
        key={id} 
        defaultPosition={position}
        onStop={(e, data) => handleDragStop(e, data, id)}>
      <input
        type="text"
        className="canvas-container"
        style={{
          width: width + 'px',
          height: height + 'px',
          border: '1px solid #ccc',
          padding: '5px',
          resize: 'both',
          overflow: 'auto',
          direction: 'ltr',
          verticalAlign: 'top',
        }}
        value={text}
        onChange={(e)=>handleTextChange(e,id)}
        onBlur={handleSizeChange}
      />
    </Draggable>
      ))}
    </div>
  );
};

export default AddText;
