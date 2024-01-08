import React from 'react';

const CommentDetailBox = ({ comment, position, onClose }) => {
    if (!position) return null;

    return (
        <div
            className="absolute p-4 bg-white rounded shadow z-10"
            style={{ left: `${position.x + 40}px`, top: `${position.y - 40}px` }}
        >
            <button onClick={onClose} className="absolute top-0 right-0 p-2 text-lg">×</button>
            <div className="p-2 bg-white">
                <div className="flex items-center mb-2">
                    <img src={comment.User.profilePic} alt={comment.User.username} className="w-8 h-8 rounded-full mr-2" />
                    <div>
                        <span className="font-semibold">{comment.User.username}</span>
                        <span className="px-2 bg-[#FCD34D] ml-2 font-semibold text-xs text-white uppercase tracking-wide">{comment.User.role}</span>
                        <div className="text-xs text-gray-500 whitespace-normal">{new Date(comment.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                <p className="text-sm">{comment.text}</p>
                {comment.replies && comment.replies
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(reply => (
                        <div className="px-1 py-2 bg-slate-100 mb-2">
                            <div className="flex items-center mb-2">
                                <img src={reply.User.profilePic} alt={reply.User.username} className="w-8 h-8 rounded-full mr-2" />
                                <div>
                                    <span className="font-semibold">{reply.User.username}</span>
                                    <span className="px-2 bg-[#FCD34D] ml-2 font-semibold text-xs text-white uppercase tracking-wide">{reply.User.role}</span>
                                    <div className="text-xs text-gray-500 whitespace-normal">{new Date(reply.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                            <p className="text-sm">{reply.text}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CommentDetailBox;
