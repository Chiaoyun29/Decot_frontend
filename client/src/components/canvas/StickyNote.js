import './Canvas.css';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DraggableCore } from 'react-draggable';

const StickyNote=({ isAddingNote, setIsDrawing, updateStickyNotes, notesState })=>{
    //const [notesState, dispatch]=useReducer(notesReducer, initialNoteState);
    const[noteInput, setNoteInput]=useState('');

    const addNote=(event)=>{
        event.preventDefault();
        setIsDrawing(false);
        if(!noteInput){
            return;
        }
        const newNote={
            id: uuid(),
            text: noteInput,
            rotate: Math.floor(Math.random()*20),
            width: 100,
            height: 100,
            x: 20,
            y: 20,
        };
        updateStickyNotes({ type: 'ADD_NOTE', payload: newNote });
        setNoteInput('');
    };

    const updatePosition = (e, data, note) => {
        const newX = note.x + data.deltaX;
        const newY = note.y + data.deltaY;
        updateStickyNotes({ type: 'UPDATE_POSITION', payload: { id: note.id, x: newX, y: newY } });
    };

    return (
        <div className="absolute top-20 left-80 text-white px-4 py-2"  > 
            {isAddingNote && (
            <form className="note-form" onSubmit={addNote}>
                <textarea placeholder="Create a new note..." 
                    value={noteInput}
                    onChange={event => setNoteInput(event.target.value)}>
                </textarea>
                <button>Add</button>
            </form>)}

            {notesState
                .notes
                .map(note => (
                    <DraggableCore
                        key={note.id}
                        onDrag={(e, data) => {
                            updatePosition(e, data, note);
                        }}
                    >

                        <div className="note" style={{      
                            position: 'absolute',
                            left: note.x,
                            top: note.y
                        }}>
                            <div onClick={() => updateStickyNotes({ type: 'DELETE_NOTE', payload: note })}
                                className="close">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>

                            <pre className="text">{note.text}</pre>
                        </div>
                    </DraggableCore>
                ))
            }
        </div> 
    );
};
export default StickyNote;