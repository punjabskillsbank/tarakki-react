export type Priority = "critical" | "high" | "medium" | "low" | "none";
export type TaskStatus = "open" | "in_progress" | "done" | "blocked";

export type Member = {
  id: string;
  name: string;
  initials: string;
  color: string;
};
export type Label = { id: string; name: string; color: string };
export type Section = {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
  position: number;
};
export type Task = {
  id: string;
  ticketNum: string;
  title: string;
  description: string;
  assignee: Member | null;
  dueDate: string | null;
  priority: Priority;
  status: TaskStatus;
  labels: Label[];
  comments: number;
  attachments: number;
  sectionId: string;
};
