import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { requestApi } from '../services/resources.js';
import { errorMessage, fieldErrors } from '../services/api.js';
import { capitalize, formatDate, formatDateTime } from '../utils/format.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import FormInput from '../components/FormInput.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const ACTION_LABEL = { approved: 'Approve', rejected: 'Reject', completed: 'Mark as completed' };

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [req, setReq] = useState(null);
  const [error, setError] = useState('');
  const [pendingStatus, setPendingStatus] = useState(null); // status the admin is about to apply
  const [remarks, setRemarks] = useState('');
  const [remarkError, setRemarkError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(() => {
    setError('');
    requestApi.get(id).then((res) => setReq(res.data.data)).catch((e) => setError(errorMessage(e)));
  }, [id]);
  useEffect(load, [load]);

  const openStatus = (status) => { setPendingStatus(status); setRemarks(''); setRemarkError(''); };

  const applyStatus = async () => {
    if (pendingStatus === 'rejected' && !remarks.trim()) {
      setRemarkError('Please give the resident a reason for rejecting the request.');
      return;
    }
    setSaving(true);
    try {
      const res = await requestApi.setStatus(id, { status: pendingStatus, remarks });
      setReq(res.data.data);
      toast.success(`Request marked as ${pendingStatus}.`);
      setPendingStatus(null);
    } catch (e) {
      if (e.response?.status === 422) setRemarkError(Object.values(fieldErrors(e))[0]);
      else toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await requestApi.remove(id);
      toast.success('Request deleted.');
      navigate('/requests', { replace: true });
    } catch (e) {
      toast.error(errorMessage(e));
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!req) return <Loader />;

  return (
    <>
      <Link to="/requests" className="back-link">Back to requests</Link>

      <header className="page-head">
        <div>
          <p className="ref-stub">{req.reference_no}</p>
          <h1>{req.title}</h1>
        </div>
        <StatusBadge status={req.status} />
      </header>

      <div className="two-col detail-grid">
        <section className="panel">
          <h2>Details</h2>
          <p className="prose">{req.description}</p>
          <dl className="meta">
            <div><dt>Category</dt><dd>{req.category?.name}</dd></div>
            <div><dt>Location</dt><dd>{req.location || '-'}</dd></div>
            <div><dt>Filed by</dt><dd>{req.requester?.name}</dd></div>
            <div><dt>Date filed</dt><dd>{formatDate(req.created_at)}</dd></div>
            {req.completed_at && <div><dt>Completed</dt><dd>{formatDate(req.completed_at)}</dd></div>}
          </dl>

          <div className="form-actions left">
            {req.permissions.update && <Link className="btn btn-ghost" to={`/requests/${req.id}/edit`}>Edit</Link>}
            {req.permissions.delete && <Button variant="danger-ghost" onClick={() => setConfirmDelete(true)}>Delete</Button>}
          </div>
        </section>

        <section className="panel">
          {req.allowed_transitions?.length > 0 && (
            <div className="admin-actions">
              <h2>Update status</h2>
              <div className="form-actions left">
                {req.allowed_transitions.map((s) => (
                  <Button key={s} variant={s === 'rejected' ? 'danger' : 'primary'} onClick={() => openStatus(s)}>{ACTION_LABEL[s]}</Button>
                ))}
              </div>
            </div>
          )}

          <h2>Status history</h2>
          {req.updates?.length ? (
            <ol className="timeline">
              {req.updates.map((u) => (
                <li key={u.id}>
                  <strong>{capitalize(u.old_status)} to {capitalize(u.new_status)}</strong>
                  <small>{formatDateTime(u.created_at)} by {u.updated_by}</small>
                  {u.remarks && <p>{u.remarks}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">No status changes yet. The barangay office will update this request after review.</p>
          )}
        </section>
      </div>

      {pendingStatus && (
        <Modal title={ACTION_LABEL[pendingStatus]} onClose={() => setPendingStatus(null)}>
          <FormInput
            as="textarea" rows={4} label={pendingStatus === 'rejected' ? 'Reason (required)' : 'Remarks (optional)'}
            name="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} error={remarkError}
          />
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setPendingStatus(null)}>Cancel</Button>
            <Button variant={pendingStatus === 'rejected' ? 'danger' : 'primary'} loading={saving} onClick={applyStatus}>Confirm</Button>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this request?" message={`${req.reference_no} will be permanently removed.`}
          loading={saving} onConfirm={remove} onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
