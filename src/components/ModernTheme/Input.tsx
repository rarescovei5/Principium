const Input = ({
  children,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={
        'px-3 py-2 p text-white h-10 w-full rounded-lg border border-border bg-bg outline-none ' +
        className
      }
      {...props}
    />
  );
};

export { Input };
