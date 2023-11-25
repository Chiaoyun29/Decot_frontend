import React, { useState, useEffect, useContext, useRef } from "react";
import icon_message from '../../image/icon_message.svg';
import { getAllMessages, deleteMessage } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import { useParams } from 'react-router-dom';
import "./Chatfunction.css";
import ChatFooter from './ChatFooter.js'

const Chat =()=>{
    const [messages, setMessages]=useState([]);
    const { token } = useAuthContext();
    const { socket } = useContext(SocketContext);
    const { workspaceId } = useParams();
    const chatRef = useRef(null);
    const [showMessages, setShowMessages] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);

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

    useEffect(()=>{
        if(socket){
            console.log('Socket connected!');
            fetchMessages();
            socket.on('send_message', (data)=>{
                setMessages((prevMessages)=>[...prevMessages, data]);
            });
            socket.on('message_deleted', (deletedMessageId) => {
                setMessages((prevMessages) => prevMessages.filter(message => message.id !== deletedMessageId));
            });
        }
        return()=>{
            if(socket){
                socket.off('send_message');
                socket.off('message_deleted');
            }
        };
    }, [socket]);

    const handleDeleteMessage = async (messageId) => {
        try {
          await deleteMessage(token, messageId, workspaceId);
          setMessages(messages.filter((message)=>message.id!==messageId));
          socket.emit('message_deleted', messageId);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
        setShowContextMenu(true);
    };

    return (
        <div className="relative text-center z-100" onContextMenu={handleContextMenu}>
            <button ref={chatRef} onClick={() => setShowMessages(!showMessages)} className="relative">
                <img src={icon_message} className="w-6 h-6 text-black" alt="Messages" />
                {messages.length > 0 && (
                <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs text-center text-white bg-red-500 rounded-full">
                    {messages.length}
                </span>
                )}
            </button>

            {/*Chat Box*/}
            {showMessages && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2 chat-dropdown">
                    <span className="font-semibold">CHAT</span>
                    <div className="flex justify-between items-center mb-2">
                        <div className="message_container">
                            {messages.slice().reverse().map((message) => (
                                <div className="messages" key={message.id}>
                                    <div className="message_chats">
                                        <p className="sender_name">{message.userId}</p>
                                        <div className="message_sender">
                                            <p>{message.message}</p>
                                        </div>
                                        <p id="time">{message.timestamp}</p>
                                    </div>
                                    
                                    {showContextMenu&&(
                                        <div className="context-menu">
                                            <button onClick={()=> handleDeleteMessage(message.id)} className="delete-button">
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                            ))}
                        </div>
                    </div>
                    <ChatFooter />
                </div>
            )}
        </div>
    );
};    

export default Chat;