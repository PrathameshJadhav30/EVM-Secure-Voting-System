export function DataTable({ columns, rows, emptyMessage = "No data available" }) {
  if (!rows?.length) {
    return <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="border-t border-slate-100">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-slate-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
