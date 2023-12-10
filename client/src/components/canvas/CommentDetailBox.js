const CommentDetailBox = ({ comment, position, onClose }) => {
    if (!position) return null; 

    return (
        <div
            className="absolute p-4 bg-white rounded shadow z-10"
            style={{ left: `${position.x + 40}px`, top: `${position.y - 40}px` }} 
        >
            <button onClick={onClose} className="absolute top-0 right-0 p-2 text-lg">×</button>
            <div className="p-2 bg-white">
                <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold pr-2">{comment.User.username}</span> 
                    <span className="text-gray-500 whitespace-normal">{new Date(comment.createdAt).toLocaleString()}</span> 
                </div>
                <p className="text-sm">{comment.text}</p>
                {/* Additional details and actions for the comment */}
            </div>
        </div>
    );
};

export default CommentDetailBox;
