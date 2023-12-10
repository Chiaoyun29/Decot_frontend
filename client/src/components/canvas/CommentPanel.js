import React, { useState, useEffect } from 'react';
import { getCommentsByCanvas, createComment, deleteComment, toggleCommentResolvedState, updateComment } from '../services/api';
import icon_toggle_off from '../../image/icon_toggle_off.svg';
import icon_toggle_on from '../../image/icon_toggle_on.svg';

const CommentPanel = ({ token, workspaceId, boardId, canvasId, isOpen, onClose, onAddComment, onDeleteComment, onToggleResolved }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');
    const [viewFilter, setViewFilter] = useState('unresolved'); // 'all', 'unresolved', 'resolved'

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    const fetchComments = async () => {
        const response = await getCommentsByCanvas(token, workspaceId, boardId, canvasId);
        console.log(response)
        if (response.status === 200) {
            setComments(response.comments);
        } else {
            console.error('Error fetching comments:', response.error);
        }
    };

    const filteredComments = comments.filter(comment => {
        if (viewFilter === 'all') return true;
        return viewFilter === 'resolved' ? comment.resolved : !comment.resolved;
    });

    const ToggleResolvedSwitch = ({ isResolved, onToggle }) => (
        <div onClick={onToggle} className="flex items-center cursor-pointer space-x-2">
            {isResolved ? (
                <>
                    <img src={icon_toggle_on} alt="Resolved" className="h-5 w-5" />
                    <span className="text-gray-700">Resolved</span>
                </>
            ) : (
                <>
                    <img src={icon_toggle_off} alt="Unresolve" className="h-5 w-5" />
                    <span className="text-gray-700">Resolve</span>
                </>
            )}
        </div>
    );

    const handleAddComment = async () => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;

        const response = await createComment(token, workspaceId, boardId, canvasId, newCommentText, x, y);
        console.log(response)
        if (response.status === 201) {
            onAddComment(response.comment);
            setNewCommentText('');
            fetchComments();
        } else {
            console.error('Failed to add comment:', response.error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const response = await deleteComment(token, workspaceId, boardId, canvasId, commentId);
        console.log(response)
        if (response.status === 200) {
            onDeleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } else {
            console.error('Failed to delete comment:', response.error);
        }
    };

    const handleToggleResolved = async (commentId) => {
        const response = await toggleCommentResolvedState(token, workspaceId, boardId, canvasId, commentId);
        if (response.status === 200 && response.message) {
            const updatedComment = { ...response.comment, resolved: response.comment.resolved };
            setComments(currentComments =>
                currentComments.map(comment =>
                    comment.id === commentId ? updatedComment : comment
                )
            );
            onToggleResolved(updatedComment);
        } else {
            console.error('Failed to toggle comment resolved state:', response.error);
        }
    };

    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditText(comment.text);
    };

    const handleSaveEdit = async () => {
        const currentComment = comments.find(c => c.id === editingCommentId);
        if (!currentComment) {
            console.error('No comment found with the current editing ID:', editingCommentId);
            return;
        }

        const response = await updateComment(token, workspaceId, boardId, canvasId, editingCommentId, editText, currentComment.x, currentComment.y);
        if (response.status === 200) {
            setComments(comments.map(c => c.id === editingCommentId ? { ...c, text: editText } : c));
            setEditingCommentId(null);
        } else {
            console.error('Failed to update comment:', response.error);
        }
    };


    return (
        <div className="fixed inset-y-0 right-0 top-20 transform transition-transform duration-300 ease-in-out"
            style={{ width: isOpen ? '20rem' : '0', backgroundColor: 'white' }}>
            <div className="py-4 px-4 pt-4 pb-0 flex justify-between items-center border-b">
                <h2 className="px-2 text-xl font-semibold">Comments</h2>
                <button onClick={onClose} className="text-2xl">&times;</button>
            </div>
            <div className=''>
                {/* Comment Input */}
                <div className="p-4">
                    <input type="text" value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Type a new comment"
                        className="w-full mb-2 p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button onClick={handleAddComment}
                        className="w-full p-2 bg-[#F9A826] text-white rounded-md shadow-sm disabled:opacity-50"
                        disabled={!newCommentText.trim()}>
                        Add
                    </button>
                </div>

                {/* Filter Buttons */}
                <div className="flex justify-between p-4 border-b">
                    <button onClick={() => setViewFilter('unresolved')}
                        className={`text-sm font-semibold px-4 py-2 ${viewFilter === 'unresolved' ? 'bg-[#F9A826] text-white' : 'bg-white text-[#F9A826]'}`}>
                        Unresolved
                    </button>
                    <button onClick={() => setViewFilter('resolved')}
                        className={`text-sm font-semibold px-4 py-2 ${viewFilter === 'resolved' ? 'bg-[#F9A826] text-white' : 'bg-white text-[#F9A826]'}`}>
                        Resolved
                    </button>
                    <button onClick={() => setViewFilter('all')}
                        className={`text-sm font-semibold px-4 py-2 ${viewFilter === 'all' ? 'bg-[#F9A826] text-white' : 'bg-white text-[#F9A826]'}`}>
                        All
                    </button>
                </div>

                {/* Comment List */}
                <div className="overflow-auto p-4 space-y-4 max-h-[calc(100vh-15rem)]">
                    {filteredComments.map((comment) => (
                        <div key={comment.id} className="p-2 border-b border-gray-200">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="font-semibold">{comment.User.username}</span>
                                <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                            </div>
                            {editingCommentId === comment.id ? (
                                <input type="text" value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full mb-2 p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            ) : (
                                <p className="text-sm mb-2">{comment.text}</p>
                            )}
                            <div className="flex justify-between items-center text-xs">
                                <ToggleResolvedSwitch
                                    isResolved={comment.resolved}
                                    onToggle={() => handleToggleResolved(comment.id)}
                                />
                                {editingCommentId === comment.id ? (
                                    <button onClick={handleSaveEdit} className="text-blue-500">Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(comment)} className="text-blue-500">Edit</button>
                                )}
                                <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentPanel;
