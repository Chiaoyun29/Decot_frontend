import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { createTextbox, getTextboxes, updateTextbox, deleteTextbox } from '../services/api';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import _debounce from 'lodash/debounce';

const AddText = ({ isAddingTextbox, textboxes, setTextboxes }) => {
  // const [position, setPosition] = useState({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 });
  const { token } = useAuthContext();
  const { boardId, workspaceId, canvasId } = useParams();
  const [selectedTextboxId, setSelectedTextboxId] = useState(null);

  const selectTextbox = (id) =>{
    setSelectedTextboxId(id);
  };

  const handleDragStop = (e, data, id) => {
    const textbox = textboxes.find(t => t.id === id);
    if (textbox) {
      const newPosition = { x: data.x, y: data.y };
      updateTextboxStateAndBackend(id, textbox.text, newPosition);
      console.log("hello",data);
    }
  };

  const updateTextboxStateAndBackend = async (id, newText, newPosition) => {
    console.log("Updating textbox:", newPosition);
    const updatedTextboxes = textboxes.map(textbox => {
      if (textbox.id === id) {
        return { ...textbox, text: newText, position: newPosition };
      }
      return textbox;
    });
    setTextboxes(updatedTextboxes);
    try {
      const response = await updateTextbox(token, workspaceId, boardId, canvasId, id, newText, newPosition.x, newPosition.y);
      if (response.status !== 200) {
        console.error('Error updating textbox:', response.error);
      }   
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const debouncedUpdateTextboxStateAndBackend = _debounce(updateTextboxStateAndBackend, 200);

  const handleTextChange = (event, id) => {
    const updatedTextboxes = textboxes.map(textbox => {
      if (textbox.id === id) {
        return { ...textbox, text: event.target.value };
      }
      return textbox;
    });
    setTextboxes(updatedTextboxes);

    debouncedUpdateTextboxStateAndBackend(id, event.target.value, textboxes.find(t => t.id === id).position);
  };

  const addTextbox = async () => {
    const newPosition={
      x: 20,
      y: 20,
    };
    const newTextbox = {
      text: '',
      width: 200,
      height: 100,
      position: newPosition
    };
    try{
      const response = await createTextbox(token, workspaceId, boardId, canvasId, newTextbox.text, newPosition.x, newPosition.y);
      if(response.status===201){
        const positionFromResponse = response.textbox && response.textbox.newPosition ? response.textbox.newPosition : newPosition;
        setTextboxes([...textboxes, {...newTextbox, id: response.textbox.id, position: positionFromResponse }]);
      }else{
        console.error('Error creating textbox:', response.error);
      }
    }catch(error){
      console.error('Error:', error);
    }
  };
  
  const handleKeyDown=async(e)=>{
    if((e.key==='Delete'||e.key==='Escape')&&selectedTextboxId !==null){
      try{
        const response = await deleteTextbox(token, workspaceId, boardId, canvasId, selectedTextboxId );
        if(response.status===200){
          const updatedTextboxes = textboxes.filter(textbox => textbox.id !== selectedTextboxId);
          setTextboxes(updatedTextboxes);
          setSelectedTextboxId(null);
        }else{
          console.error('Error deleting textbox:', response.error);
        }
      }catch(error){
        console.error('Error:', error);
      }
    }
  };

  useEffect(()=>{
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTextboxId, textboxes ]);

  useEffect(()=>{
    const fetchTextboxes = async()=>{
        const response = await getTextboxes(token, workspaceId, boardId, canvasId);
        console.log(response);
        if(response.status===200){
          console.log("Textboxes data:", response.textboxes);
          setTextboxes(response.textboxes);
        }else{
            console.error('Error fetching textboxes: ', response.error);
        }
      };
      fetchTextboxes();
  },[token, workspaceId, boardId, canvasId, setTextboxes]);

  return (
    <div>
      {isAddingTextbox&&(
        <button className="absolute top-20 left-80 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg" onClick={addTextbox}>Add Text Box</button>
      )}
      {textboxes.map(({ id, text, x, y, position }) => (
        <Draggable
          key={id}
          position={{"x": x, "y": y}} //{x: x, y: y} {"x": x, "y": y}
          onStop={(e, data) => handleDragStop(e, data, id)}>
            <input
              type="text"
              className="canvas-container"
              onClick={()=>selectTextbox(id)}
              style={{
                border: '1px solid #ccc',
                padding: '5px',
                overflow: 'auto',
                direction: 'ltr',
                verticalAlign: 'top',
                // left: x + 'px',
                // top: y + 'px'
              }}
              value={text}
              onChange={(e)=>handleTextChange(e,id)}
          />
        </Draggable>
      ))}
    </div>
  );
};

export default AddText;