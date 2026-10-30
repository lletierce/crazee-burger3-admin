import { LuPlus } from 'react-icons/lu';

interface AddProductButtonProps {
  onClick: () => void;
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        ml-auto 
        flex 
        items-center 
        gap-2 
        rounded-md 
        bg-primary 
        px-4 
        py-2 
        text-sm font-medium 
        text-on-primary 
        transition-colors 
        hover:bg-primary-hover"
    >
      <LuPlus size={16} />
      Ajouter
    </button>
  );
}