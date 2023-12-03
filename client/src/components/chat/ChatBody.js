import React, { useState, useEffect, useContext, useRef } from "react";
import { getAllMessages, deleteMessage } from '../services/api.js';
import { useAuthContext } from '../../context/AuthContext.js';
// import SocketContext from '../../context/SocketContext.js';
import { useParams } from 'react-router-dom';
import "./Chatfunction.css";
import ChatFooter from './ChatFooter.js'

const ChatBody =({ showContextMenu, setShowContextMenu, messages, user, socket, setMessages })=>{
    const { token } = useAuthContext();
    const { workspaceId } = useParams();

    const fetchMessages = async () => {
        const response = await getAllMessages(token, workspaceId);
        console.log(response);
        if (response.status === 200) {
        setMessages(response.messages);
        } else {
        console.error(response.error);
        }
    };

    useEffect(()=>{
        fetchMessages();
    }, [workspaceId, token]);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setShowContextMenu(true);
    };

    const handleDeleteMessage = async (messageId) => {
        try {
          await deleteMessage(token, messageId, workspaceId);
          setMessages(messages.filter((message)=>message.id!==messageId));
          socket.emit('message_deleted', messageId);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
    };

    return (
        <div>
            {/*Chat Box*/}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 chat-dropdown">
                <span className="font-semibold">CHAT</span><div className="flex justify-between items-center mb-2">
                    <div className="message_container">
                        {messages.slice().reverse().map((message) => (
                            <div className="messages" key={message.id} onContextMenu={handleContextMenu}>
                                <div className="message_chats">
                                    <p className="sender_name">{user.username}</p>
                                    <div className="message_sender">
                                        <p>{message.message}</p>
                                    </div>
                                    <p id="time">{new Date(message.timestamp).toLocaleString()}</p>
                                </div>

                                {showContextMenu && (
                                    <div className="context-menu">
                                        <button onClick={() => handleDeleteMessage(message.id)} className="delete-button">
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <ChatFooter socket={socket} setMessages={setMessages}/>
            </div>
        </div>
    );
};    

export default ChatBody;