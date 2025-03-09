interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: any;
  activity?: 'none' | 'active' | 'disturb' | 'idle' | 'invisible';
}

const Avatar: React.FC<AvatarProps> = ({
  className = '',
  activity,
  ...props
}) => {
  const activityColors: Record<'active' | 'disturb' | 'idle', string> = {
    active: 'after:bg-succes',
    disturb: 'after:bg-error',
    idle: 'after:bg-warning',
  };
  //Base Activity Circle Classes
  let activityClasses =
    activity === undefined || activity === 'none'
      ? ''
      : activity !== 'invisible'
      ? `after:content-[""] after:outline-2 after:outline-bg after:absolute after:w-[20%] after:rounded-full after:aspect-square after:bottom-[5%] after:right-[5%] ${activityColors[activity]}`
      : `after:content-[""] after:outline-2 after:outline-bg after:absolute after:w-[20%] after:rounded-full after:aspect-square after:bottom-[5%] after:right-[5%] after:border-1 after:border-border after:bg-bg`;
  return (
    <div className={`w-max relative ${activityClasses}`}>
      <img className={`rounded-full aspect-square ${className}`} {...props} />
    </div>
  );
};

export { Avatar };
