export function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-800",
    secondary: "bg-slate-100 text-secondary hover:bg-slate-200",
    accent: "bg-accent text-white hover:bg-emerald-600",
    danger: "bg-danger text-white hover:bg-red-600",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
