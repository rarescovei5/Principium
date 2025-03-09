import React, { createContext, useContext } from 'react';

// ────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────
interface AlertContextType {
  variant: 'normal' | 'destructive';
}

const AlertContext = createContext<AlertContextType>({
  variant: 'normal',
});

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'normal' | 'destructive';
}
interface AlertIconProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
  children: React.ReactElement<HTMLImageElement>;
}
interface AlertCircleProps extends React.HTMLAttributes<SVGElement> {}
interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────
const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'normal',
  className = '',
  ...props
}) => {
  return (
    <AlertContext.Provider value={{ variant }}>
      <div
        style={{
          display: 'grid',
          gridTemplateAreas: `
            'IC TT'
            '. CT'
            `,
          rowGap: '0.25rem',
          gridTemplateColumns: 'auto 1fr',
        }}
        className={`max-w-2xl p-4 border rounded-lg ${
          variant === 'destructive' ? 'border-error' : 'border-border'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    </AlertContext.Provider>
  );
};

const AlertIcon: React.FC<AlertIconProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div style={{ gridArea: 'IC' }} {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          className: `${child.props.className} relative top-[50%] -translate-y-[50%] mr-4`,
        })
      )}
    </div>
  );
};

const AlertTitle: React.FC<AlertTitleProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContext(AlertContext);

  return (
    <div
      style={{ gridArea: 'TT' }}
      className={`h4  ${
        context.variant === 'destructive' && 'text-error'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContext(AlertContext);

  return (
    <div
      style={{ gridArea: 'CT' }}
      className={`p ${
        context.variant === 'destructive' && 'text-error'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertCircle: React.FC<AlertCircleProps> = ({
  className = '',
  ...props
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 16C3.5816 16 0 12.4184 0 8C0 3.5816 3.5816 0 8 0C12.4184 0 16 3.5816 16 8C16 12.4184 12.4184 16 8 16ZM8 14.4C9.69739 14.4 11.3253 13.7257 12.5255 12.5255C13.7257 11.3253 14.4 9.69739 14.4 8C14.4 6.30261 13.7257 4.67475 12.5255 3.47452C11.3253 2.27428 9.69739 1.6 8 1.6C6.30261 1.6 4.67475 2.27428 3.47452 3.47452C2.27428 4.67475 1.6 6.30261 1.6 8C1.6 9.69739 2.27428 11.3253 3.47452 12.5255C4.67475 13.7257 6.30261 14.4 8 14.4ZM8 4C8.21217 4 8.41566 4.08429 8.56569 4.23431C8.71571 4.38434 8.8 4.58783 8.8 4.8V8.8C8.8 9.01217 8.71571 9.21566 8.56569 9.36569C8.41566 9.51571 8.21217 9.6 8 9.6C7.78783 9.6 7.58434 9.51571 7.43431 9.36569C7.28429 9.21566 7.2 9.01217 7.2 8.8V4.8C7.2 4.58783 7.28429 4.38434 7.43431 4.23431C7.58434 4.08429 7.78783 4 8 4ZM8 12C7.78783 12 7.58434 11.9157 7.43431 11.7657C7.28429 11.6157 7.2 11.4122 7.2 11.2C7.2 10.9878 7.28429 10.7843 7.43431 10.6343C7.58434 10.4843 7.78783 10.4 8 10.4C8.21217 10.4 8.41566 10.4843 8.56569 10.6343C8.71571 10.7843 8.8 10.9878 8.8 11.2C8.8 11.4122 8.71571 11.6157 8.56569 11.7657C8.41566 11.9157 8.21217 12 8 12Z"
        fill="#EE0000"
      />
    </svg>
  );
};

export { Alert, AlertDescription, AlertTitle, AlertIcon, AlertCircle };
