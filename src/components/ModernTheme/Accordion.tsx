import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
  FC,
  Dispatch,
} from 'react';

// ────────────────────────────────────────────────────────────────
// CONTEXTS
// ────────────────────────────────────────────────────────────────

interface AccordionContextType {
  openItem: number;
  setOpenItem: Dispatch<SetStateAction<number>>;
}
const AccordionContext = createContext<AccordionContextType | null>(null);
const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion components must be used within an Accordion provider'
    );
  }
  return context;
};

// Create a context to store the index for each AccordionItem
const AccordionItemContext = createContext<number | null>(null);
const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (context === null) {
    throw new Error(
      'AccordionTrigger and AccordionContent must be used within an AccordionItem'
    );
  }
  return context;
};

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────
interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
  children: React.ReactNode;
}

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────

const Accordion: FC<AccordionProps> = ({
  className = '',
  children,
  ...props
}) => {
  const [openItem, setOpenItem] = useState(-1);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={`flex flex-col ${className}`} {...props}>
        {React.Children.map(children, (child, idx) =>
          !React.isValidElement(child)
            ? child
            : // Inject the index prop into each AccordionItem
              React.cloneElement(
                child as React.ReactElement<AccordionItemProps>,
                { index: idx }
              )
        )}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem: FC<AccordionItemProps> = ({
  children,
  index,
  className = '',
  ...props
}) => {
  if (index === undefined) {
    throw new Error('AccordionItem must have an index');
  }
  return (
    <AccordionItemContext.Provider value={index}>
      <div className={`border-b-[1px] ${className}`} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

const AccordionTrigger: FC<AccordionTriggerProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { openItem, setOpenItem } = useAccordionContext();
  const itemIndex = useAccordionItemContext();

  const handleClick = () => {
    setOpenItem(openItem === itemIndex ? -1 : itemIndex);
  };

  return (
    <button
      className={`w-full my-4 flex justify-between items-center cursor-pointer hover:underline text-left h3 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {/* Chevron Down SVG */}
      <svg
        className={`w-4 transition-transform duration-300 ml-4 ${
          openItem === itemIndex ? 'rotate-180' : ''
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
    </button>
  );
};

const AccordionContent: FC<AccordionContentProps> = ({
  className = '',
  children,
  ...props
}) => {
  const { openItem } = useAccordionContext();
  const itemIndex = useAccordionItemContext();
  const isOpen = openItem === itemIndex;

  return (
    <div
      className={`grid transition-all duration-300 ${
        isOpen ? 'mb-4 grid-rows-[1fr]' : 'grid-rows-[0fr]'
      } ${className}`}
      {...props}
    >
      <div className="p overflow-hidden">{children}</div>
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
