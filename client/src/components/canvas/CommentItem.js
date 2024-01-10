import React, { useState } from 'react';
import icon_toggle_off from '/image/icon_toggle_off.svg';
import icon_toggle_on from '/image/icon_toggle_on.svg';
import { useAuthContext } from '../../context/AuthContext';

const CommentItem = ({ comment, onSaveEdit, onDelete, onToggleResolved, onAddReply, showReplySection }) => {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState('');
    const [replyText, setReplyText] = useState('');
    const { user } = useAuthContext();
    const canEditOrDelete = user && comment.userId === user.id;

    const handleEditClick = () => {
        setEditing(true);
        setEditText(comment.text);
    };

    const handleCancelEdit = () => {
        setEditing(false);
    };

    const handleSaveEdit = async () => {
        await onSaveEdit(comment.id, editText);
        setEditing(false);
    };

    const handleToggleResolvedClick = () => {
        onToggleResolved(comment.id);
    };

    const handleReply = async () => {
        await onAddReply(comment.id, replyText);
        setReplyText('');
    };

    const ToggleResolvedSwitch = () => (
        <div onClick={handleToggleResolvedClick} className="flex items-center cursor-pointer space-x-2">
            {comment.resolved ? (
                <><img src={icon_toggle_on} alt="Resolved" className="h-5 w-5" /><span className="text-gray-700">Resolved</span></>
            ) : (
                <><img src={icon_toggle_off} alt="Unresolved" className="h-5 w-5" /><span className="text-gray-700">Unresolved</span></>
            )}
        </div>
    );
    return (
        <div className="p-2 border-b border-gray-200 bg-slate-50 rounded-md">
            <div className="flex items-center mb-2 bg-white-50">
                <img src={comment.User.profilePic} alt={comment.User.username} className="w-8 h-8 rounded-full mr-2" />
                <div>
                    <span className="text-sm font-semibold">{comment.User.username}</span>
                    <span className="px-2 bg-[#FCD34D] font-semibold ml-2 text-xs text-white uppercase tracking-wide">{comment.User.role}</span>
                    <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
                </div>
            </div>
            {editing ? (
                <div className="flex justify-between items-center text-xs">
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full mb-2 p-2 border border-gray-300 rounded-md shadow-sm" />
                    <div>
                        <button onClick={handleSaveEdit} className="text-blue-500 pb-1 pl-2">Save</button>
                        <button onClick={handleCancelEdit} className="text-grey-500 pb-2 pl-2">Cancel</button>
                    </div>
                </div>
            ) : (
                <p className="text-sm mb-2">{comment.text}</p>
            )}
            <div className="flex justify-between items-center text-xs">
                <div>
                    {comment.parentId == null && <ToggleResolvedSwitch />}
                </div>
                {canEditOrDelete && (
                    <div>
                        <button onClick={handleEditClick} className="text-blue-500 mr-2">Edit</button>
                        <button onClick={() => onDelete(comment.id)} className="text-red-500">Delete</button>
                    </div>
                )}
            </div>

            {/* Render Replies */}
            {comment.replies && comment.replies
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map(reply => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        onSaveEdit={onSaveEdit}
                        onDelete={onDelete}
                        onToggleResolved={onToggleResolved}
                        onAddReply={onAddReply}
                        showReplySection={false}
                    />
                ))}

            {showReplySection && (
                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply to this comment"
                        className="w-full mb-2 p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button onClick={handleReply} className="text-blue-500 justify-end pl-2 pb-2 text-sm" disabled={!replyText.trim()}>Reply</button>
                </div>
            )}
        </div>
    );
};

export default CommentItem;