import React, {useContext, useState} from 'react';
import { DraggableCore } from 'react-draggable';
import SocketContext from '../../context/SocketContext';

const DraggableCommentIcon = ({ comment, onSelectComment, onPositionChange }) => {
    const { socket } = useContext(SocketContext);
    const [position, setPosition] = useState({ x: comment.x, y: comment.y });

    const handleDrag = (e, data) => {
        const newPosition = { x: position.x + data.deltaX, y: position.y + data.deltaY };
        setPosition(newPosition);
        if(socket){
            socket.emit('commentPositionChange', { commentId: comment.id, newPosition });
        }
    };

    const handleStop = (e, data) => {
        onPositionChange(comment.id, position);
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
