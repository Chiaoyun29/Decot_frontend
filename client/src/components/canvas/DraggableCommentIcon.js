import React from 'react';
import { DraggableCore } from 'react-draggable';
import icon_comment from '../../image/icon_comment_for_draggable.svg';

const DraggableCommentIcon = ({ comment, onSelectComment, onPositionChange }) => {
    const handleDrag = (e, data) => {
        const newPosition = { x: comment.x + data.deltaX, y: comment.y + data.deltaY };
        onPositionChange(comment.id, newPosition);
    };

    const handleStop = (e, data) => {
        // No need to calculate final position, handleDrag has already updated it
    };

    return (
        <DraggableCore onDrag={handleDrag} onStop={handleStop}>
            <div
                onClick={() => onSelectComment(comment, { x: comment.x, y: comment.y })}
                className="absolute w-6 h-6 cursor-pointer"
                style={{ left: comment.x, top: comment.y, zIndex: 1000 }}
            >
                <img
                    src={icon_comment}
                    alt="Comment Icon"
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </DraggableCore>
    );
};

export default DraggableCommentIcon;
