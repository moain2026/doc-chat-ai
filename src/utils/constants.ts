export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "text/plain": [".txt"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const SUGGESTED_QUESTIONS = [
  { icon: "📋", question: "What are the key points in my documents?" },
  { icon: "📖", question: "Summarize the main topics" },
  { icon: "⚖️", question: "What policies are mentioned?" },
  { icon: "🔍", question: "What is the annual leave entitlement?" },
];

export const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "text-red-500",
  docx: "text-blue-500",
  xlsx: "text-green-500",
  txt: "text-gray-500",
};

export const FILE_TYPE_BG: Record<string, string> = {
  pdf: "bg-red-50 dark:bg-red-900/20",
  docx: "bg-blue-50 dark:bg-blue-900/20",
  xlsx: "bg-green-50 dark:bg-green-900/20",
  txt: "bg-gray-50 dark:bg-gray-900/20",
};
