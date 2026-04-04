export const formatDate = (value) => new Date(value).toLocaleString();

export const statusTone = (status) => {
  if (status === "ACTIVE") return "success";
  if (status === "UPCOMING") return "warning";
  if (status === "ENDED") return "danger";
  return "default";
};
