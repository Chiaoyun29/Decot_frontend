import React, { useState, useEffect, useContext, useRef } from "react";
import icon_message from '../../image/icon_message.svg';
import "./Chatfunction.css";
import ChatBody from './ChatBody.js';
import { useAuthContext } from '../../context/AuthContext.js';
import SocketContext from '../../context/SocketContext.js';

const ChatDropdown =()=>{
    const [messages, setMessages]=useState([]);
    const [showMessages, setShowMessages] = useState(false);
    const chatRef = useRef(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const { user } = useAuthContext();
    const { socket } = useContext(SocketContext);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setShowContextMenu(true);
    };

    useEffect(()=>{
        socket.on('messageResponse', (data)=>setMessages([...messages, data]))
    },[socket, messages]);

    return (
        <div className="chat-icon-container" onContextMenu={handleContextMenu}>
            <button ref={chatRef} onClick={() => setShowMessages(!showMessages)} className="relative">
                <img src={icon_message} className="w-6 h-6 text-black" alt="Messages" />
                    {messages.length > 0 && (
                    <span className="notification-badge">
                        {messages.length}
                    </span>
                )}
            </button>

            {showMessages && (
                <ChatBody
                    showContextMenu={showContextMenu}
                    setShowContextMenu={setShowContextMenu}
                    messages={messages}
                    user={user}
                    socket={socket}
                    setMessages={setMessages}
                />
            )}
        </div>
    );
};    

export default ChatDropdown;