import React, {useContext} from 'react';
import { DraggableCore } from 'react-draggable';
import SocketContext from '../../context/SocketContext';

const DraggableCommentIcon = ({ comment, onSelectComment, onPositionChange }) => {
    const { socket } = useContext(SocketContext);
    
    const handleDrag = (e, data) => {
        const newPosition = { x: comment.x + data.deltaX, y: comment.y + data.deltaY };
        socket.emit('commentPositionChange', { commentId: comment.id, newPosition });
    };

    const handleStop = (e, data) => {
        onPositionChange(comment.id, { x: comment.x, y: comment.y });
    };

    return (
        <DraggableCore onDrag={handleDrag} onStop={handleStop}>
            <div
                onClick={() => onSelectComment(comment, { x: comment.x, y: comment.y })}
                className="absolute w-6 h-6 cursor-pointer"
                style={{ left: comment.x, top: comment.y, zIndex: 1000 }}
            >
                <img
                    src='/image/icon_comment_for_draggable.svg'
                    alt="Comment Icon"
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </DraggableCore>
    );
};

export default DraggableCommentIcon;
