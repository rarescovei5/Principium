import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
  FC,
  ReactNode,
  ReactElement,
} from 'react';
import { Button } from './Button';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────

interface HoverCardContextType {
  isOpen: boolean;
  onTriggerEnter: () => void;
  onTriggerLeave: () => void;
  onContentEnter: () => void;
  onContentLeave: () => void;
}

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface HoverCardTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode | ReactElement<any>;
  className?: string;
}

interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────

const HoverCardContext = createContext<HoverCardContextType | null>(null);

const useHoverCardContext = () => {
  const context = useContext(HoverCardContext);
  if (!context)
    throw new Error('HoverCard components must be used within a HoverCard');
  return context;
};

// ────────────────────────────────────────────────────────────────
// HOVER CARD COMPONENT
// ────────────────────────────────────────────────────────────────

/**
 * HoverCard provides context to its children and manages hover state.
 */
const HoverCard: FC<HoverCardProps> = ({
  children,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Track whether the trigger or content is hovered
  const triggerHovered = useRef(false);
  const contentHovered = useRef(false);
  // Shared timeout ref for both showing and hiding
  const timeoutRef = useRef<number | null>(null);

  // Memoized function to update open state based on hover status.
  const updateOpenState = useCallback(() => {
    if (triggerHovered.current || contentHovered.current) {
      // If hovered, clear any pending hide timeout.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Open if not already open.
      if (!isOpen) {
        timeoutRef.current = window.setTimeout(() => {
          setIsOpen(true);
          timeoutRef.current = null;
        }, 300);
      }
    } else {
      // If not hovered, clear any pending open timeout.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        timeoutRef.current = null;
      }, 300);
    }
  }, [isOpen]);

  // Memoized event handlers.
  const onTriggerEnter = useCallback(() => {
    triggerHovered.current = true;
    updateOpenState();
  }, [updateOpenState]);

  const onTriggerLeave = useCallback(() => {
    triggerHovered.current = false;
    updateOpenState();
  }, [updateOpenState]);

  const onContentEnter = useCallback(() => {
    contentHovered.current = true;
    updateOpenState();
  }, [updateOpenState]);

  const onContentLeave = useCallback(() => {
    contentHovered.current = false;
    updateOpenState();
  }, [updateOpenState]);

  // Memoize the context value.
  const contextValue = useMemo(
    () => ({
      isOpen,
      onTriggerEnter,
      onTriggerLeave,
      onContentEnter,
      onContentLeave,
    }),
    [isOpen, onTriggerEnter, onTriggerLeave, onContentEnter, onContentLeave]
  );

  return (
    <HoverCardContext.Provider value={contextValue}>
      <div className={'relative ' + className} {...props}>
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};

// ────────────────────────────────────────────────────────────────
// HOVER CARD TRIGGER COMPONENT
// ────────────────────────────────────────────────────────────────

/**
 * HoverCardTrigger listens for mouse enter/leave events to control the hover state.
 */
const HoverCardTrigger: FC<HoverCardTriggerProps> = ({
  children,
  asChild = false,
  className = '',
  ...props
}) => {
  const context = useHoverCardContext();

  const triggerProps = {
    onMouseEnter: context.onTriggerEnter,
    onMouseLeave: context.onTriggerLeave,
    ...props,
  };

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error(
        'HoverCardTrigger requires a valid ReactElement when `asChild` is true.'
      );
      return null;
    }
    return React.cloneElement(children, triggerProps);
  }

  return <Button {...triggerProps}>{children}</Button>;
};

// ────────────────────────────────────────────────────────────────
// HOVER CARD CONTENT COMPONENT
// ────────────────────────────────────────────────────────────────

/**
 * HoverCardContent renders the card's content when hovered.
 */
const HoverCardContent: FC<HoverCardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useHoverCardContext();
  if (!context) {
    console.error(
      'HoverCardContent must be used within a HoverCard component.'
    );
    return null;
  }

  // Only render content when the hover card is open.
  if (!context.isOpen) return null;

  return (
    <div
      className={
        'absolute top-[calc(100%+1rem)] bg-bg p-6 rounded-lg border border-border ' +
        className
      }
      onMouseEnter={context.onContentEnter}
      onMouseLeave={context.onContentLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export { HoverCard, HoverCardTrigger, HoverCardContent };
