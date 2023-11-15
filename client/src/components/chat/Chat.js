import React, { useState, useEffect, useContext, useRef } from "react";
import icon_message from '../../image/icon_message.svg';
import { createMessage, getAllMessages, deleteMessage } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import { useParams } from 'react-router-dom';
//import "./Chatfunction.css";

const Chat =()=>{
    const [isOpen, setIsOpen]=useState(false);
    const [messages, setMessages]=useState([]);
    const [message, setMessage]=useState([]);
    const { token } = useAuthContext();
    const { socket } = useContext(SocketContext);
    const { workspaceId } = useParams();
    const chatRef = useRef(null);
    const [showMessages, setShowMessages] = useState(false);

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
            socket.on('receive_message', (data)=>{
                setMessages((prevMessages)=>[...prevMessages, data]);
            });
        }
        return()=>{
            if(socket){
                socket.off('receive_message');
            }
        };
    }, [socket]);

    const sendMessage = async () => {
        try {
            const response = await createMessage(token, message, workspaceId);
            console.log("dgjgshd",response);
            if (response.message) {
              const { message } = response.message;
              setMessage('');
              socket.emit('send_message', message);
            }
            setMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };  

    const handleDeleteMessage = async (messageId) => {
        try {
          await deleteMessage(token, messageId);
          setMessages(messages.filter((message)=>message.id!==messageId));
        } catch (error) {
          console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="relative text-center z-100">
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
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">CHAT</span>
                        <div className="messages">
                            {messages.map((message) => (
                                <div className="message" key={message.id}>
                                    <div>
                                        <div className="message-content">
                                            <p>{message.message}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{message.timestamp}</p>
                                            <p id="author">{message.userId}</p>
                                        </div>
                                    </div>
                                    <button onClick={()=> handleDeleteMessage(message.id)} className="delete-button">
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isOpen &&(
                <div className="card-footer">
                    <input
                        type="text"
                        placeholder="Enter a message"
                        className="form-control"
                        value={message}
                        onChange={(ev) => {
                            setMessage(ev.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        className="btn btn-primary form-control"
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};    

export default Chat;