const Toggle: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode | React.ReactElement<any>;
    isSelected: boolean;
    toggle: () => void;
  }
> = ({ children, isSelected, className, toggle, ...props }) => {
  return (
    <button
      onClick={toggle}
      className={
        `w-10 h-10 rounded-lg cursor-pointer ${
          isSelected ? 'bg-surface' : ''
        } ` + className
      }
      {...props}
    >
      {children}
    </button>
  );
};

export { Toggle };
