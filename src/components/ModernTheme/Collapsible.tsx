import React, { createContext, useContext, useState } from 'react';
import { Button } from './Button';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────
interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode | React.ReactElement<any>;
  className?: string;
}
interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  toggle?: () => void;
  className?: string;
}
interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────

interface CollapsibleContextType {
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext);
  if (!context)
    throw new Error(
      'Collapsible components must be used within a `Collapsible` component.'
    );
  return context;
};

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────

/**
 * Collapsible component that provides context for its children.
 */
const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  isOpen,
  toggle,
  className = '',
  ...props
}) => {
  // Internal state for open/closed if not controlled via props
  const [isOpenInternal, setIsOpenInternal] = useState<boolean>(isOpen ?? true);

  // Use the provided toggle if available, otherwise use internal state
  const toggleF = toggle ?? (() => setIsOpenInternal((prev) => !prev));

  return (
    <CollapsibleContext.Provider
      value={{ isOpen: isOpen ?? isOpenInternal, toggle: toggleF }}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

/**
 * CollapsibleTrigger component that toggles the collapsible state.
 * Supports the `asChild` prop for custom trigger elements.
 */
const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  className = '',
  asChild = false,
  ...props
}) => {
  const context = useCollapsibleContext();

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error(
        'AlertDialogTrigger requires a valid ReactElement when asChild is true.'
      );
      return null;
    }
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: React.MouseEventHandler<HTMLElement>;
      }>,
      {
        onClick: context.toggle,
      }
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

/**
 * CollapsibleContent component that conditionally renders its children
 * based on the collapsible state.
 */
const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useCollapsibleContext();

  return context.isOpen ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null;
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
