const Textarea: React.FC<React.HTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => {
  return (
    <textarea
      className={
        'p px-3 py-2 border border-border rounded-lg outline-0 min-h-20 ' +
        className
      }
      {...props}
    />
  );
};

export { Textarea };
