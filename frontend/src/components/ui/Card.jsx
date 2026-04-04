export function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`card-panel p-5 text-slate-800 ${className}`}>
      {title ? <h3 className="text-lg font-semibold text-secondary">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
