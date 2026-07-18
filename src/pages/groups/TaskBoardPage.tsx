import { Bell, ChevronDown, ChevronRight, Clock, Flag, Filter, GripVertical, LayoutGrid, MessageSquare, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2, User, UserPlus, X, Zap, Edit3, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageBackground } from "../../components/PageBackground";
import { PrimaryButton } from "../../components/PrimaryButton";

type Priority = "critical" | "high" | "medium" | "low" | "none";
type TaskStatus = "open" | "in_progress" | "done" | "blocked";

type Member = { id: string; name: string; initials: string; color: string };
type Label = { id: string; name: string; color: string };
type Section = { id: string; name: string; color: string; collapsed: boolean; position: number };
type Task = {
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

const LABELS: Label[] = [
  { id: "l1", name: "Frontend", color: "#0073EA" },
  { id: "l2", name: "Backend", color: "#00C875" },
  { id: "l3", name: "Bug", color: "#E2445C" },
  { id: "l4", name: "API", color: "#9B59B6" },
  { id: "l5", name: "Design", color: "#F39C12" },
];
const MEMBER_COLORS = ["#0073EA", "#00C875", "#9B59B6", "#E67E22", "#E2445C", "#14B8A6", "#8B5CF6", "#F39C12"];
const SECTION_COLORS = ["#0073EA", "#00C875", "#9B59B6", "#E2445C", "#F39C12", "#6B7280", "#14B8A6", "#8B5CF6"];
const PRIORITY_CFG: Record<Priority, { label: string; color: string; icon: React.ReactNode }> = {
  critical: { label: "Critical", color: "#E2445C", icon: <AlertCircle size={11} /> },
  high: { label: "High", color: "#F39C12", icon: <Flag size={11} /> },
  medium: { label: "Medium", color: "#0073EA", icon: <Zap size={11} /> },
  low: { label: "Low", color: "#6B7280", icon: <ChevronDown size={11} /> },
  none: { label: "None", color: "#C4C4C4", icon: <ChevronDown size={11} /> },
};
const STATUS_CFG: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: "Open", color: "#6B7280", icon: <Clock size={11} /> },
  in_progress: { label: "In Progress", color: "#0073EA", icon: <Zap size={11} /> },
  done: { label: "Done", color: "#00C875", icon: <CheckCircle2 size={11} /> },
  blocked: { label: "Blocked", color: "#E2445C", icon: <AlertCircle size={11} /> },
};

function uid() { return Math.random().toString(36).slice(2, 10); }
function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value); const now = new Date(); const diff = Math.floor((date.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { text: "Today", overdue: false };
  if (diff === 1) return { text: "Tomorrow", overdue: false };
  return { text: date.toLocaleDateString("en-PK", { month: "short", day: "numeric" }), overdue: false };
}
function initials(name: string) { const words = name.trim().split(/\s+/); return words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase(); }
function Avatar({ member, size = 26 }: { member: Member; size?: number }) {
  return <div title={member.name} className="flex flex-shrink-0 select-none items-center justify-center rounded-full text-white font-semibold ring-[1.5px] ring-white" style={{ width: size, height: size, background: member.color, fontSize: Math.floor(size * 0.37) }}>{member.initials}</div>;
}

export default function TaskBoardPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddSectionId, setQuickAddSectionId] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [ticketCounter, setTicketCounter] = useState(0);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const filteredTasks = tasks.filter((task) => (!search || task.title.toLowerCase().includes(search.toLowerCase())) && (!assigneeFilter || task.assignee?.id === assigneeFilter) && (!priorityFilter || task.priority === priorityFilter));
  const sortedSections = [...sections].sort((a, b) => a.position - b.position);
  function addSection() {
    if (!newSectionName.trim()) return;
    setSections((current) => [...current, { id: uid(), name: newSectionName.trim().toUpperCase(), color: SECTION_COLORS[current.length % SECTION_COLORS.length], collapsed: false, position: current.length }]);
    setNewSectionName(""); setAddingSection(false);
  }
  function addTask(task: Omit<Task, "id" | "ticketNum">) { const next = ticketCounter + 1; setTicketCounter(next); setTasks((current) => [...current, { ...task, id: uid(), ticketNum: `T-${next}` }]); }
  function addMember() { const name = newMemberName.trim(); if (!name) return; setMembers((current) => [...current, { id: uid(), name, initials: initials(name), color: MEMBER_COLORS[members.length % MEMBER_COLORS.length] }]); setNewMemberName(""); setShowAddMember(false); }
  function updateTask(updated: Task) { setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task))); if (selectedTask?.id === updated.id) setSelectedTask(updated); }

  function TaskCard({ task, onDragStart, onDragEnd, onClick, isDragging }: { task: Task; onDragStart: () => void; onDragEnd: () => void; onClick: () => void; isDragging: boolean }) {
    const due = formatDate(task.dueDate); const pri = PRIORITY_CFG[task.priority];
    return <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick} className={`group relative cursor-pointer select-none rounded-lg border border-[#E6E9EF] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] ${isDragging ? "scale-95 rotate-1 opacity-40" : "hover:-translate-y-px"}`}><div className="px-3 py-3"><p className="mb-2.5 line-clamp-3 text-[12.5px] font-medium leading-snug text-[#1F2937]">{task.title}</p><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="font-mono text-[10.5px] text-[#C4C4C4]">{task.ticketNum}</span><span style={{ color: pri.color }} title={pri.label}>{pri.icon}</span>{due && <span className={`text-[10.5px] ${due.overdue ? "text-[#E2445C]" : "text-[#9CA3AF]"}`}>{due.text}</span>}</div><div className="flex items-center gap-1.5">{task.assignee && <Avatar member={task.assignee} size={22} />}</div></div></div><div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-60"><GripVertical size={12} className="text-[#C4C4C4]" /></div></div>;
  }

  function SectionColumn({ section }: { section: Section }) {
    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(section.name);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handler = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false); };
      if (showMenu) document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [showMenu]);
    const sectionTasks = filteredTasks.filter((task) => task.sectionId === section.id);
    return <div className={`flex w-[272px] flex-shrink-0 flex-col transition-all duration-150 ${dragTarget === section.id ? "rounded-xl ring-2 ring-[#0073EA] ring-offset-2" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragTarget(section.id); }} onDrop={() => { if (!draggingTaskId) return; setTasks((current) => current.map((task) => task.id === draggingTaskId ? { ...task, sectionId: section.id } : task)); setDraggingTaskId(null); setDragTarget(null); }}><div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-[#E6E9EF] bg-white px-3 py-2.5">{renaming ? <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={() => { setRenaming(false); setSections((current) => current.map((item) => item.id === section.id ? { ...item, name: renameValue || section.name } : item)); }} onKeyDown={(e) => { if (e.key === "Enter") { setRenaming(false); setSections((current) => current.map((item) => item.id === section.id ? { ...item, name: renameValue || section.name } : item)); } if (e.key === "Escape") { setRenaming(false); setRenameValue(section.name); } }} className="flex-1 border-b border-[#0073EA] bg-transparent text-[11.5px] font-bold uppercase tracking-wider text-[#6B7280] outline-none" /> : <button onDoubleClick={() => setRenaming(true)} className="flex-1 text-left text-[11.5px] font-bold uppercase tracking-wider text-[#6B7280] transition-colors hover:text-[#1F2937]">{section.name}</button>}<span className="min-w-[20px] rounded-full bg-[#F3F4F6] px-1.5 py-0.5 text-center text-[10.5px] font-semibold text-[#9CA3AF]">{sectionTasks.length}</span><div className="flex items-center gap-0.5"><button onClick={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, collapsed: !item.collapsed } : item))} className="rounded p-1 text-[#C4C4C4] transition-colors hover:bg-[#F3F4F6] hover:text-[#6B7280]">{section.collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}</button><div ref={menuRef} className="relative"><button onClick={() => setShowMenu((value) => !value)} className="rounded p-1 text-[#C4C4C4] transition-colors hover:bg-[#F3F4F6] hover:text-[#6B7280]"><MoreHorizontal size={13} /></button>{showMenu && <div className="absolute right-0 top-7 z-30 w-40 rounded-lg border border-[#E6E9EF] bg-white py-1 text-[12px] shadow-lg"><button onClick={() => { setShowMenu(false); setRenaming(true); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[#1F2937] transition-colors hover:bg-[#F3F4F6]"><Edit3 size={12} /> Rename</button><div className="my-1 border-t border-[#E6E9EF]" /><button onClick={() => { setShowMenu(false); setSections((current) => current.filter((item) => item.id !== section.id)); setTasks((current) => current.filter((task) => task.sectionId !== section.id)); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[#E2445C] transition-colors hover:bg-[#FEE2E2]"><Trash2 size={12} /> Delete group</button></div>}</div></div></div>{!section.collapsed && <div className={`flex min-h-[80px] flex-col gap-2 rounded-b-xl border border-t-0 border-[#E6E9EF] p-2 transition-colors ${dragTarget === section.id ? "bg-[#E6F0FF]/40" : "bg-[#F6F7FB]"}`}>{sectionTasks.map((task) => <TaskCard key={task.id} task={task} onDragStart={() => setDraggingTaskId(task.id)} onDragEnd={() => { setDraggingTaskId(null); setDragTarget(null); }} onClick={() => setSelectedTask(task)} isDragging={draggingTaskId === task.id} />)}{dragTarget === section.id && draggingTaskId && <div className="flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-[#0073EA]/40 bg-[#0073EA]/5"><span className="text-[11px] font-medium text-[#0073EA]/50">Drop here</span></div>}<button onClick={() => { setQuickAddSectionId(section.id); setShowQuickAdd(true); }} className="group flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-[12px] font-medium text-[#6B7280] transition-all hover:border-[#E6E9EF] hover:bg-white hover:text-[#0073EA]"><Plus size={13} className="group-hover:text-[#0073EA]" />Create issue</button></div>}</div>;
  }

  function QuickAddModal() {
    const [title, setTitle] = useState("");
    const [sectionId, setSectionId] = useState(quickAddSectionId ?? sortedSections[0]?.id ?? "");
    const [assigneeId, setAssigneeId] = useState<string | null>(null);
    const [priority, setPriority] = useState<Priority>("medium");
    const [dueDate, setDueDate] = useState("");
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={(e) => e.target === e.currentTarget && setShowQuickAdd(false)}><div className="mx-4 w-full max-w-md rounded-xl border border-[#E6E9EF] bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h3 className="text-[14px] font-semibold text-[#1F2937]">Create Issue</h3><button onClick={() => setShowQuickAdd(false)} className="rounded p-1 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]"><X size={15} /></button></div><input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (title.trim() && addTask({ title: title.trim(), description: "", assignee: members.find((m) => m.id === assigneeId) ?? null, dueDate: dueDate || null, priority, status: "open", labels: [], comments: 0, attachments: 0, sectionId }) && setShowQuickAdd(false))} placeholder="Issue summary..." className="mb-3 w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2.5 text-[13px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]" /><div className="mb-5 grid grid-cols-2 gap-2.5"><label className="space-y-1"><span className="text-[11px] font-semibold text-[#6B7280]">Group</span><select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-2 py-1.5 text-[12px] text-[#1F2937] outline-none focus:border-[#0073EA]">{sortedSections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}</select></label><label className="space-y-1"><span className="text-[11px] font-semibold text-[#6B7280]">Priority</span><select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-2 py-1.5 text-[12px] text-[#1F2937] outline-none focus:border-[#0073EA]">{(["critical", "high", "medium", "low", "none"] as Priority[]).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="space-y-1"><span className="text-[11px] font-semibold text-[#6B7280]">Assignee</span><select value={assigneeId ?? ""} onChange={(e) => setAssigneeId(e.target.value || null)} className="w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-2 py-1.5 text-[12px] text-[#1F2937] outline-none focus:border-[#0073EA]"><option value="">Unassigned</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label className="space-y-1"><span className="text-[11px] font-semibold text-[#6B7280]">Due date</span><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-2 py-1.5 text-[12px] text-[#1F2937] outline-none focus:border-[#0073EA]" /></label></div><div className="flex justify-end gap-2"><button onClick={() => setShowQuickAdd(false)} className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]">Cancel</button><PrimaryButton onClick={() => { if (!title.trim()) return; addTask({ title: title.trim(), description: "", assignee: members.find((m) => m.id === assigneeId) ?? null, dueDate: dueDate || null, priority, status: "open", labels: [], comments: 0, attachments: 0, sectionId }); setShowQuickAdd(false); }} className="px-4 py-1.5 h-auto text-[12px]">Create</PrimaryButton></div></div></div>;
  }

  function TaskModal() {
    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState(selectedTask?.title ?? "");
    const [description, setDescription] = useState(selectedTask?.description ?? "");
    const task = selectedTask!; const section = sortedSections.find((s) => s.id === task.sectionId);
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={(e) => e.target === e.currentTarget && setSelectedTask(null)}><div className="mx-4 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#E6E9EF] bg-white shadow-2xl"><div className="flex items-start gap-3 border-b border-[#E6E9EF] px-6 py-4"><div className="min-w-0 flex-1"><div className="mb-1.5 flex items-center gap-2"><span className="rounded border border-[#E6E9EF] bg-[#F6F7FB] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#9CA3AF]">{task.ticketNum}</span><span className="text-[11px] text-[#C4C4C4]">·</span><span className="text-[11px] text-[#9CA3AF]">Punjab Skills Bank · {section?.name}</span></div>{editingTitle ? <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => { setEditingTitle(false); updateTask({ ...task, title }); }} onKeyDown={(e) => e.key === "Enter" && (setEditingTitle(false), updateTask({ ...task, title }))} className="w-full border-b-2 border-[#0073EA] bg-transparent text-[15px] font-semibold leading-snug text-[#1F2937] outline-none" /> : <h2 onClick={() => setEditingTitle(true)} className="cursor-text text-[15px] font-semibold leading-snug text-[#1F2937] transition-colors hover:text-[#0073EA]">{title}</h2>}</div><button onClick={() => setSelectedTask(null)} className="mt-0.5 flex-shrink-0 rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#F6F7FB] hover:text-[#1F2937]"><X size={16} /></button></div><div className="flex flex-1 overflow-hidden"><div className="flex-1 space-y-5 overflow-y-auto px-6 py-4"><div><p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-[#C4C4C4]">Description</p><textarea value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => updateTask({ ...task, description })} rows={4} placeholder="Add a description..." className="w-full resize-none rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] p-3 text-[13px] text-[#1F2937] outline-none transition-colors focus:border-[#0073EA]" /></div><div><p className="mb-2 text-[10.5px] font-bold uppercase tracking-widest text-[#C4C4C4]">Labels</p><div className="flex flex-wrap gap-1.5">{LABELS.map((label) => { const active = task.labels.some((taskLabel) => taskLabel.id === label.id); return <button key={label.id} onClick={() => updateTask({ ...task, labels: active ? task.labels.filter((taskLabel) => taskLabel.id !== label.id) : [...task.labels, label] })} className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white transition-all" style={{ background: label.color, opacity: active ? 1 : 0.3 }}>{label.name}</button>; })}</div></div><div><p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-[#C4C4C4]">Activity</p><div className="flex items-center gap-2 rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2.5 text-[12px] text-[#9CA3AF]"><MessageSquare size={13} />{task.comments} comment{task.comments !== 1 ? "s" : ""} · Write a comment...</div></div></div><div className="w-48 flex-shrink-0 space-y-5 overflow-y-auto rounded-br-xl border-l border-[#E6E9EF] bg-[#FAFBFC] px-4 py-4"><div><p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">Status</p>{(Object.keys(STATUS_CFG) as TaskStatus[]).map((status) => <button key={status} onClick={() => updateTask({ ...task, status })} className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11.5px] transition-colors ${task.status === status ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}><span style={{ color: STATUS_CFG[status].color }}>{STATUS_CFG[status].icon}</span>{STATUS_CFG[status].label}</button>)}</div><div><p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">Priority</p>{(["critical", "high", "medium", "low", "none"] as Priority[]).map((priority) => <button key={priority} onClick={() => updateTask({ ...task, priority })} className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11.5px] transition-colors ${task.priority === priority ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}><span style={{ color: PRIORITY_CFG[priority].color }}>{PRIORITY_CFG[priority].icon}</span>{PRIORITY_CFG[priority].label}</button>)}</div><div><p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">Assignee</p><button onClick={() => updateTask({ ...task, assignee: null })} className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${!task.assignee ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}><User size={12} className="text-[#C4C4C4]" /> Unassigned</button>{members.map((member) => <button key={member.id} onClick={() => updateTask({ ...task, assignee: member })} className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${task.assignee?.id === member.id ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}><Avatar member={member} size={18} />{member.name.split(" ")[0]}</button>)}</div><div><p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">Due Date</p><input type="date" value={task.dueDate ?? ""} onChange={(e) => updateTask({ ...task, dueDate: e.target.value || null })} className="w-full rounded-lg border border-[#E6E9EF] bg-white px-2 py-1.5 text-[11.5px] text-[#1F2937] outline-none transition-colors focus:border-[#0073EA]" /></div></div></div></div></div>;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F6F7FB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageBackground />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-[52px] flex-shrink-0 items-center gap-4 border-b border-[#E6E9EF] bg-white px-5">
          <div className="flex items-center gap-2.5"><div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#0073EA] text-[11px] font-bold text-white">T</div><span className="text-[13px] font-bold text-[#1F2937]">{"{orgName}"}</span></div>
          <div className="h-4 w-px bg-[#E6E9EF]" />
          <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]"><span>{"{workspaceName}"}</span><ChevronRight size={12} className="text-[#C4C4C4]" /><span className="font-semibold text-[#1F2937]">{"{boardName}"}</span></div>
          <div className="ml-auto flex items-center gap-1.5">
            {members.length > 0 && <div className="flex items-center -space-x-1.5">{members.slice(0, 5).map((member) => <Avatar key={member.id} member={member} size={28} />)}</div>}
            <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-[#0073EA] transition-colors hover:bg-[#E6F0FF]"><UserPlus size={13} />Add Member</button>
            <div className="mx-1 h-4 w-px bg-[#E6E9EF]" />
            <button className="rounded-md p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]"><Bell size={15} /></button>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 border-b border-[#E6E9EF] bg-white px-5 py-2.5">
          <button onClick={() => { setQuickAddSectionId(null); setShowQuickAdd(true); }} className="flex items-center gap-1.5 rounded-md bg-[#0073EA] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0060C0]"><Plus size={14} /> Create</button>
          <div className="mx-1 h-4 w-px bg-[#E6E9EF]" />
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4C4C4]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search board" className="w-44 rounded-md border border-[#E6E9EF] bg-[#F6F7FB] py-1.5 pl-8 pr-8 text-[12px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]" /></div>
          <div className="ml-1 flex items-center -space-x-1">{members.map((member) => <button key={member.id} onClick={() => setAssigneeFilter(assigneeFilter === member.id ? null : member.id)} className={`relative transition-all ${assigneeFilter === member.id ? "z-10 scale-110 rounded-full ring-2 ring-[#0073EA] ring-offset-1" : "hover:z-10 hover:scale-110"}`}><Avatar member={member} size={26} /></button>)}</div>
          <div className="group relative ml-1"><button className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] transition-colors ${priorityFilter ? "border-[#0073EA]/30 bg-[#E6F0FF] font-semibold text-[#0073EA]" : "border-[#E6E9EF] bg-white text-[#6B7280] hover:bg-[#F3F4F6]"}`}><Filter size={12} />Filter{priorityFilter && <span onClick={(e) => { e.stopPropagation(); setPriorityFilter(null); }} className="ml-0.5 text-[#0073EA] hover:text-[#E2445C]"><X size={10} /></span>}</button><div className="absolute left-0 top-9 z-30 hidden w-36 rounded-lg border border-[#E6E9EF] bg-white py-1 shadow-lg group-hover:block"><div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C4C4C4]">Priority</div>{(["critical", "high", "medium", "low"] as Priority[]).map((p) => <button key={p} onClick={() => setPriorityFilter(priorityFilter === p ? null : p)} className={`flex w-full items-center gap-2 px-3 py-1.5 text-[12px] transition-colors hover:bg-[#F3F4F6] ${priorityFilter === p ? "font-semibold text-[#0073EA]" : "text-[#1F2937]"}`}><span style={{ color: PRIORITY_CFG[p].color }}>{PRIORITY_CFG[p].icon}</span>{PRIORITY_CFG[p].label}</button>)}</div></div>
          <button className="flex items-center gap-1.5 rounded-md border border-[#E6E9EF] bg-white px-2.5 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#F3F4F6]"><SlidersHorizontal size={12} /> Group by</button>
        </div>

        {sections.length === 0 && !addingSection ? <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"><div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F0FF]"><LayoutGrid size={28} className="text-[#0073EA]" /></div><div><h3 className="mb-1 text-[15px] font-semibold text-[#1F2937]">This board has no groups yet</h3><p className="max-w-xs text-[13px] text-[#9CA3AF]">Create your first group to start organizing tasks into columns.</p></div><PrimaryButton onClick={() => setAddingSection(true)} className="h-auto px-4 py-2 text-[13px]">Create first group</PrimaryButton></div> : <div className="flex-1 overflow-x-auto overflow-y-auto"><div className="flex gap-3 p-4" style={{ minWidth: "max-content", minHeight: "100%" }}>{sortedSections.map((section) => <SectionColumn key={section.id} section={section} />)}<div className="w-[272px] flex-shrink-0">{addingSection ? <div className="rounded-xl border border-[#E6E9EF] bg-white p-3 shadow-sm"><input autoFocus value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSection(); if (e.key === "Escape") { setAddingSection(false); setNewSectionName(""); } }} placeholder="Group name..." className="mb-2 w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2 text-[12.5px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]" /><div className="flex gap-2"><PrimaryButton onClick={addSection} disabled={!newSectionName.trim()} className="h-auto flex-1 px-0 py-1.5 text-[12px]">Add</PrimaryButton><button onClick={() => { setAddingSection(false); setNewSectionName(""); }} className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]"><X size={13} /></button></div></div> : <button onClick={() => setAddingSection(true)} className="group flex w-full items-center gap-2 rounded-xl border border-[#E6E9EF] bg-white px-4 py-3 text-[12.5px] font-medium text-[#6B7280] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all hover:border-[#0073EA]/40 hover:bg-[#E6F0FF]/40 hover:text-[#0073EA]"><Plus size={14} className="group-hover:text-[#0073EA]" />Add another group</button>}</div></div></div>}
      </div>
      {showQuickAdd && <QuickAddModal />}
      {selectedTask && <TaskModal />}
      {showAddMember && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={(e) => e.target === e.currentTarget && setShowAddMember(false)}><div className="mx-4 w-full max-w-sm rounded-xl border border-[#E6E9EF] bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h3 className="text-[14px] font-semibold text-[#1F2937]">Add Member</h3><button onClick={() => setShowAddMember(false)} className="rounded p-1 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]"><X size={15} /></button></div><p className="mb-3 text-[12px] text-[#9CA3AF]">Enter the member's name to add them to Punjab Skills Bank.</p><input autoFocus value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMember()} placeholder="Full name..." className="mb-4 w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2.5 text-[13px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]" /><div className="flex justify-end gap-2"><button onClick={() => setShowAddMember(false)} className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]">Cancel</button><PrimaryButton onClick={addMember} disabled={!newMemberName.trim()} className="h-auto px-4 py-1.5 text-[12px]">Add Member</PrimaryButton></div></div></div>}
    </div>
  );
}
