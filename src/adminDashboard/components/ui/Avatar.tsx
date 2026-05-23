interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md';
}

export function Avatar({ initials, size = 'md' }: AvatarProps) {
  return <span className={`avatar avatar--${size}`}>{initials}</span>;
}
