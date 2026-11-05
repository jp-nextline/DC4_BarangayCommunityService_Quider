import Button from './Button.jsx';

// meta comes straight from Laravel's paginate() response.
export default function Pagination({ meta, onChange }) {
  if (!meta || meta.last_page <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="ghost" disabled={meta.current_page === 1} onClick={() => onChange(meta.current_page - 1)}>Previous</Button>
      <span>Page {meta.current_page} of {meta.last_page} ({meta.total} total)</span>
      <Button variant="ghost" disabled={meta.current_page === meta.last_page} onClick={() => onChange(meta.current_page + 1)}>Next</Button>
    </nav>
  );
}
