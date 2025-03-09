const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  return <div className={'animate-pulse bg-surface ' + className}></div>;
};

export { Skeleton };
