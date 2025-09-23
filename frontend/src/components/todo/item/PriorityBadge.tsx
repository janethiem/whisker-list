interface PriorityBadgeProps {
  priority: 1 | 2 | 3;
  className?: string;
}

const priorityConfig = {
  1: {
    label: 'Low',
    className: 'bg-green-100 text-green-700 border-green-200'
  },
  2: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  3: {
    label: 'High',
    className: 'bg-red-100 text-red-700 border-red-200'
  }
} as const;

const PriorityBadge = ({ priority, className = '' }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <span 
      className={`
        px-2 py-1 text-xs font-medium rounded border
        ${config.className}
        ${className}
      `.trim()}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;
