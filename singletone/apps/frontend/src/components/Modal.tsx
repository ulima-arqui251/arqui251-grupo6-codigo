import React from 'react';

interface ModalProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default Modal;