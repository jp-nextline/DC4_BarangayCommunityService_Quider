// columns: [{ header, render: (row) => node, className? }]
export default function DataTable({ columns, rows, emptyMessage = 'Nothing here yet.' }) {
  if (!rows.length) return <div className="empty">{emptyMessage}</div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((c) => <th key={c.header}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => <td key={c.header} data-label={c.header} className={c.className}>{c.render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
