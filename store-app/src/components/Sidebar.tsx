import { CloudDownloadIcon, LibraryIcon, StoreIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="m-2 w-20 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <SidebarButton icon={<StoreIcon />} label="Discover" path="/" />
      </div>
      <div className="flex flex-col gap-2">
        <SidebarButton icon={<CloudDownloadIcon />} label="Downloads" path="/downloads" />
        <SidebarButton icon={<LibraryIcon />} label="Library" path="/library" />
      </div>
    </aside>
  );
};

const SidebarButton = ({
  icon,
  label,
  path,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
}) => {
  const location = useLocation();

  const isLocationApp = location.pathname.includes('app');
  const isHome = path === '/';
  const isActive = location.pathname === path || (isLocationApp && isHome);

  return (
    <Link
      to={path}
      className={`relative w-full aspect-square flex flex-col justify-center rounded-md items-center transition-all duration-200 ${
        isActive
          ? 'bg-background text-primary'
          : 'hover:bg-background hover:text-foreground'
      }`}
    >
      {isActive && (
        <motion.span
          className={`w-px h-6 bg-primary rounded-full absolute top-1/2 -translate-y-1/2 left-0 z-100`}
          layout
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          animate={{
            scaleY: isActive ? 1 : 0.5,
          }}
          layoutId={`sidebar-button-cursor`}
        ></motion.span>
      )}
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default Sidebar;
