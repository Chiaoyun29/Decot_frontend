import React, { useState } from 'react';
import { DraggableCore } from 'react-draggable';
import icon_comment from '../../image/icon_comment_for_draggable.svg'

const DraggableCommentIcon = ({ comment, onSelectComment, onPositionChange }) => {
    const [position, setPosition] = useState({ x: comment.x, y: comment.y });

    const handleDrag = (e, data) => {
        const newPosition = { x: position.x + data.deltaX, y: position.y + data.deltaY };
        setPosition(newPosition);
    };

    const handleStop = () => {
        onPositionChange(comment.id, position);
    };

    return (
        <DraggableCore onDrag={handleDrag} onStop={handleStop}>
            <div
                onClick={() => onSelectComment(comment, position)}
                className="absolute w-6 h-6 cursor-pointer"
                style={{ left: position.x, top: position.y, zIndex: 1000 }}
            >
                <img
                    src={icon_comment}
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </DraggableCore>
    );
};

export default DraggableCommentIcon;
