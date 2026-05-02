import { formatDistanceToNow, format } from "date-fns";

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDate = (date: Date): string => {
  return format(new Date(date), "MMM d, yyyy");
};

export const formatTime = (date: Date): string => {
  return format(new Date(date), "h:mm a");
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
};
