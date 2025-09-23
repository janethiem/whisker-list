import Icon from '../../ui/Icon';

interface CompletionCheckboxProps {
  isCompleted: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export default function CompletionCheckbox({ 
  isCompleted, 
  onToggle, 
  isLoading = false 
}: CompletionCheckboxProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`
        flex-shrink-0 w-8 h-8 rounded-full border-2 
        flex items-center justify-center transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${isCompleted 
          ? 'bg-green-500 border-green-500' 
          : 'border-gray-300 hover:border-green-400'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `.trim()}
    >
      {isCompleted && (
        <Icon name="complete" size={20} className="text-white" />
      )}
    </button>
  );
}
