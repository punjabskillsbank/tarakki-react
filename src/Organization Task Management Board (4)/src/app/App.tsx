import { useState, useRef, useEffect } from "react";
import {
  Plus, Search, X, ChevronDown, ChevronRight,
  MoreHorizontal, GripVertical, Flag, User,
  MessageSquare, AlertCircle, CheckCircle2,
  Clock, Zap, Trash2, Edit3, Filter, SlidersHorizontal,
  Bell, LayoutGrid, UserPlus
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "critical" | "high" | "medium" | "low" | "none";
type TaskStatus = "open" | "in_progress" | "done" | "blocked";

interface Label { id: string; name: string; color: string; }

interface Task {
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
}

interface Section {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
  position: number;
}

interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const LABELS: Label[] = [
  { id: "l1", name: "Frontend", color: "#0073EA" },
  { id: "l2", name: "Backend",  color: "#00C875" },
  { id: "l3", name: "Bug",      color: "#E2445C" },
  { id: "l4", name: "API",      color: "#9B59B6" },
  { id: "l5", name: "Design",   color: "#F39C12" },
];


const MEMBER_COLORS = ["#0073EA","#00C875","#9B59B6","#E67E22","#E2445C","#14B8A6","#8B5CF6","#F39C12"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_CFG: Record<Priority, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  critical: { label: "Critical", color: "#E2445C", bg: "#FEE2E2", icon: <AlertCircle size={11} /> },
  high:     { label: "High",     color: "#F39C12", bg: "#FEF3C7", icon: <Flag size={11} /> },
  medium:   { label: "Medium",   color: "#0073EA", bg: "#E6F0FF", icon: <Zap size={11} /> },
  low:      { label: "Low",      color: "#6B7280", bg: "#F3F4F6", icon: <ChevronDown size={11} /> },
  none:     { label: "None",     color: "#C4C4C4", bg: "#F9FAFB", icon: <ChevronDown size={11} /> },
};

const STATUS_CFG: Record<TaskStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  open:        { label: "Open",        color: "#6B7280", bg: "#F3F4F6", icon: <Clock size={11} /> },
  in_progress: { label: "In Progress", color: "#0073EA", bg: "#E6F0FF", icon: <Zap size={11} /> },
  done:        { label: "Done",        color: "#00C875", bg: "#D1FAE5", icon: <CheckCircle2 size={11} /> },
  blocked:     { label: "Blocked",     color: "#E2445C", bg: "#FEE2E2", icon: <AlertCircle size={11} /> },
};

function uid() { return Math.random().toString(36).slice(2, 10); }

function formatDate(d: string | null) {
  if (!d) return null;
  const dt = new Date(d), now = new Date();
  const diff = Math.floor((dt.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { text: "Today", overdue: false };
  if (diff === 1) return { text: "Tomorrow", overdue: false };
  return { text: dt.toLocaleDateString("en-PK", { month: "short", day: "numeric" }), overdue: false };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ member, size = 26 }: { member: Member; size?: number }) {
  return (
    <div
      title={member.name}
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ring-[1.5px] ring-white transition-transform hover:scale-110 cursor-default select-none"
      style={{ width: size, height: size, background: member.color, fontSize: Math.floor(size * 0.37) }}
    >
      {member.initials}
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task, onDragStart, onDragEnd, onClick, isDragging,
}: {
  task: Task; onDragStart: () => void; onDragEnd: () => void;
  onClick: () => void; isDragging: boolean;
}) {
  const due = formatDate(task.dueDate);
  const pri = PRIORITY_CFG[task.priority];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`group relative bg-white rounded-lg border border-[#E6E9EF] cursor-pointer select-none
        shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]
        transition-all duration-150
        ${isDragging ? "opacity-40 scale-95 rotate-1" : "hover:-translate-y-px"}`}
    >
      <div className="pl-3 pr-3 py-3">
        {/* title */}
        <p className="text-[12.5px] font-medium text-[#1F2937] leading-snug mb-2.5 line-clamp-3">
          {task.title}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] text-[#C4C4C4] font-mono">{task.ticketNum}</span>
            <span style={{ color: pri.color }} title={pri.label}>{pri.icon}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {task.assignee && <Avatar member={task.assignee} size={22} />}
          </div>
        </div>
      </div>

      {/* grip on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
        <GripVertical size={12} className="text-[#C4C4C4]" />
      </div>
    </div>
  );
}

// ─── Task Detail Modal ────────────────────────────────────────────────────────

function TaskModal({
  task, members, labels, sections, onClose, onUpdate,
}: {
  task: Task; members: Member[]; labels: Label[]; sections: Section[];
  onClose: () => void; onUpdate: (t: Task) => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const section = sections.find((s) => s.id === task.sectionId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[88vh] flex flex-col border border-[#E6E9EF]">
        {/* header */}
        <div className="flex items-start gap-3 px-6 py-4 border-b border-[#E6E9EF]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-semibold text-[#9CA3AF] bg-[#F6F7FB] px-2 py-0.5 rounded border border-[#E6E9EF]">
                {task.ticketNum}
              </span>
              <span className="text-[11px] text-[#C4C4C4]">·</span>
              <span className="text-[11px] text-[#9CA3AF]">
                Punjab Skills Bank · {section?.name}
              </span>
            </div>
            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => { setEditingTitle(false); onUpdate({ ...task, title }); }}
                onKeyDown={(e) => { if (e.key === "Enter") { setEditingTitle(false); onUpdate({ ...task, title }); } }}
                className="text-[15px] font-semibold text-[#1F2937] bg-transparent border-b-2 border-[#0073EA] outline-none w-full leading-snug"
              />
            ) : (
              <h2
                onClick={() => setEditingTitle(true)}
                className="text-[15px] font-semibold text-[#1F2937] cursor-text hover:text-[#0073EA] transition-colors leading-snug"
              >
                {title}
              </h2>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F6F7FB] transition-colors flex-shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* body */}
          <div className="flex-1 px-6 py-4 overflow-y-auto space-y-5">
            <div>
              <p className="text-[10.5px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-1.5">Description</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => onUpdate({ ...task, description })}
                rows={4}
                placeholder="Add a description…"
                className="w-full text-[13px] text-[#1F2937] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg p-3 outline-none resize-none focus:border-[#0073EA] transition-colors"
              />
            </div>

            <div>
              <p className="text-[10.5px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-2">Labels</p>
              <div className="flex flex-wrap gap-1.5">
                {labels.map((l) => {
                  const active = task.labels.some((tl) => tl.id === l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => onUpdate({ ...task, labels: active ? task.labels.filter((tl) => tl.id !== l.id) : [...task.labels, l] })}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white transition-all"
                      style={{ background: l.color, opacity: active ? 1 : 0.3 }}
                    >
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[10.5px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-1.5">Activity</p>
              <div className="flex items-center gap-2 bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-3 py-2.5 text-[12px] text-[#9CA3AF]">
                <MessageSquare size={13} />
                {task.comments} comment{task.comments !== 1 ? "s" : ""} · Write a comment…
              </div>
            </div>
          </div>

          {/* right panel */}
          <div className="w-48 flex-shrink-0 border-l border-[#E6E9EF] px-4 py-4 overflow-y-auto bg-[#FAFBFC] rounded-br-xl space-y-5">
            {/* status */}
            <div>
              <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-1.5">Status</p>
              {(Object.keys(STATUS_CFG) as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ ...task, status: s })}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[11.5px] mb-0.5 transition-colors text-left
                    ${task.status === s ? "bg-[#E6F0FF] text-[#0073EA] font-semibold" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
                >
                  <span style={{ color: STATUS_CFG[s].color }}>{STATUS_CFG[s].icon}</span>
                  {STATUS_CFG[s].label}
                </button>
              ))}
            </div>

            {/* priority */}
            <div>
              <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-1.5">Priority</p>
              {(["critical","high","medium","low","none"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => onUpdate({ ...task, priority: p })}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[11.5px] mb-0.5 transition-colors text-left
                    ${task.priority === p ? "bg-[#E6F0FF] text-[#0073EA] font-semibold" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
                >
                  <span style={{ color: PRIORITY_CFG[p].color }}>{PRIORITY_CFG[p].icon}</span>
                  {PRIORITY_CFG[p].label}
                </button>
              ))}
            </div>

            {/* assignee */}
            <div>
              <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-1.5">Assignee</p>
              <button
                onClick={() => onUpdate({ ...task, assignee: null })}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[11.5px] mb-0.5 transition-colors
                  ${!task.assignee ? "bg-[#E6F0FF] text-[#0073EA] font-semibold" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
              >
                <User size={12} className="text-[#C4C4C4]" /> Unassigned
              </button>
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onUpdate({ ...task, assignee: m })}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[11.5px] mb-0.5 transition-colors
                    ${task.assignee?.id === m.id ? "bg-[#E6F0FF] text-[#0073EA] font-semibold" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
                >
                  <Avatar member={m} size={18} />
                  {m.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* due date */}
            <div>
              <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-1.5">Due Date</p>
              <input
                type="date"
                value={task.dueDate ?? ""}
                onChange={(e) => onUpdate({ ...task, dueDate: e.target.value || null })}
                className="w-full text-[11.5px] bg-white border border-[#E6E9EF] rounded-lg px-2 py-1.5 text-[#1F2937] outline-none focus:border-[#0073EA] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Add Modal ──────────────────────────────────────────────────────────

function QuickAddTask({
  sections, members, defaultSectionId, onAdd, onClose,
}: {
  sections: Section[]; members: Member[]; defaultSectionId: string | null;
  onAdd: (t: Omit<Task, "id" | "ticketNum">) => void; onClose: () => void;
}) {
  const [title, setTitle]           = useState("");
  const [sectionId, setSectionId]   = useState(defaultSectionId ?? sections[0]?.id ?? "");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [priority, setPriority]     = useState<Priority>("medium");
  const [dueDate, setDueDate]       = useState("");

  function submit() {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(), description: "",
      assignee: members.find((m) => m.id === assigneeId) ?? null,
      dueDate: dueDate || null, priority, status: "open",
      labels: [], comments: 0, attachments: 0, sectionId,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-5 border border-[#E6E9EF]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#1F2937]">Create Issue</h3>
          <button onClick={onClose} className="p-1 rounded text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors">
            <X size={15} />
          </button>
        </div>

        <input
          autoFocus value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Issue summary…"
          className="w-full text-[13px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-3 py-2.5 text-[#1F2937] placeholder:text-[#C4C4C4] outline-none focus:border-[#0073EA] transition-colors mb-3"
        />

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {[
            { label: "Group", node: (
              <select value={sectionId} onChange={(e) => setSectionId(e.target.value)}
                className="w-full text-[12px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-2 py-1.5 text-[#1F2937] outline-none focus:border-[#0073EA]">
                {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )},
            { label: "Priority", node: (
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-[12px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-2 py-1.5 text-[#1F2937] outline-none focus:border-[#0073EA]">
                {(["critical","high","medium","low","none"] as Priority[]).map((p) => (
                  <option key={p} value={p}>{PRIORITY_CFG[p].label}</option>
                ))}
              </select>
            )},
            { label: "Assignee", node: (
              <select value={assigneeId ?? ""} onChange={(e) => setAssigneeId(e.target.value || null)}
                className="w-full text-[12px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-2 py-1.5 text-[#1F2937] outline-none focus:border-[#0073EA]">
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            )},
            { label: "Due Date", node: (
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-[12px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-2 py-1.5 text-[#1F2937] outline-none focus:border-[#0073EA]" />
            )},
          ].map(({ label, node }) => (
            <div key={label}>
              <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wider mb-1">{label}</p>
              {node}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] text-[#6B7280] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg hover:bg-[#E6E9EF] transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={!title.trim()}
            className="px-4 py-1.5 text-[12px] font-semibold bg-[#0073EA] text-white rounded-lg hover:bg-[#0060C0] transition-colors disabled:opacity-40">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Column ───────────────────────────────────────────────────────────

function SectionColumn({
  section, tasks, onAddTask, onRenameSection, onDeleteSection,
  onToggleCollapse, onDragOver, onDrop, onTaskDragStart, onTaskDragEnd,
  onTaskClick, draggingTaskId, isDragTarget,
}: {
  section: Section; tasks: Task[];
  onAddTask: (id: string) => void;
  onRenameSection: (id: string, name: string) => void;
  onDeleteSection: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: string) => void;
  onTaskDragStart: (id: string) => void;
  onTaskDragEnd: () => void;
  onTaskClick: (t: Task) => void;
  draggingTaskId: string | null;
  isDragTarget: boolean;
}) {
  const [renaming, setRenaming]       = useState(false);
  const [renameValue, setRenameValue] = useState(section.name);
  const [showMenu, setShowMenu]       = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false); }
    if (showMenu) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showMenu]);

  return (
    <div
      className={`flex-shrink-0 w-[272px] flex flex-col transition-all duration-150 ${isDragTarget ? "ring-2 ring-[#0073EA] ring-offset-2 rounded-xl" : ""}`}
      onDragOver={onDragOver}
      onDrop={() => onDrop(section.id)}
    >
      {/* header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-t-xl border border-[#E6E9EF] border-b-0"
      >
        {renaming ? (
          <input
            autoFocus value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={() => { setRenaming(false); onRenameSection(section.id, renameValue || section.name); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { setRenaming(false); onRenameSection(section.id, renameValue || section.name); }
              if (e.key === "Escape") { setRenaming(false); setRenameValue(section.name); }
            }}
            className="flex-1 text-[11.5px] font-bold uppercase tracking-wider text-[#6B7280] bg-transparent border-b border-[#0073EA] outline-none"
          />
        ) : (
          <button
            onDoubleClick={() => setRenaming(true)}
            className="flex-1 text-left text-[11.5px] font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            {section.name}
          </button>
        )}

        <span className="text-[10.5px] font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {tasks.length}
        </span>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onToggleCollapse(section.id)}
            className="p-1 rounded text-[#C4C4C4] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
          >
            {section.collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-1 rounded text-[#C4C4C4] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            >
              <MoreHorizontal size={13} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-7 z-30 bg-white border border-[#E6E9EF] rounded-lg shadow-lg py-1 w-40 text-[12px]">
                <button
                  onClick={() => { setShowMenu(false); setRenaming(true); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[#1F2937] hover:bg-[#F3F4F6] transition-colors"
                >
                  <Edit3 size={12} /> Rename
                </button>
                <div className="border-t border-[#E6E9EF] my-1" />
                <button
                  onClick={() => { setShowMenu(false); onDeleteSection(section.id); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[#E2445C] hover:bg-[#FEE2E2] transition-colors"
                >
                  <Trash2 size={12} /> Delete group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* cards */}
      {!section.collapsed && (
        <div className={`flex flex-col gap-2 p-2 border border-[#E6E9EF] border-t-0 rounded-b-xl min-h-[80px] transition-colors ${isDragTarget ? "bg-[#E6F0FF]/40" : "bg-[#F6F7FB]"}`}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id} task={task}
              onDragStart={() => onTaskDragStart(task.id)}
              onDragEnd={onTaskDragEnd}
              onClick={() => onTaskClick(task)}
              isDragging={draggingTaskId === task.id}
            />
          ))}

          {isDragTarget && draggingTaskId && (
            <div className="h-12 rounded-lg border-2 border-dashed border-[#0073EA]/40 bg-[#0073EA]/5 flex items-center justify-center">
              <span className="text-[11px] text-[#0073EA]/50 font-medium">Drop here</span>
            </div>
          )}

          <button
            onClick={() => onAddTask(section.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] text-[#6B7280] hover:text-[#0073EA] hover:bg-white font-medium transition-all border border-transparent hover:border-[#E6E9EF] group"
          >
            <Plus size={13} className="group-hover:text-[#0073EA]" />
            Create issue
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────



// ─── Board Toolbar ────────────────────────────────────────────────────────────

function BoardToolbar({
  search, onSearch, assigneeFilter, onAssigneeFilter,
  priorityFilter, onPriorityFilter, members, onNewTask,
}: {
  search: string; onSearch: (v: string) => void;
  assigneeFilter: string | null; onAssigneeFilter: (v: string | null) => void;
  priorityFilter: Priority | null; onPriorityFilter: (v: Priority | null) => void;
  members: Member[]; onNewTask: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-white border-b border-[#E6E9EF] flex-shrink-0">
      {/* create */}
      <button
        onClick={onNewTask}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0073EA] text-white rounded-md text-[12.5px] font-semibold hover:bg-[#0060C0] transition-colors"
      >
        <Plus size={14} /> Create
      </button>

      <div className="w-px h-4 bg-[#E6E9EF] mx-1" />

      {/* search */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4C4C4]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search board"
          className="pl-8 pr-8 py-1.5 text-[12px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-md outline-none focus:border-[#0073EA] transition-colors w-44 text-[#1F2937] placeholder:text-[#C4C4C4]"
        />
        {search && (
          <button onClick={() => onSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#C4C4C4] hover:text-[#6B7280]">
            <X size={11} />
          </button>
        )}
      </div>

      {/* assignee avatars */}
      <div className="flex items-center -space-x-1 ml-1">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => onAssigneeFilter(assigneeFilter === m.id ? null : m.id)}
            title={m.name}
            className={`transition-all relative ${assigneeFilter === m.id ? "ring-2 ring-[#0073EA] ring-offset-1 rounded-full scale-110 z-10" : "hover:scale-110 hover:z-10"}`}
          >
            <Avatar member={m} size={26} />
          </button>
        ))}
      </div>

      {/* filter */}
      <div className="relative group ml-1">
        <button
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] border transition-colors
            ${priorityFilter
              ? "bg-[#E6F0FF] text-[#0073EA] border-[#0073EA]/30 font-semibold"
              : "text-[#6B7280] bg-white border-[#E6E9EF] hover:bg-[#F3F4F6]"}`}
        >
          <Filter size={12} />
          Filter
          {priorityFilter && (
            <span
              onClick={(e) => { e.stopPropagation(); onPriorityFilter(null); }}
              className="ml-0.5 text-[#0073EA] hover:text-[#E2445C]"
            >
              <X size={10} />
            </span>
          )}
        </button>
        <div className="absolute top-9 left-0 z-30 bg-white border border-[#E6E9EF] rounded-lg shadow-lg py-1 w-36 hidden group-hover:block">
          <div className="px-3 py-1 text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wider">Priority</div>
          {(["critical","high","medium","low"] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => onPriorityFilter(priorityFilter === p ? null : p)}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[#F3F4F6] transition-colors
                ${priorityFilter === p ? "text-[#0073EA] font-semibold" : "text-[#1F2937]"}`}
            >
              <span style={{ color: PRIORITY_CFG[p].color }}>{PRIORITY_CFG[p].icon}</span>
              {PRIORITY_CFG[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* group */}
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E6E9EF] rounded-md text-[12px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
        <SlidersHorizontal size={12} /> Group by
      </button>
    </div>
  );
}

// ─── Empty Board ──────────────────────────────────────────────────────────────

function EmptyBoard({ onAddSection }: { onAddSection: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#E6F0FF] flex items-center justify-center mb-1">
        <LayoutGrid size={28} className="text-[#0073EA]" />
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-[#1F2937] mb-1">This board has no groups yet</h3>
        <p className="text-[13px] text-[#9CA3AF] max-w-xs">
          Create your first group to start organizing tasks into columns.
        </p>
      </div>
      <button
        onClick={onAddSection}
        className="flex items-center gap-2 px-4 py-2 bg-[#0073EA] text-white rounded-lg text-[13px] font-semibold hover:bg-[#0060C0] transition-colors"
      >
        <Plus size={15} /> Create first group
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [sections, setSections]               = useState<Section[]>([]);
  const [tasks, setTasks]                     = useState<Task[]>([]);
  const [members, setMembers]                 = useState<Member[]>([]);
  const [search, setSearch]                   = useState("");
  const [assigneeFilter, setAssigneeFilter]   = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter]   = useState<Priority | null>(null);
  const [draggingTaskId, setDraggingTaskId]   = useState<string | null>(null);
  const [dragTarget, setDragTarget]           = useState<string | null>(null);
  const [selectedTask, setSelectedTask]       = useState<Task | null>(null);
  const [showQuickAdd, setShowQuickAdd]       = useState(false);
  const [quickAddSectionId, setQuickAddSectionId] = useState<string | null>(null);
  const [addingSection, setAddingSection]     = useState(false);
  const [newSectionName, setNewSectionName]   = useState("");
  const [ticketCounter, setTicketCounter]     = useState(0);
  const [showAddMember, setShowAddMember]     = useState(false);
  const [newMemberName, setNewMemberName]     = useState("");

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (assigneeFilter && t.assignee?.id !== assigneeFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  const sortedSections = [...sections].sort((a, b) => a.position - b.position);

  function handleDragOver(e: React.DragEvent, sectionId: string) { e.preventDefault(); setDragTarget(sectionId); }
  function handleDrop(sectionId: string) {
    if (!draggingTaskId) return;
    setTasks((prev) => prev.map((t) => t.id === draggingTaskId ? { ...t, sectionId } : t));
    setDraggingTaskId(null); setDragTarget(null);
  }

  function addSection() {
    if (!newSectionName.trim()) return;
    const palette = ["#0073EA","#00C875","#9B59B6","#E2445C","#F39C12","#6B7280","#14B8A6","#8B5CF6"];
    setSections((prev) => [...prev, {
      id: uid(), name: newSectionName.trim().toUpperCase(),
      color: palette[prev.length % palette.length],
      collapsed: false, position: prev.length,
    }]);
    setNewSectionName(""); setAddingSection(false);
  }

  function addTask(task: Omit<Task, "id" | "ticketNum">) {
    const num = ticketCounter + 1;
    setTicketCounter(num);
    setTasks((prev) => [...prev, { ...task, id: uid(), ticketNum: `T-${num}` }]);
  }

  function addMember() {
    const name = newMemberName.trim();
    if (!name) return;
    const words = name.split(" ");
    const initials = words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    setMembers((prev) => [...prev, { id: uid(), name, initials, color }]);
    setNewMemberName("");
    setShowAddMember(false);
  }

  function updateTask(updated: Task) {
    setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    if (selectedTask?.id === updated.id) setSelectedTask(updated);
  }

  return (
    <div className="flex h-screen bg-[#F6F7FB] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top navbar */}
        <div className="h-[52px] bg-white border-b border-[#E6E9EF] flex items-center px-5 gap-4 flex-shrink-0">
          {/* logo / org name */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0073EA] flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0">
              T
            </div>
            <span className="text-[13px] font-bold text-[#1F2937]">{"{orgName}"}</span>
          </div>

          <div className="w-px h-4 bg-[#E6E9EF]" />

          {/* breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
            <span>{"{workspaceName}"}</span>
            <ChevronRight size={12} className="text-[#C4C4C4]" />
            <span className="text-[#1F2937] font-semibold">{"{boardName}"}</span>
          </div>

          {/* right */}
          <div className="ml-auto flex items-center gap-1.5">
            {members.length > 0 && (
              <div className="flex items-center -space-x-1.5">
                {members.slice(0, 5).map((m) => <Avatar key={m.id} member={m} size={28} />)}
                {members.length > 5 && (
                  <div className="w-7 h-7 rounded-full bg-[#F3F4F6] border-2 border-white flex items-center justify-center text-[10px] text-[#6B7280] font-semibold">
                    +{members.length - 5}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-[#0073EA] font-medium hover:bg-[#E6F0FF] transition-colors"
            >
              <UserPlus size={13} />
              Add Member
            </button>
            <div className="w-px h-4 bg-[#E6E9EF] mx-1" />
            <button className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors">
              <Bell size={15} />
            </button>
          </div>
        </div>

        {/* Board toolbar */}
        <BoardToolbar
          search={search} onSearch={setSearch}
          assigneeFilter={assigneeFilter} onAssigneeFilter={setAssigneeFilter}
          priorityFilter={priorityFilter} onPriorityFilter={setPriorityFilter}
          members={members}
          onNewTask={() => { setQuickAddSectionId(null); setShowQuickAdd(true); }}
        />

        {/* Board canvas */}
        {sections.length === 0 && !addingSection ? (
          <EmptyBoard onAddSection={() => setAddingSection(true)} />
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="flex gap-3 p-4" style={{ minWidth: "max-content", minHeight: "100%" }}>
              {sortedSections.map((section) => {
                const sectionTasks = filteredTasks.filter((t) => t.sectionId === section.id);
                return (
                  <SectionColumn
                    key={section.id}
                    section={section}
                    tasks={sectionTasks}
                    onAddTask={(sid) => { setQuickAddSectionId(sid); setShowQuickAdd(true); }}
                    onRenameSection={(id, name) =>
                      setSections((prev) => prev.map((s) => s.id === id ? { ...s, name: name.toUpperCase() } : s))
                    }
                    onDeleteSection={(id) => {
                      setSections((prev) => prev.filter((s) => s.id !== id));
                      setTasks((prev) => prev.filter((t) => t.sectionId !== id));
                    }}
                    onToggleCollapse={(id) =>
                      setSections((prev) => prev.map((s) => s.id === id ? { ...s, collapsed: !s.collapsed } : s))
                    }
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDrop={() => handleDrop(section.id)}
                    onTaskDragStart={(id) => setDraggingTaskId(id)}
                    onTaskDragEnd={() => { setDraggingTaskId(null); setDragTarget(null); }}
                    onTaskClick={setSelectedTask}
                    draggingTaskId={draggingTaskId}
                    isDragTarget={dragTarget === section.id}
                  />
                );
              })}

              {/* Add section */}
              <div className="flex-shrink-0 w-[272px]">
                {addingSection ? (
                  <div className="bg-white border border-[#E6E9EF] rounded-xl p-3 shadow-sm">
                    <input
                      autoFocus value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addSection();
                        if (e.key === "Escape") { setAddingSection(false); setNewSectionName(""); }
                      }}
                      placeholder="Group name…"
                      className="w-full text-[12.5px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-3 py-2 text-[#1F2937] placeholder:text-[#C4C4C4] outline-none focus:border-[#0073EA] transition-colors mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addSection}
                        disabled={!newSectionName.trim()}
                        className="flex-1 py-1.5 text-[12px] font-semibold bg-[#0073EA] text-white rounded-lg hover:bg-[#0060C0] transition-colors disabled:opacity-40"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddingSection(false); setNewSectionName(""); }}
                        className="px-3 py-1.5 text-[12px] text-[#6B7280] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg hover:bg-[#E6E9EF] transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingSection(true)}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-[#E6E9EF] bg-white text-[12.5px] text-[#6B7280] font-medium hover:text-[#0073EA] hover:border-[#0073EA]/40 hover:bg-[#E6F0FF]/40 transition-all group shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
                  >
                    <Plus size={14} className="group-hover:text-[#0073EA]" />
                    Add another group
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuickAdd && (
        <QuickAddTask
          sections={sortedSections} members={members} defaultSectionId={quickAddSectionId}
          onAdd={addTask} onClose={() => setShowQuickAdd(false)}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask} members={members} labels={LABELS} sections={sortedSections}
          onClose={() => setSelectedTask(null)} onUpdate={updateTask}
        />
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
          onClick={(e) => e.target === e.currentTarget && setShowAddMember(false)}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-5 border border-[#E6E9EF]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#1F2937]">Add Member</h3>
              <button onClick={() => setShowAddMember(false)} className="p-1 rounded text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors">
                <X size={15} />
              </button>
            </div>

            <p className="text-[12px] text-[#9CA3AF] mb-3">Enter the member's name to add them to Punjab Skills Bank.</p>

            <input
              autoFocus
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              placeholder="Full name…"
              className="w-full text-[13px] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg px-3 py-2.5 text-[#1F2937] placeholder:text-[#C4C4C4] outline-none focus:border-[#0073EA] transition-colors mb-4"
            />

            {members.length > 0 && (
              <div className="mb-4">
                <p className="text-[10.5px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-2">Current Members</p>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-[#F6F7FB]">
                      <Avatar member={m} size={24} />
                      <span className="text-[12.5px] text-[#1F2937]">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddMember(false)} className="px-3 py-1.5 text-[12px] text-[#6B7280] bg-[#F6F7FB] border border-[#E6E9EF] rounded-lg hover:bg-[#E6E9EF] transition-colors">
                Cancel
              </button>
              <button
                onClick={addMember}
                disabled={!newMemberName.trim()}
                className="px-4 py-1.5 text-[12px] font-semibold bg-[#0073EA] text-white rounded-lg hover:bg-[#0060C0] transition-colors disabled:opacity-40"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
