export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '-';

export const STATUSES = ['pending', 'approved', 'rejected', 'completed'];
export const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');
