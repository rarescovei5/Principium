import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  FC,
  ReactNode,
  ReactElement,
} from 'react';
import { Button } from './Button';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────

interface ToastContextType {
  isOpen: boolean;
  toggle: () => void;
}

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ToastTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode | ReactElement<any>;
  className?: string;
}

interface ToastContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ToastTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ToastDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ToastActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode | ReactElement<any>;
  className?: string;
}

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | null>(null);

const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('Toast components must be used within a Toast');
  return context;
};

// ────────────────────────────────────────────────────────────────
// TOAST COMPONENT
// ────────────────────────────────────────────────────────────────

const Toast: FC<ToastProps> = ({ children, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <ToastContext.Provider value={{ isOpen, toggle }}>
      <div className={'relative ' + className} {...props}>
        {children}
      </div>
    </ToastContext.Provider>
  );
};

// ────────────────────────────────────────────────────────────────
// TOAST TRIGGER COMPONENT
// ────────────────────────────────────────────────────────────────

const ToastTrigger: FC<ToastTriggerProps> = ({
  children,
  className = '',
  asChild = false,
  ...props
}) => {
  const context = useToastContext();

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error(
        'ToastTrigger requires a valid ReactElement when `asChild` is true.'
      );
      return null;
    }
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: React.MouseEventHandler<HTMLElement>;
      }>,
      { onClick: context.toggle }
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
// TOAST ACTION COMPONENT
// ────────────────────────────────────────────────────────────────

const ToastAction: FC<ToastActionProps> = ({
  children,
  className = '',
  asChild = false,
  ...props
}) => {
  const context = useToastContext();

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error(
        'ToastAction requires a valid ReactElement when `asChild` is true.'
      );
      return null;
    }
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: React.MouseEventHandler<HTMLElement>;
      }>,
      { onClick: context.toggle }
    );
  }

  return (
    <div
      style={{ gridArea: 'TA' }}
      className={'grid place-content-center mx-6 ' + className}
    >
      <Button variant="outline" {...props}>
        {children}
      </Button>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// TOAST CONTENT COMPONENT
// ────────────────────────────────────────────────────────────────

const ToastContent: FC<ToastContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useToastContext();
  return context.isOpen ? (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
            'TT TA'
            'TD TA'
            `,
        gridTemplateColumns: '1fr auto',
      }}
      className={
        'fixed min-w-100 p-6 right-4 bottom-4 rounded-lg border border-border ' +
        className
      }
      {...props}
    >
      <button
        className="flex items-center justify-center w-6 h-6 absolute top-3 right-3 cursor-pointer rounded-lg group"
        onClick={context.toggle}
      >
        <svg
          className="w-2 fill-subtext group-hover:fill-text"
          viewBox="0 0 8 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 4.4632L0.567877 7.89532C0.506815 7.95638 0.431796 7.9891 0.34282 7.99346C0.253843 7.99782 0.174463 7.96511 0.104678 7.89532C0.0348925 7.82554 0 7.74834 0 7.66372C0 7.57911 0.0348925 7.50191 0.104678 7.43212L3.5368 4L0.104678 0.567877C0.0436156 0.506815 0.0109038 0.431796 0.0065422 0.34282C0.00218062 0.253843 0.0348925 0.174463 0.104678 0.104678C0.174463 0.0348925 0.251663 0 0.336277 0C0.420892 0 0.498092 0.0348925 0.567877 0.104678L4 3.5368L7.43212 0.104678C7.49319 0.0436156 7.56842 0.0109038 7.65783 0.0065422C7.74637 0.00218062 7.82554 0.0348925 7.89532 0.104678C7.96511 0.174463 8 0.251663 8 0.336277C8 0.420892 7.96511 0.498092 7.89532 0.567877L4.4632 4L7.89532 7.43212C7.95638 7.49319 7.9891 7.56842 7.99346 7.65783C7.99782 7.74637 7.96511 7.82554 7.89532 7.89532C7.82554 7.96511 7.74834 8 7.66372 8C7.57911 8 7.50191 7.96511 7.43212 7.89532L4 4.4632Z" />
        </svg>
      </button>
      {children}
    </div>
  ) : null;
};

// ────────────────────────────────────────────────────────────────
// TOAST TITLE COMPONENT
// ────────────────────────────────────────────────────────────────

const ToastTitle: FC<ToastTitleProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div style={{ gridArea: 'TT' }} className={'p ' + className} {...props}>
      {children}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// TOAST DESCRIPTION COMPONENT
// ────────────────────────────────────────────────────────────────

const ToastDescription: FC<ToastDescriptionProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      style={{ gridArea: 'TD' }}
      className={'p text-subtext ' + className}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Toast,
  ToastTrigger,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
};
