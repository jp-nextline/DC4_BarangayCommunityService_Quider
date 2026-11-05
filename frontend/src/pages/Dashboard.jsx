import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardApi } from '../services/resources.js';
import { errorMessage } from '../services/api.js';
import { formatDate } from '../utils/format.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import DataTable from '../components/DataTable.jsx';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    dashboardApi.get().then((res) => setData(res.data.data)).catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(load, [load]);

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!data) return <Loader />;

  const stats = [
    { label: 'Total requests', value: data.total },
    { label: 'Pending', value: data.pending, tone: 'pending' },
    { label: 'Approved', value: data.approved, tone: 'approved' },
    { label: 'Completed', value: data.completed, tone: 'completed' },
    { label: 'Rejected', value: data.rejected, tone: 'rejected' },
    { label: 'Filed this month', value: data.this_month },
  ];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{isAdmin ? 'Request overview' : `Hello, ${user.name.split(' ')[0]}`}</h1>
          <p className="muted">{isAdmin ? 'Everything submitted to the barangay office.' : 'A summary of your requests.'}</p>
        </div>
        {!isAdmin && <Link className="btn btn-primary" to="/requests/new">New request</Link>}
      </header>

      <section className="stats">
        {stats.map((s) => (
          <div key={s.label} className={`stat ${s.tone ? `stat-${s.tone}` : ''}`}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>Requests by category</h2>
          {data.by_category.length === 0 ? (
            <div className="empty">No requests to chart yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.by_category} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" name="Requests" fill="#1f4e8c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="panel">
          <h2>Latest requests</h2>
          <DataTable
            rows={data.recent}
            emptyMessage="No requests yet."
            columns={[
              { header: 'Request', render: (r) => <Link to={`/requests/${r.id}`}>{r.title}</Link> },
              { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              { header: 'Filed', render: (r) => formatDate(r.created_at) },
            ]}
          />
        </section>
      </div>
    </>
  );
}
