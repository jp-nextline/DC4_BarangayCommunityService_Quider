import Modal from './Modal.jsx';
import Button from './Button.jsx';

// The "are you sure?" step required before any delete.
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="modal-actions">
        <Button variant="ghost" onClick={onCancel}>Keep it</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
