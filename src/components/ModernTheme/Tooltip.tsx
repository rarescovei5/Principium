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

interface TooltipContextType {
  isOpen: boolean;
  onTriggerEnter: () => void;
  onTriggerLeave: () => void;
  onContentEnter: () => void;
  onContentLeave: () => void;
}

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode | ReactElement<any>;
  className?: string;
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────

const TooltipContext = createContext<TooltipContextType | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context)
    throw new Error('Tooltip components must be used within a Tooltip');
  return context;
};

// ────────────────────────────────────────────────────────────────
// TOOLTIP COMPONENT
// ────────────────────────────────────────────────────────────────

const Tooltip: FC<TooltipProps> = ({ children, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerHovered = useRef(false);
  const contentHovered = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const updateOpenState = useCallback(() => {
    if (triggerHovered.current || contentHovered.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (!isOpen) {
        timeoutRef.current = window.setTimeout(() => {
          setIsOpen(true);
          timeoutRef.current = null;
        }, 300);
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        timeoutRef.current = null;
      }, 150);
    }
  }, [isOpen]);

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
    <TooltipContext.Provider value={contextValue}>
      <div className={'relative inline ' + className} {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

// ────────────────────────────────────────────────────────────────
// TOOLTIP TRIGGER COMPONENT
// ────────────────────────────────────────────────────────────────

const TooltipTrigger: FC<TooltipTriggerProps> = ({
  children,
  asChild = false,
  className = '',
  ...props
}) => {
  const context = useTooltipContext();
  const triggerProps = {
    onMouseEnter: context.onTriggerEnter,
    onMouseLeave: context.onTriggerLeave,
    ...props,
  };

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error(
        'TooltipTrigger requires a valid ReactElement when `asChild` is true.'
      );
      return null;
    }
    return React.cloneElement(children, triggerProps);
  }

  return (
    <Button {...triggerProps} className={className}>
      {children}
    </Button>
  );
};

// ────────────────────────────────────────────────────────────────
// TOOLTIP CONTENT COMPONENT
// ────────────────────────────────────────────────────────────────

const TooltipContent: FC<TooltipContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useTooltipContext();
  if (!context.isOpen) return null;
  return (
    <div
      className={
        'absolute bottom-[calc(100%+1rem)] left-[50%] translate-x-[-50%] bg-bg py-2 px-3 rounded-lg border border-border ' +
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

export { Tooltip, TooltipTrigger, TooltipContent };
