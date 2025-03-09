const Label = ({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className={'p text-white ' + className} {...props}>
      {children}
    </label>
  );
};

export { Label };
