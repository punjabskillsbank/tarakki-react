import { LayoutGrid, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PageBackground } from "../../components/PageBackground";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AddMemberModal } from "./taskBoard/AddMemberModal";
import { BoardHeader } from "./taskBoard/BoardHeader";
import { BoardToolbar } from "./taskBoard/BoardToolbar";
import { MEMBER_COLORS, SECTION_COLORS } from "./taskBoard/constants";
import { QuickAddModal } from "./taskBoard/QuickAddModal";
import { SectionColumn } from "./taskBoard/SectionColumn";
import { TaskDetailsModal } from "./taskBoard/TaskDetailsModal";
import type { Member, Priority, Section, Task } from "./taskBoard/types";
import { getInitials, uid } from "./taskBoard/utils";
import GroupService from "../../services/GroupService";
import TaskService, { type BoardTaskResponse } from "../../services/TaskService";
import BoardService from "../../services/BoardService";
import BoardMemberService from "../../services/BoardMemberService";
import OrganizationService, {
  type OrganizationMemberResponse,
} from "../../services/OrganizationServices";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function TaskBoardPage() {
  const { boardId } = useParams();
  const [sections, setSections] = useState<Section[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [organizationMembers, setOrganizationMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [quickAddSectionId, setQuickAddSectionId] = useState<string | null>(
    null,
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [ticketCounter, setTicketCounter] = useState(0);

  useEffect(() => {
    const parsedBoardId = Number(boardId);
    if (!Number.isInteger(parsedBoardId)) {
      return;
    }

    let cancelled = false;

    const loadTasks = async () => {
      try {
        const [loadedTasks, board] = await Promise.all([
          TaskService.getTasks(parsedBoardId),
          BoardService.getBoard(parsedBoardId),
        ]);
        const loadedMembers = await OrganizationService.getOrganizationMembers(
          board.orgId,
        );
        if (cancelled) return;

        setTasks(loadedTasks.map(toBoardTask));
        setTicketCounter(loadedTasks.length);
        setOrganizationMembers(loadedMembers.map(toBoardMember));
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load tasks:", error);
        toast.error("Tasks couldn't be loaded. Please try again.");
      }
    };

    void loadTasks();
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const sortedSections = [...sections].sort(
    (first, second) => first.position - second.position,
  );
  const filteredTasks = tasks.filter(
    (task) =>
      (!search || task.title.toLowerCase().includes(search.toLowerCase())) &&
      (!assigneeFilter || task.assignee?.id === assigneeFilter) &&
      (!priorityFilter || task.priority === priorityFilter),
  );

  const addSection = async () => {
    const memberId = localStorage.getItem("memberId");
    const parsedBoardId = Number(boardId);
    if (!newSectionName.trim()) return;
    if (!Number.isInteger(parsedBoardId) || !memberId) {
      toast.error("Board or member information is missing.");
      return;
    }

    const currentPosition = sections.length;
    try {
      const createdGroup = await GroupService.createGroup(parsedBoardId, {
        boardId: parsedBoardId,
        groupName: newSectionName.trim(),
        position: currentPosition,
        createdBy: memberId,
      });

      setSections((current) => [
        ...current,
        {
          id: String(createdGroup.groupId),
          name: createdGroup.groupName.toUpperCase(),
          color: SECTION_COLORS[current.length % SECTION_COLORS.length],
          collapsed: false,
          position: createdGroup.position,
        },
      ]);
      setNewSectionName("");
      setAddingSection(false);
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Group couldn't be created. Please try again.",
      );
    }
  };
  const addTask = (task: Omit<Task, "id" | "ticketNum">) => {
    const next = ticketCounter + 1;
    setTicketCounter(next);
    setTasks((current) => [
      ...current,
      { ...task, id: uid(), ticketNum: `T-${next}` },
    ]);
  };
  const addMember = async (member: Member) => {
    const parsedBoardId = Number(boardId);
    if (!Number.isInteger(parsedBoardId)) {
      toast.error("Board information is missing.");
      return;
    }

    try {
      await BoardMemberService.addMember(parsedBoardId, member.id);
      setMembers((current) => [
        ...current,
        {
          ...member,
          color: MEMBER_COLORS[current.length % MEMBER_COLORS.length],
        },
      ]);
    } catch (error) {
      console.error("Failed to add board member:", error);
      toast.error("Member couldn't be added to this board. Please try again.");
      throw error;
    }
  };
  const updateTask = (updated: Task) => {
    setTasks((current) =>
      current.map((task) => (task.id === updated.id ? updated : task)),
    );
    if (selectedTask?.id === updated.id) setSelectedTask(updated);
  };
  const openQuickAdd = (sectionId: string | null) => {
    setQuickAddSectionId(sectionId);
    setShowQuickAdd(true);
  };
  const deleteSection = (sectionId: string) => {
    setSections((current) =>
      current.filter((section) => section.id !== sectionId),
    );
    setTasks((current) =>
      current.filter((task) => task.sectionId !== sectionId),
    );
  };
  const moveTask = (sectionId: string) => {
    if (!draggingTaskId) return;
    setTasks((current) =>
      current.map((task) =>
        task.id === draggingTaskId ? { ...task, sectionId } : task,
      ),
    );
    setDraggingTaskId(null);
    setDragTarget(null);
  };

  return (
    <div
      className="relative flex h-screen overflow-hidden bg-[#F6F7FB]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <PageBackground />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <BoardHeader
          members={members}
          onAddMember={() => setShowAddMember(true)}
        />
        <BoardToolbar
          members={members}
          search={search}
          assigneeFilter={assigneeFilter}
          priorityFilter={priorityFilter}
          onSearchChange={setSearch}
          onAssigneeFilter={setAssigneeFilter}
          onPriorityFilter={setPriorityFilter}
          onCreate={() => openQuickAdd(null)}
        />
        {sections.length === 0 && !addingSection ? (
          <EmptyBoard onCreate={() => setAddingSection(true)} />
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div
              className="flex gap-3 p-4"
              style={{ minWidth: "max-content", minHeight: "100%" }}
            >
              {sortedSections.map((section) => (
                <SectionColumn
                  key={section.id}
                  section={section}
                  tasks={filteredTasks.filter(
                    (task) => task.sectionId === section.id,
                  )}
                  draggingTaskId={draggingTaskId}
                  dragTarget={dragTarget}
                  onRename={(id, name) =>
                    setSections((current) =>
                      current.map((item) =>
                        item.id === id ? { ...item, name } : item,
                      ),
                    )
                  }
                  onToggleCollapse={(id) =>
                    setSections((current) =>
                      current.map((item) =>
                        item.id === id
                          ? { ...item, collapsed: !item.collapsed }
                          : item,
                      ),
                    )
                  }
                  onDelete={deleteSection}
                  onDragOver={setDragTarget}
                  onDrop={moveTask}
                  onDragStart={setDraggingTaskId}
                  onDragEnd={() => {
                    setDraggingTaskId(null);
                    setDragTarget(null);
                  }}
                  onSelectTask={setSelectedTask}
                  onCreateTask={openQuickAdd}
                />
              ))}
              <NewSectionControl
                adding={addingSection}
                name={newSectionName}
                onStart={() => setAddingSection(true)}
                onNameChange={setNewSectionName}
                onAdd={addSection}
                onCancel={() => {
                  setAddingSection(false);
                  setNewSectionName("");
                }}
              />
            </div>
          </div>
        )}
      </div>
      {showQuickAdd && (
        <QuickAddModal
          initialSectionId={quickAddSectionId}
          sections={sortedSections}
          members={members}
          onClose={() => setShowQuickAdd(false)}
          onCreate={addTask}
        />
      )}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          sections={sortedSections}
          members={members}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
        />
      )}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdd={addMember}
          availableMembers={organizationMembers.filter(
            (candidate) =>
              !members.some((member) => member.id === candidate.id),
          )}
        />
      )}
    </div>
  );
}

function toBoardTask(task: BoardTaskResponse): Task {
  return {
    id: String(task.taskId),
    ticketNum: `T-${task.taskId}`,
    title: task.title,
    description: "",
    assignee: null,
    dueDate: null,
    priority: "none",
    status: "open",
    labels: [],
    comments: 0,
    attachments: 0,
    sectionId: String(task.groupId),
  };
}

function toBoardMember(member: OrganizationMemberResponse): Member {
  return {
    id: member.memberId,
    name: member.email,
    initials: getInitials(member.email),
    color: MEMBER_COLORS[0],
  };
}

function EmptyBoard({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F0FF]">
        <LayoutGrid size={28} className="text-[#0073EA]" />
      </div>
      <div>
        <h3 className="mb-1 text-[15px] font-semibold text-[#1F2937]">
          This board has no groups yet
        </h3>
        <p className="max-w-xs text-[13px] text-[#9CA3AF]">
          Create your first group to start organizing tasks into columns.
        </p>
      </div>
      <PrimaryButton
        onClick={onCreate}
        className="h-auto px-4 py-2 text-[13px]"
      >
        Create first group
      </PrimaryButton>
    </div>
  );
}

function NewSectionControl({
  adding,
  name,
  onStart,
  onNameChange,
  onAdd,
  onCancel,
}: {
  adding: boolean;
  name: string;
  onStart: () => void;
  onNameChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="w-[272px] flex-shrink-0">
      {adding ? (
        <div className="rounded-xl border border-[#E6E9EF] bg-white p-3 shadow-sm">
          <input
            autoFocus
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onAdd();
              if (event.key === "Escape") onCancel();
            }}
            placeholder="Group name..."
            className="mb-2 w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2 text-[12.5px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]"
          />
          <div className="flex gap-2">
            <PrimaryButton
              onClick={onAdd}
              disabled={!name.trim()}
              className="h-auto flex-1 px-0 py-1.5 text-[12px]"
            >
              Add
            </PrimaryButton>
            <button
              onClick={onCancel}
              className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onStart}
          className="group flex w-full items-center gap-2 rounded-xl border border-[#E6E9EF] bg-white px-4 py-3 text-[12.5px] font-medium text-[#6B7280] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all hover:border-[#0073EA]/40 hover:bg-[#E6F0FF]/40 hover:text-[#0073EA]"
        >
          <Plus size={14} className="group-hover:text-[#0073EA]" />
          Add another group
        </button>
      )}
    </div>
  );
}
