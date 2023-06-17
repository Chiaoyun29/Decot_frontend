import React, { useState, useEffect, useContext } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { createMessage, getAllMessages, deleteMessage } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';

import "./Chatfunction.css";

const Chat =()=>{
    const [isOpen, setIsOpen]=useState(false);
    //const [username, setUsername]=useState("");
    const [messages, setMessages]=useState([]);
    const [newMessage, setNewMessage]=useState([]);
    const { token } = useAuthContext();
    const { socket } = useContext(SocketContext);

    useEffect(()=>{
        fetchMessages();
    }, []);

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

    // const fetchMessages=async()=>{
    //     try {
    //         const response = await getAllMessages(token);
    //         if (response && response.data.messages) {
    //           setMessages(response.data.messages);
    //         }else{
    //             console.error('Invalid response or missing messages', response);
    //         }
    //     } catch (error) {
    //     console.error('Error fetching messages:', error);
    //     }
    // };
    const fetchMessages = async () => {
        try {
          const response = await getAllMessages(token, messages);
            if(response&&response.data.messages){
                setMessages(response.data.messages);
            } else {
                console.error('Error fetching messages:', response.status);
            }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
    };
    
    const sendMessage = async () => {
        try {
            const response = await createMessage(token, newMessage);
            console.log("dgjgshd",response);
            if (response.message) {
              const { message } = response.message;
              setMessages('');
              socket.emit('send_message', message);
            }
            setNewMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };  

    // const handleDeleteMessage = async (messageId) => {
    //     try {
    //       await deleteMessage(token, messageId);
    //       setMessages(messages.filter((message) => message.id !== messageId));
    //     } catch (error) {
    //       console.error('Error deleting message:', error);
    //     }
    // };
    const handleDeleteMessage = async (messageId) => {
        try {
          await deleteMessage(token, messageId);
          setMessages(messages.filter((message)=>message.id!==messageId));
        } catch (error) {
          console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="card">
                    <button className="card-header" onClick={()=>setIsOpen(!isOpen)}>
                        <AiOutlineSend className="cursor-pointer" size={25}/>
                    </button>

                    {isOpen && (
                        <div className="card-body">
                            <div className="card-title">Chat</div>
                            <hr />
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
                    )}

                    {isOpen &&(
                        <div className="card-footer">
                            <input
                                type="text"
                                placeholder="Enter a message"
                                className="form-control"
                                value={newMessage}
                                onChange={(ev) => {
                                    setNewMessage(ev.target.value);
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
            </div> 
        </div>
    );
};    

export default Chat;