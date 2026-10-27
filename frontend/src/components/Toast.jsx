import { useEffect } from 'react';
import { FiCheck, FiAlertTriangle, FiX } from 'react-icons/fi';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-container ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <div className="toast-icon">
        {isSuccess ? <FiCheck size={20} /> : <FiAlertTriangle size={20} />}
      </div>
      <div className="toast-message">
        <p className="toast-title">{isSuccess ? 'Success' : 'Notice'}</p>
        <p className="toast-text">{toast.message}</p>
      </div>
      <button className="toast-close-btn" onClick={onClose} title="Dismiss">
        <FiX size={16} />
      </button>
    </div>
  );
}
