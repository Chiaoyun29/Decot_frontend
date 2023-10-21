import React from 'react';

function Feedback(){
    const gmailURL = "https://mail.google.com/mail/u/0/?fs=1&to=tanchiaoyun@gmail.com&tf=cm&su=Decot%20Feedback";

    return(
        <div>
            <a href={gmailURL} target="_blank" rel="noopener noreferrer">
                <button className="w-6 h-6 text-gray-800 dark:text-white" onClick={() => window.location.href = gmailURL}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h9M5 9h5m8-8H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4l3.5 4 3.5-4h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                    </svg>
                </button>
            </a> 
        </div>
    );
}

export default Feedback;

