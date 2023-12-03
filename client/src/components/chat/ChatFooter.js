import React, { useState, useContext, useEffect } from 'react';
import { createMessage } from '../services/api';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext.js';

const ChatFooter=({ setMessages })=>{
    const [message, setMessage]=useState([]);
    const { workspaceId, messageId, userId } = useParams();
    // const [messages, setMessages]=useState([]);
    const { token } = useAuthContext();
    const { socket } = useContext(SocketContext);

    const sendMessage = (e) => {
        e.preventDefault();
        const newMessage={
            id: messageId,
            message,
            timestamp: new Date().toLocaleTimeString(),
            uId: userId,
        };
        //still need to modify a bit
        setMessages((prevMessages)=>[...prevMessages, newMessage]);
        socket.emit('new_message', newMessage);
        try {
            const response = createMessage(token, message, workspaceId);
            console.log("dgjgshd",response);
            if (response.message) {
              setMessage('');
            }
        } catch (error) {
          console.error('Error sending message:', error);
        }
    }; 
    useEffect(()=>{
        if(socket){
            console.log('Socket connected!');
            socket.on('new_message', (data)=>{
                setMessages((prevMessages)=>[...prevMessages, data]);
            });
        }
        return()=>{
            if(socket){
                socket.off('new_message');
            }
        };
    }, [socket]);

    return(
        <div className="chat_footer">
            <div className="flex">
                <input
                    type="text"
                    placeholder="Enter a message"
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
export default ChatFooter;