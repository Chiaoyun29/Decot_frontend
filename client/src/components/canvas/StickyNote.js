import './Canvas.css';
import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { DraggableCore } from 'react-draggable';
import { useAuthContext } from '../../context/AuthContext';
import { createStickyNote, updateStickyNote, getStickyNotes, deleteStickyNote } from '../services/api';
// import { create } from 'xmlbuilder';

const initialNoteState={
    lastNoteCreated: null,
    totalNotes:0,
    notes: [],
};

const notesReducer=(prevState, action)=>{
    switch(action.type){
        case 'ADD_NOTE':{
            const newNote = {
                ...action.payload,
                id: action.payload.id, // Use ID from response
            };
            const newState={
                ...prevState,
                lastNoteCreated: new Date().toTimeString().slice(0,8),
                totalNotes: prevState.notes.length+1,
                notes: [...prevState.notes, newNote]
            };
            console.log('After ADD_NOTE: ', newState);
            return newState;
        }
        case 'DELETE_NOTE':{
            const newState={
                ...prevState,
                totalNotes: prevState.notes.length-1,
                notes: prevState.notes.filter(note=>note.id!==action.payload.id),
            };
            console.log('After DELETE_NOTE: ', newState);
            return newState;
        }
        case 'UPDATE_POSITION': {
            return {
            ...prevState,
                notes: prevState.notes.map(note =>
                    note.id === action.payload.id
                    ? { ...note, x: note.x + action.payload.deltaX, y: note.y + action.payload.deltaY }
                    : note
                )
            };
        }
        case 'SET_NOTES': {
            return{
                ...prevState,
                totalNotes: action.payload.length,
                notes: action.payload.map(note=>({
                    ...note,
                    x: note.x ||20,
                    y: note.y || 20,
                    width: note.width || 100,
                    height: note.height || 100,
                    rotate: note.rotate || Math.floor(Math.random() * 20),
                }))
            };
        }
    }
    return prevState;
};

const StickyNote=({ isAddingNote, setIsDrawing })=>{
    const [notesState, dispatch]=useReducer(notesReducer, initialNoteState);
    const { token } = useAuthContext();
    const { boardId, workspaceId, canvasId, stickyNoteId } = useParams();
    const[noteInput, setNoteInput]=useState('');

    const updateStickyNotes = (action) => {
        dispatch(action);
    };

    const addNote=async (event)=>{
        event.preventDefault();
        setIsDrawing(false);
        if(!noteInput){
            return;
        }
        const newNote={
            text: noteInput,
            rotate: Math.floor(Math.random()*20),
            width: 100,
            height: 100,
            x: 20,
            y: 20,
        };
        const response = await createStickyNote(token, workspaceId, boardId, canvasId, newNote.text, newNote.x, newNote.y);
        if(response.status===201){
           updateStickyNotes({ type: 'ADD_NOTE', payload: {...newNote, id: response.stickyNote.id} }); 
        }else{
            console.error('Error creating note: ', response.error);
        }
        setNoteInput('');
    };

    const handleDrag = (noteId, data) => {
        dispatch({
            type: 'UPDATE_POSITION',
            payload: { id: noteId, deltaX: data.deltaX, deltaY: data.deltaY }
        });
    };

    const handleStop = async (note) => {
        // Persist the new position to the backend
        const response = await updateStickyNote(token, workspaceId, boardId, canvasId, note.id, note.x, note.y);
        console.log("Final position:", note.x, note.y); 
        if (response.status === 200) {
            console.log('Position updated successfully');
        } else {
            console.error('Error updating note position: ', response.error);
        }
    };

    const handleDeleteNote = async(note)=>{
        const response = await deleteStickyNote(token, workspaceId, boardId, canvasId, note.id);
        if(response.status===200){
            updateStickyNotes({ type: 'DELETE_NOTE', payload: note });
        }else{
            console.error('Error deleting note: ', response.error);
        }
    }

    useEffect(()=>{
        const fetchNotes = async()=>{
            const response = await getStickyNotes(token, workspaceId, boardId, canvasId);
            if(response.status===200){
                updateStickyNotes({ type: 'SET_NOTES', payload: response.stickyNotes });
            }else{
                console.error('Error fetching notes: ', response.error);
            }
        };
        fetchNotes();
    },[token, workspaceId, boardId, canvasId]);

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

            {notesState&&notesState.notes&&notesState.notes.map(note => (
                    <DraggableCore
                        key={note.id}
                        onDrag={(e, data) => 
                            handleDrag(note.id, data)}
                            onStop={()=>handleStop(note)}
                    >
                        <div className="note" style={{      
                            position: 'absolute',
                            left: note.x,
                            top: note.y
                        }}>
                            <div onClick={() => handleDeleteNote(note)}
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