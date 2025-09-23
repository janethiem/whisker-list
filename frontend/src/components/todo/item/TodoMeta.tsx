import Icon from '../../ui/Icon';
import PriorityBadge from './PriorityBadge';

interface TodoMetaProps {
  createdAt: string;
  dueDate?: string;
  isCompleted: boolean;
  priority: 1 | 2 | 3;
}

export default function TodoMeta({ 
  createdAt, 
  dueDate, 
  isCompleted,
  priority
}: TodoMetaProps) {
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;
  
  return (
    <div className="flex items-center mt-1 text-xs" style={{color: '#333333'}}>
      <div className="flex items-center gap-3">
        <PriorityBadge priority={priority} />
        
        {dueDate && (
          <div className={`flex items-center gap-1 ${
            isOverdue ? 'text-red-600 font-medium' : ''
          }`}>
            <Icon name="calendar" size={12} />
            <span>
              Due {new Date(dueDate).toLocaleDateString()}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        )}
        
        <span>Created {new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
