import type { Member } from "../pages/groups/types/taskBoardtypes";

export function Avatar({
  member,
  size = 26,
}: {
  member: Member;
  size?: number;
}) {
  return (
    <div
      title={member.name}
      className="flex shrink-0 select-none items-center justify-center rounded-full text-white font-semibold ring-[1.5px] ring-white"
      style={{
        width: size,
        height: size,
        background: member.color,
        fontSize: Math.floor(size * 0.37),
      }}
    >
      {member.initials}
    </div>
  );
}
