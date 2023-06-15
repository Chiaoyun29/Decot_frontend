import React, { useState } from "react";
import io from "socket.io-client";
import { AiOutlineMessage } from "react-icons/ai";

import "./tailwind.css";

const Chatfunction =()=>{
    const [isOpen, setIsOpen]=useState(false);
    const [username, setUsername]=useState("");
    const [message, setMessage]=useState("");
    const [allMessages, setAllMessages]=useState([]);

    const socket = io('localhost:8080');
    socket.on('RECEIVE_MESSAGE', function(data){
        addMessage(data);
    });

    const addMessage = (data) =>{
        const messageData={
            author: data.author,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        };
        setAllMessages((prevMessages)=>[...prevMessages, messageData]);
    };
    
    const sendMessage = (ev) =>{
        ev.preventDefault();
        socket.emit('SEND_MESSAGE', {
            author: username,
            message: message
        })
        setMessage("");
    };
    
    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <div className="card">
                        <div className="card-header" onClick={()=>setIsOpen(!isOpen)}>
                            <AiOutlineMessage className="cursor-pointer" size={25}/>
                        </div>

                        {isOpen && (
                            <div className="card-body">
                                <div className="card-title">Chat</div>
                                <hr />
                                <div className="messages">
                                    {allMessages.map((message, index) => {
                                        return (
                                            <div key={index}>
                                                {message.author}-{message.timestamp}: {message.message}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {isOpen &&(
                            <div className="card-footer">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="form-control"
                                    value={username}
                                    onChange={(ev) => setUsername(ev.target.value)}
                                />
                                <br />
                                <input
                                    type="text"
                                    placeholder="Message"
                                    className="form-control"
                                    value={message}
                                    onChange={(ev) => setMessage(ev.target.value)}
                                />
                                <br />
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
        </div>
    );
};    

export default Chatfunction;