import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getCommentsByCanvas, createComment, deleteComment, toggleCommentResolvedState, updateComment } from '../services/api';
import CommentItem from './CommentItem';
import SocketContext from '../../context/SocketContext';

const CommentPanel = ({ token, workspaceId, boardId, canvasId, isOpen, onClose, onAddComment, onDeleteComment, onToggleResolved, onUpdateComment, onRefresh }) => {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [viewFilter, setViewFilter] = useState('unresolved'); // 'all', 'unresolved', 'resolved'
    const { socket } = useContext(SocketContext);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    useEffect(() => {
        if (socket) {
            const handleCommentUpdated = (data) => {
                onRefresh();
                fetchComments();
            };

            socket.on('commentCreated', handleCommentUpdated);
            socket.on('commentUpdated', handleCommentUpdated);
            socket.on('commentDeleted', handleCommentUpdated);
            socket.on('commentToggled', handleCommentUpdated);

            return () => {
                socket.off('commentCreated', handleCommentUpdated);
                socket.off('commentUpdated', handleCommentUpdated);
                socket.off('commentDeleted', handleCommentUpdated);
                socket.off('commentToggled', handleCommentUpdated);

            };

        }
    }, [socket]);

    const fetchComments = async () => {
        const response = await getCommentsByCanvas(token, workspaceId, boardId, canvasId);
        console.log(response)
        if (response.status === 200) {
            setComments(response.comments);
        } else {
            console.error('Error fetching comments:', response.error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value.toLowerCase());
    };

    const searchFilter = (comment) => {
        if (!searchKeyword.trim()) return true;
    
        const keyword = searchKeyword.toLowerCase();
        
        const searchCommentAndReplies = (comment) => {
            const textMatch = comment.text.toLowerCase().includes(keyword);
            const usernameMatch = comment.User.username.toLowerCase().includes(keyword);
    
            if (textMatch || usernameMatch) {
                return true;
            }
    
            return comment.replies && comment.replies.some(reply => searchCommentAndReplies(reply));
        };
    
        return searchCommentAndReplies(comment);
    };
    
    const filteredComments = comments.filter(comment => {
        return (viewFilter === 'all' || viewFilter === 'resolved' === comment.resolved) && searchFilter(comment);
    });

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
            fetchComments();
        } else {
            console.error('Failed to delete comment:', response.error);
        }
    };

    const handleToggleResolved = async (commentId) => {
        const response = await toggleCommentResolvedState(token, workspaceId, boardId, canvasId, commentId);
        if (response.status === 200 && response.message) {
            const updatedComment = response.comment;

            setComments(currentComments => currentComments.map(comment => {
                if (comment.id === commentId) {
                    return updatedComment;
                }
                return comment;
            }));
            onToggleResolved(updatedComment);
            fetchComments();
        } else {
            console.error('Failed to toggle comment resolved state:', response.error);
        }
    };

    const updateNestedComments = (comments, updatedComment) => {
        return comments.map(comment => {
            if (comment.id === updatedComment.id) {
                return updatedComment;
            }
            if (comment.replies) {
                return {
                    ...comment,
                    replies: updateNestedComments(comment.replies, updatedComment),
                };
            }
            return comment;
        });
    };

    const handleSaveEdit = async (commentId, newText) => {
        let x, y;
        const findComment = (comments, id) => {
            for (const comment of comments) {
                if (comment.id === id) {
                    x = comment.x;
                    y = comment.y;
                    return comment;
                }
                if (comment.replies) {
                    const foundReply = findComment(comment.replies, id);
                    if (foundReply) return foundReply;
                }
            }
        };

        findComment(comments, commentId);

        const response = await updateComment(token, workspaceId, boardId, canvasId, commentId, newText, x, y);
        if (response.status === 200) {
            const updatedCommentOrReply = response.comment;

            setComments(currentComments => {
                const updatedComments = currentComments.map(comment => {
                    if (comment.id === commentId) {
                        return updatedCommentOrReply;
                    }

                    if (comment.replies) {
                        const updatedReplies = comment.replies.map(reply => {
                            if (reply.id === commentId) {
                                return updatedCommentOrReply;
                            }
                            return reply;
                        });

                        return updatedReplies.some(reply => reply.id === commentId) ? { ...comment, replies: updatedReplies } : comment;
                    }

                    return comment;
                });

                const parentComment = updatedComments.find(comment =>
                    comment.replies && comment.replies.some(reply => reply.id === commentId)
                );

                if (parentComment) {
                    onUpdateComment(parentComment);
                } else {
                    onUpdateComment(updatedCommentOrReply);
                }

                return updatedComments;
            });
        } else {
            console.error('Failed to update comment:', response.error);
        }
    };

    const handleAddReply = async (replyingToCommentId, replyText) => {
        let x, y;
        const findComment = (comments, id) => {
            for (const comment of comments) {
                if (comment.id === id) {
                    x = comment.x;
                    y = comment.y;
                    return comment;
                }
                if (comment.replies) {
                    const foundReply = findComment(comment.replies, id);
                    if (foundReply) return foundReply;
                }
            }
        };

        findComment(comments, replyingToCommentId);
        const response = await createComment(token, workspaceId, boardId, canvasId, replyText, x, y, replyingToCommentId);

        if (response.status === 201) {
            const newReply = response.comment;

            setComments(currentComments => {
                return currentComments.map(comment => {
                    if (comment.id === replyingToCommentId) {
                        const updatedParentComment = {
                            ...comment,
                            replies: [...comment.replies, newReply],
                        };

                        onUpdateComment(updatedParentComment);

                        return updatedParentComment;
                    }
                    return comment;
                });
            });
        } else {
            console.error('Failed to add reply:', response.error);
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
                <div className="overflow-auto p-4 space-y-4 max-h-[calc(100vh-20rem)]">
                    {/* Search Bar */}
                    <div className="relative p-1 bg-slate-50">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg fill="currentColor" viewBox="0 0 512 512" className="w-5 h-5 text-gray-600">
                                    <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                                </svg>
                        </span>
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            placeholder="Search comments..."
                            className="w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm text-md"
                        />
                    </div>
                    {filteredComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onSaveEdit={handleSaveEdit}
                            onDelete={handleDeleteComment}
                            onToggleResolved={handleToggleResolved}
                            onAddReply={handleAddReply}
                            showReplySection={!comment.parentId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentPanel;
