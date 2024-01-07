import React, { useState, useContext, useRef } from "react";
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
    const [unreadMessages, setUnreadMessages] = useState(0);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setShowContextMenu(true);
    };

    return (
        <div className="chat-icon-container" onContextMenu={handleContextMenu}>
            <button ref={chatRef} onClick={() => setShowMessages(!showMessages)} className="relative">
                {messages.length > 0 && (
                <span className="notification-badge">
                    {unreadMessages} 
                    {/* messages.length */}
                </span>
                )}
                <img src={icon_message} className="w-6 h-6 text-black" alt="Messages" />
            </button>

            {showMessages && (
                <ChatBody
                    showContextMenu={showContextMenu}
                    setShowContextMenu={setShowContextMenu}
                    messages={messages}
                    user={user}
                    socket={socket}
                    setMessages={setMessages}
                    setUnreadMessages={setUnreadMessages}
                />
            )}
        </div>
    );
};    

export default ChatDropdown;