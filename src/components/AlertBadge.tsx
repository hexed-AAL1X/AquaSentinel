interface AlertBadgeProps {
  level: 'normal' | 'warning' | 'danger';
  text: string;
}

export default function AlertBadge({ level, text }: AlertBadgeProps) {
  const levelStyles = {
    normal: 'bg-accent text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-secondary text-white',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${levelStyles[level]}`}>
      {text}
    </span>
  );
}
