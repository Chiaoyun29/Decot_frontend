import React, { useState, useEffect, useContext, useRef } from "react";
import { getAllMessages, deleteMessage, getUsernameById, updateReadStatus } from '../services/api.js';
import { useAuthContext } from '../../context/AuthContext.js';
import SocketContext from '../../context/SocketContext.js';
import { useParams } from 'react-router-dom';
import "./Chatfunction.css";
import ChatFooter from './ChatFooter.js'

const ChatBody =({ showContextMenu, setShowContextMenu, user, messages, setMessages, setUnreadMessages })=>{
    const { token } = useAuthContext();
    const { workspaceId, userId } = useParams();
    const { socket } = useContext(SocketContext);
    const [ usernames, setUsernames ] = useState({});

    const fetchMessages = async () => {
        const response = await getAllMessages(token, workspaceId);
        console.log(response);
        if (response.status === 200) {
            setMessages(response.messages);
        } else {
            console.error(response.error);
        }
    };

    const fetchUsernames = async () => {
        const newUsernames = {};
        for (const message of messages) {
            if (!newUsernames[message.userId]) {
                const response = await getUsernameById(token, message.userId);
                if (response.status === 200) {
                    newUsernames[message.userId] = response.username;
                }
            }
        }
        setUsernames(newUsernames);
    };

    useEffect(()=>{
        fetchMessages();
        fetchUsernames();

    }, [messages]);

    useEffect(()=>{
        //socket.on('messageResponse', (data)=>setMessages([...messages, data]));
        // test this
        const newUnreadMessages = messages.reduce((count, msg) => (msg.read ? count : count + 1), 0);
        setUnreadMessages(newUnreadMessages);

        const unreadMessagesToUpdate = messages.filter((msg) => !msg.read);
        if (unreadMessagesToUpdate.length > 0) {
            updateReadStatus(token, unreadMessagesToUpdate.map((msg) => msg.id), workspaceId);
        }
    },[messages]);

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setShowContextMenu(true);
    };

    const handleDeleteMessage = async (messageId) => {
        try {
          await deleteMessage(token, messageId, workspaceId);
          setMessages(prevMessages => prevMessages.filter((message) => message.id !== messageId));
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
                            {messages.map((message) => (
                                <div className="messages" onContextMenu={handleContextMenu} key={message.id}>
                                    {message.userId === user.id ? (
                                        <p className="sender_name">{user.username}</p>
                                        ) : (
                                        <p className="recipient_name">{usernames[message.userId]}</p> //got some error
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