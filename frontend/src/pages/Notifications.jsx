import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { notificationApi } from '../services/resources.js';
import { errorMessage } from '../services/api.js';
import { formatDateTime } from '../utils/format.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import Pagination from '../components/Pagination.jsx';
import Button from '../components/Button.jsx';

export default function Notifications() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [unread, setUnread] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    notificationApi.list({ page })
      .then((res) => { setItems(res.data.data); setMeta(res.data.meta); setUnread(res.data.unread_count); })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [page]);
  useEffect(load, [load]);

  const markRead = async (n) => {
    if (n.is_read) return;
    try {
      await notificationApi.markRead(n.id);
      setItems((list) => list.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setUnread((u) => Math.max(0, u - 1));
    } catch (e) { toast.error(errorMessage(e)); }
  };

  const markAll = async () => {
    try {
      await notificationApi.markAllRead();
      toast.success('All notifications marked as read.');
      load();
    } catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <>
      <header className="page-head">
        <div><h1>Notifications</h1><p className="muted">{unread} unread</p></div>
        {unread > 0 && <Button variant="ghost" onClick={markAll}>Mark all as read</Button>}
      </header>

      {error && <ErrorBox message={error} onRetry={load} />}
      {loading ? <Loader /> : items.length === 0 ? (
        <div className="empty">No notifications yet. You will see updates here when the office reviews your requests.</div>
      ) : (
        <ul className="notif-list">
          {items.map((n) => (
            <li key={n.id} className={n.is_read ? '' : 'unread'}>
              <div>
                <p>{n.message}</p>
                <small>{formatDateTime(n.created_at)}</small>
              </div>
              <div className="notif-actions">
                <Link className="btn btn-ghost btn-sm" to={`/requests/${n.service_request_id}`} onClick={() => markRead(n)}>View request</Link>
                {!n.is_read && <Button variant="ghost" className="btn-sm" onClick={() => markRead(n)}>Mark read</Button>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
