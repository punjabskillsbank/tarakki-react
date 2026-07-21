import { AlertCircle, CheckCircle2, ChevronDown, Clock, Flag, Zap } from "lucide-react";
import type { ReactNode } from "react";
import type { Label, Priority, TaskStatus } from "./types";

export const LABELS: Label[] = [
  { id: "l1", name: "Frontend", color: "#0073EA" }, { id: "l2", name: "Backend", color: "#00C875" },
  { id: "l3", name: "Bug", color: "#E2445C" }, { id: "l4", name: "API", color: "#9B59B6" },
  { id: "l5", name: "Design", color: "#F39C12" },
];
export const MEMBER_COLORS = ["#0073EA", "#00C875", "#9B59B6", "#E67E22", "#E2445C", "#14B8A6", "#8B5CF6", "#F39C12"];
export const SECTION_COLORS = ["#0073EA", "#00C875", "#9B59B6", "#E2445C", "#F39C12", "#6B7280", "#14B8A6", "#8B5CF6"];

type Option = { label: string; color: string; icon: ReactNode };
export const PRIORITY_CFG: Record<Priority, Option> = {
  critical: { label: "Critical", color: "#E2445C", icon: <AlertCircle size={11} /> }, high: { label: "High", color: "#F39C12", icon: <Flag size={11} /> },
  medium: { label: "Medium", color: "#0073EA", icon: <Zap size={11} /> }, low: { label: "Low", color: "#6B7280", icon: <ChevronDown size={11} /> }, none: { label: "None", color: "#C4C4C4", icon: <ChevronDown size={11} /> },
};
export const STATUS_CFG: Record<TaskStatus, Option> = {
  open: { label: "Open", color: "#6B7280", icon: <Clock size={11} /> }, in_progress: { label: "In Progress", color: "#0073EA", icon: <Zap size={11} /> },
  done: { label: "Done", color: "#00C875", icon: <CheckCircle2 size={11} /> }, blocked: { label: "Blocked", color: "#E2445C", icon: <AlertCircle size={11} /> },
};
