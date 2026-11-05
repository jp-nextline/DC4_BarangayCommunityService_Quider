import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { categoryApi, requestApi } from '../services/resources.js';
import { errorMessage } from '../services/api.js';
import { STATUSES, capitalize, formatDate } from '../utils/format.js';
import useDebounce from '../hooks/useDebounce.js';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import Button from '../components/Button.jsx';

export default function RequestList() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', category_id: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const search = useDebounce(filters.search);

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  // Fetch whenever the page, filters or reloadKey change.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    requestApi
      .list({ page, search, status: filters.status, category_id: filters.category_id })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((e) => !cancelled && setError(errorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page, search, filters.status, filters.category_id, reloadKey]);

  const setFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // a new filter always starts from page 1
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await requestApi.remove(toDelete.id);
      toast.success('Request deleted.');
      setToDelete(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else setReloadKey((k) => k + 1);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { header: 'Reference', render: (r) => <code>{r.reference_no}</code> },
    { header: 'Request', render: (r) => <Link to={`/requests/${r.id}`}>{r.title}</Link> },
    { header: 'Category', render: (r) => r.category?.name },
    ...(isAdmin ? [{ header: 'Resident', render: (r) => r.requester?.name }] : []),
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Filed', render: (r) => formatDate(r.created_at) },
    {
      header: 'Actions',
      className: 'actions',
      render: (r) => (
        <>
          <Link className="btn btn-ghost btn-sm" to={`/requests/${r.id}`}>View</Link>
          {r.permissions.update && <Link className="btn btn-ghost btn-sm" to={`/requests/${r.id}/edit`}>Edit</Link>}
          {r.permissions.delete && <Button variant="danger-ghost" className="btn-sm" onClick={() => setToDelete(r)}>Delete</Button>}
        </>
      ),
    },
  ];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{isAdmin ? 'All requests' : 'My requests'}</h1>
          <p className="muted">{meta ? `${meta.total} found` : ' '}</p>
        </div>
        {!isAdmin && <Link className="btn btn-primary" to="/requests/new">New request</Link>}
      </header>

      <div className="filters">
        <input name="search" type="search" placeholder="Search title, details or reference no." value={filters.search} onChange={setFilter} aria-label="Search requests" />
        <select name="status" value={filters.status} onChange={setFilter} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
        <select name="category_id" value={filters.category_id} onChange={setFilter} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && <ErrorBox message={error} onRetry={() => setReloadKey((k) => k + 1)} />}
      {loading ? (
        <Loader />
      ) : (
        !error && (
          <>
            <DataTable rows={rows} columns={columns} emptyMessage={isAdmin ? 'No requests match your filters.' : 'No requests found. Use “New request” to file one.'} />
            <Pagination meta={meta} onChange={setPage} />
          </>
        )
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this request?"
          message={`“${toDelete.title}” (${toDelete.reference_no}) will be permanently removed.`}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
