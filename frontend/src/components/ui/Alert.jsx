export function Alert({ message, type = "info" }) {
  const classes = {
    info: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return <div className={`rounded-xl border px-3 py-2 text-sm ${classes[type]}`}>{message}</div>;
}
