import React, {
  createContext,
  useContext,
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

interface PopoverContextType {
  isOpen: boolean;
  toggle: () => void;
}

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode | ReactElement<any>;
  className?: string;
}

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────

const PopoverContext = createContext<PopoverContextType | null>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within a Popover');
  }
  return context;
};

// ────────────────────────────────────────────────────────────────
// POPOVER COMPONENT
// ────────────────────────────────────────────────────────────────

const Popover: FC<PopoverProps> = ({ children, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const contextValue = useMemo(() => ({ isOpen, toggle }), [isOpen, toggle]);

  return (
    <PopoverContext.Provider value={contextValue}>
      <div className={'relative inline-block ' + className} {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

// ────────────────────────────────────────────────────────────────
// POPOVER TRIGGER COMPONENT
// ────────────────────────────────────────────────────────────────

const PopoverTrigger: FC<PopoverTriggerProps> = ({
  children,
  className = '',
  asChild = false,
  ...props
}) => {
  const context = usePopoverContext();
  const triggerProps = { onClick: context.toggle, ...props };

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error(
        'PopoverTrigger requires a valid ReactElement when `asChild` is true.'
      );
      return null;
    }
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: React.MouseEventHandler<HTMLElement>;
      }>,
      triggerProps
    );
  }

  return (
    <Button
      variant="outline"
      onClick={context.toggle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

// ────────────────────────────────────────────────────────────────
// POPOVER CONTENT COMPONENT
// ────────────────────────────────────────────────────────────────

const PopoverContent: FC<PopoverContentProps> = ({
  children,
  className = '',
  side = 'bottom',
  ...props
}) => {
  const context = usePopoverContext();
  const sideClasses: Record<typeof side, string> = {
    top: 'bottom-[calc(100%+0.5rem)] left-[50%] -translate-x-[50%]',
    right: 'left-[calc(100%+0.5rem)] top-[50%] -translate-y-[50%]',
    bottom: 'top-[calc(100%+0.5rem)] left-[50%] -translate-x-[50%]',
    left: 'right-[calc(100%+0.5rem)] top-[50%] -translate-y-[50%]',
  };

  return context.isOpen ? (
    <div
      className={'absolute ' + sideClasses[side] + ' ' + className}
      {...props}
    >
      {children}
    </div>
  ) : null;
};

export { Popover, PopoverTrigger, PopoverContent };
