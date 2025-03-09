const Progress: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { progress: number }
> = ({ progress, className }) => {
  return (
    <div className={`bg-surface rounded-lg h-5 ` + className}>
      <div
        style={{ width: `${Math.min(100, Math.max(progress, 0))}%` }}
        className="bg-text h-full rounded-lg transition-transform duration-300"
      ></div>
    </div>
  );
};

export { Progress };
