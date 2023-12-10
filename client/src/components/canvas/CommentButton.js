import React from 'react';
import icon_comment from '../../image/icon_comment.svg';

const CommentButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow-lg"
      aria-label="Toggle comment panel"
    >
      <img src={icon_comment} className="w-6 h-6 text-black" alt="Comments" />
    </button>
  );
};

export default CommentButton;
