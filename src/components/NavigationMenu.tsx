import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from './Button';
import { Link, LinkProps } from 'react-router-dom';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────

interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {}
interface NavigationMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}
interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}
interface NavigationMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface NavigationMenuViewportProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// ────────────────────────────────────────────────────────────────
// CONTEXT (Menu, Item)
// ────────────────────────────────────────────────────────────────

type RefType = React.RefObject<HTMLDivElement> | null;

interface NavigationMenuContextType {
  activeRef: RefType;
  setActiveRef: React.Dispatch<SetStateAction<RefType>>;
  // A shared timeout ref to coordinate show/hide delays between trigger and viewport
  timeoutRef: React.RefObject<number | null>;
}
const NavigationMenuContext = createContext<NavigationMenuContextType | null>(
  null
);
const useNavigationMenuContext = () => {
  const context = useContext(NavigationMenuContext);
  if (!context)
    throw new Error(
      'NavigationMenu components must be used within a `NavigationMenu` component'
    );
  return context;
};

interface NavigationMenuItemContextType {
  siblingRef: RefType;
  setSiblingRef: React.Dispatch<SetStateAction<RefType>>;
}
const NavigationMenuItemContext =
  createContext<NavigationMenuItemContextType | null>(null);
const useNavigationMenuItemContext = () => {
  const context = useContext(NavigationMenuItemContext);
  if (!context)
    throw new Error(
      'NavigationMenu components must be used within a `NavigationMenu` component'
    );
  return context;
};

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  children,
  ...props
}) => {
  const [activeRef, setActiveRef] = useState<RefType>(null);
  const timeoutRef = useRef<number | null>(null);

  return (
    <NavigationMenuContext.Provider
      value={{ activeRef, setActiveRef, timeoutRef }}
    >
      <nav className="flex gap-2 relative" {...props}>
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
};

const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  children,
  className = '',
  ...props
}) => {
  const [siblingRef, setSiblingRef] = useState<RefType>(null);
  return (
    <NavigationMenuItemContext.Provider value={{ siblingRef, setSiblingRef }}>
      <div className={className} {...props}>
        {children}
      </div>
    </NavigationMenuItemContext.Provider>
  );
};

const NavigationMenuTrigger: React.FC<NavigationMenuTriggerProps> = ({
  children,
  ...props
}) => {
  const { activeRef, setActiveRef, timeoutRef } = useNavigationMenuContext();
  const { siblingRef } = useNavigationMenuItemContext();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (activeRef?.current) {
      setActiveRef(siblingRef);
      timeoutRef.current = null;
      return;
    }
    if (siblingRef?.current) {
      timeoutRef.current = window.setTimeout(() => {
        setActiveRef(siblingRef);
        timeoutRef.current = null;
      }, 150);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Delay hiding by 150ms
    timeoutRef.current = window.setTimeout(() => {
      setActiveRef(null);
      timeoutRef.current = null;
    }, 150);
  };

  return (
    <Button
      variant="ghost"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      <svg
        className={`w-2 transition-transform duration-300 ml-4 ${
          activeRef?.current.innerHTML === siblingRef?.current.innerHTML
            ? 'rotate-180'
            : ''
        }`}
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.75078 3.90553L0.0950727 0.511126C0.0340446 0.454488 0 0.379241 0 0.300992C0 0.222744 0.0340446 0.147497 0.0950727 0.0908601L0.0992035 0.0872054C0.128789 0.0596535 0.1644 0.0377147 0.203871 0.022723C0.243343 0.0077312 0.285849 2.38419e-07 0.328804 2.38419e-07C0.371759 2.38419e-07 0.414265 0.0077312 0.453736 0.022723C0.493207 0.0377147 0.528819 0.0596535 0.558404 0.0872054L4.00069 3.28366L7.4416 0.0872054C7.47118 0.0596535 7.50679 0.0377147 7.54626 0.022723C7.58573 0.0077312 7.62824 2.38419e-07 7.6712 2.38419e-07C7.71415 2.38419e-07 7.75666 0.0077312 7.79613 0.022723C7.8356 0.0377147 7.87121 0.0596535 7.9008 0.0872054L7.90493 0.0908601C7.96596 0.147497 8 0.222744 8 0.300992C8 0.379241 7.96596 0.454488 7.90493 0.511126L4.24922 3.90553C4.21707 3.93538 4.17841 3.95915 4.13557 3.97539C4.09273 3.99163 4.04661 4 4 4C3.95339 4 3.90727 3.99163 3.86443 3.97539C3.82159 3.95915 3.78293 3.93538 3.75078 3.90553Z"
          fill="white"
        />
      </svg>
    </Button>
  );
};

const NavigationMenuContent: React.FC<NavigationMenuContentProps> = ({
  children,
  className,
  ...props
}) => {
  // This hidden element is only used as the source for the viewport’s content.
  const ref = useRef<HTMLDivElement>(null!);
  const { setSiblingRef } = useNavigationMenuItemContext();

  useEffect(() => {
    setSiblingRef(ref);
  }, [setSiblingRef]);

  return (
    <div ref={ref} className="hidden">
      <div className={`animate-slideInFromRight ${className}`} {...props}>
        {children}
      </div>
    </div>
  );
};

const NavigationMenuViewport: React.FC<NavigationMenuViewportProps> = ({
  className,
  ...props
}) => {
  const { activeRef, setActiveRef, timeoutRef } = useNavigationMenuContext();
  const [contentHTML, setContentHTML] = useState<string>('');

  useEffect(() => {
    if (activeRef?.current) {
      setContentHTML(activeRef.current.innerHTML);
    } else {
      setContentHTML('');
    }
  }, [activeRef]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = window.setTimeout(() => {
      setActiveRef(null);
      timeoutRef.current = null;
    }, 150);
  };

  return (
    contentHTML && (
      <div
        className={`top-[calc(100%+0.25rem)] left-0 absolute border border-border rounded-lg z-1000 bg-bg overflow-hidden ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    )
  );
};

const NavigationMenuLink: React.FC<LinkProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Link
      className={`block h-full p-3 rounded-lg hover:bg-surface transition-colors duration-150 p ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
};
