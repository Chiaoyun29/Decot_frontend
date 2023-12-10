import React, { useState, useEffect, useContext, useRef } from "react";
import { getAllMessages, deleteMessage, getUsernameById } from '../services/api.js';
import { useAuthContext } from '../../context/AuthContext.js';
// import SocketContext from '../../context/SocketContext.js';
import { useParams } from 'react-router-dom';
import "./Chatfunction.css";
import ChatFooter from './ChatFooter.js'

const ChatBody =({ showContextMenu, setShowContextMenu, user, socket, messages, setMessages })=>{
    const { token } = useAuthContext();
    const { workspaceId, userId } = useParams();
    //const [messages, setMessages]=useState([]);
    messages = messages || [];

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
                <span className="font-semibold text-center">CHAT</span>
                    <div className="flex justify-between items-center mb-2">
                        <div className="message_container">
                            {messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message) => (
                                <div className="messages" onContextMenu={handleContextMenu} key={message.id}>
                                    {message.userId === user.id ? (
                                        <p className="sender_name">{user.username}</p>
                                        ) : (
                                        <p className="recipient_name"></p>
                                    )}
                                <div className={`message_chats ${message.userId === user.id || message.workspaceId === user.workspaceId ? 'message_sender' : 'message_recipient'}`}>
                                    <p>{message.message}</p>
                                    </div>
                                    <p id="time" className="text-center">{new Date(message.timestamp).toLocaleString()}</p>

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
                <ChatFooter socket={socket} setMessages={setMessages} messages={messages}/>
            </div>
        </div>
    );
};   

export default ChatBody;