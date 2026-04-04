export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-primary/30 transition focus:border-primary focus:ring-4 ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </label>
  );
}
