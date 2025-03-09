const Switch: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & {
    isSelected: boolean;
    toggle: () => void;
  }
> = ({ isSelected, className, toggle, ...props }) => {
  return (
    <button
      onClick={toggle}
      className={`w-10 h-5 rounded-lg cursor-pointer transition-colors duration-150 p-0.5 flex ${
        isSelected ? 'bg-white' : 'bg-surface'
      } ${className}`}
      {...props}
    >
      <span
        className={`h-full aspect-square rounded-lg bg-bg transition-transform duration-150 ${
          isSelected ? 'translate-x-5' : ''
        }`}
      ></span>
    </button>
  );
};

export { Switch };
