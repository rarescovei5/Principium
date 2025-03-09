const variantClasses: Record<
  'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link',
  string
> = {
  primary: `bg-white text-bg hover:bg-white/90 disabled:bg-white/50`,
  secondary: `bg-surface hover:bg-surface/50 disabled:bg-surface/25`,
  destructive: `bg-error hover:bg-error/50 disabled:bg-error/25`,
  outline: `border border-border hover:bg-border disabled:border-border/50`,
  ghost: `hover:bg-surface`,
  link: `hover:underline`,
};

// ────────────────────────────────────────────────────────────────
// BUTTON COMPONENT
// ────────────────────────────────────────────────────────────────

const Button = ({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  icon = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  disabled?: boolean;
  icon?: boolean;
}) => {
  const baseClasses = `p inline-flex items-center justify-center h-10 rounded-lg transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed`;
  const paddingClasses = icon ? 'w-10 h-10' : 'px-6 py-2 min-w-20';

  return (
    <button
      className={`${baseClasses} ${paddingClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
