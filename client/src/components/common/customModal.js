import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    width: '400px',
    height: '200px',
    margin: 'auto',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

Modal.setAppElement('#root');

const CustomModal = ({ isOpen, onClose, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
    >
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default CustomModal;