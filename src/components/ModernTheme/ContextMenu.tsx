import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  FC,
  ReactNode,
  useCallback,
} from 'react';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────
type PositionType = { x: number; y: number } | null;

interface ContextMenuContextType {
  lastPos: PositionType;
  setLastPos: React.Dispatch<SetStateAction<PositionType>>;
}
const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);
  if (!context)
    throw new Error('ContextMenu components must be used within a ContextMenu');
  return context;
};

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────

/**
 * ContextMenu component that provides context for its children.
 */
const ContextMenu: FC<ContextMenuProps> = ({
  children,
  className = '',
  ...props
}) => {
  const [lastPos, setLastPos] = useState<PositionType>(null);

  return (
    <ContextMenuContext.Provider value={{ lastPos, setLastPos }}>
      <div className={className} {...props}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
};

/**
 * ContextMenuTrigger component that listens for right-click events.
 * When a right-click occurs, it stores the click position in the context.
 */
const ContextMenuTrigger: FC<ContextMenuTriggerProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContextMenuContext();

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      context.setLastPos({ x: e.clientX, y: e.clientY });
    },
    [context]
  );

  return (
    <div className={className} onContextMenu={handleRightClick} {...props}>
      {children}
    </div>
  );
};

/**
 * ContextMenuContent component that conditionally renders its children
 * based on the stored position from the context.
 */
const ContextMenuContent: FC<ContextMenuContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContextMenuContext();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!document.getElementById('ContextMenuContent')?.contains(target)) {
        context.setLastPos(null);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [context]);

  return context.lastPos ? (
    <div
      id="ContextMenuContent"
      style={{
        position: 'fixed',
        zIndex: '100',
        left: `${context.lastPos.x + 8}px`,
        top: `${context.lastPos.y + 8}px`,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  ) : null;
};

export { ContextMenu, ContextMenuTrigger, ContextMenuContent };
