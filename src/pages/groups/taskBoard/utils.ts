export const uid = () => crypto.randomUUID();

export function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  const diff = Math.floor((date.getTime() - new Date().getTime()) / 86400000);
  if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { text: "Today", overdue: false };
  if (diff === 1) return { text: "Tomorrow", overdue: false };
  return {
    text: date.toLocaleDateString("en-PK", { month: "short", day: "numeric" }),
    overdue: false,
  };
}
