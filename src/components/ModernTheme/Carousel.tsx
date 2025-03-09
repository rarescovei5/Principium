import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Button } from './Button';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────

interface NavButtonProps {
  orientation: 'horizontal' | 'vertical';
  onClick: () => void;
  direction: 'prev' | 'next';
  isEnabled: boolean;
}
interface CarouselProps extends React.HTMLAttributes<any> {
  orientation?: 'horizontal' | 'vertical';
  autoPlay?: number;
}

// ────────────────────────────────────────────────────────────────
// CAROUSEL CONTEXT
// ────────────────────────────────────────────────────────────────

interface CarouselContextType {
  orientation: 'horizontal' | 'vertical';
  index: number;
  setMaxIndex: React.Dispatch<SetStateAction<number>>;
}

const CarouselContext = createContext<CarouselContextType | null>(null);

// Custom hook to consume CarouselContext safely
const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel components must be used within a Carousel');
  }
  return context;
};

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────

const Carousel: React.FC<CarouselProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
  autoPlay = 0,
  ...props
}) => {
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  // Scroll function for navigation (memoized to prevent re-creation)
  const scroll = useCallback(
    (direction: number) => {
      setIndex((prev) => {
        // Prevent scrolling if at boundary
        if (
          (direction === -1 && !(prev > 0)) ||
          (direction === 1 && !(prev < maxIndex))
        ) {
          return prev;
        }
        return prev + direction;
      });
    },
    [maxIndex]
  );

  // Auto-play effect if enabled
  useEffect(() => {
    if (!autoPlay) return;
    const handleAutoPlay = () => {
      if (index === maxIndex) {
        scroll(-maxIndex);
      } else {
        scroll(1);
      }
    };
    const interval = setInterval(handleAutoPlay, autoPlay);
    return () => clearInterval(interval);
  }, [autoPlay, index, maxIndex, scroll]);

  return (
    <CarouselContext.Provider value={{ orientation, index, setMaxIndex }}>
      <div className={'relative flex ' + className} {...props}>
        <NavButton
          orientation={orientation}
          onClick={() => scroll(-1)}
          direction="prev"
          isEnabled={index > 0}
        />
        {children}
        <NavButton
          orientation={orientation}
          onClick={() => scroll(1)}
          direction="next"
          isEnabled={index < maxIndex}
        />
      </div>
    </CarouselContext.Provider>
  );
};

const NavButton: React.FC<NavButtonProps> = ({
  orientation,
  onClick,
  direction,
  isEnabled,
}) => {
  const isHorizontal = orientation === 'horizontal';
  const position =
    direction === 'prev'
      ? isHorizontal
        ? 'right-[calc(100%+1rem)] top-1/2 -translate-y-1/2'
        : 'bottom-[calc(100%+1rem)] left-1/2 -translate-x-1/2'
      : isHorizontal
      ? 'left-[calc(100%+1rem)] top-1/2 -translate-y-1/2'
      : 'top-[calc(100%+1rem)] left-1/2 -translate-x-1/2';
  const rotation =
    direction === 'prev'
      ? isHorizontal
        ? 'rotate-90'
        : 'rotate-180'
      : isHorizontal
      ? '-rotate-90'
      : '';

  return (
    <Button
      variant="outline"
      className={`absolute ${position}`}
      onClick={onClick}
      icon
      disabled={!isEnabled} // Invert isEnabled to set the Button's disabled prop
    >
      <svg
        className={`w-3 ${rotation}`}
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.75 3.9L0.1 0.5a.4.4 0 0 1 0-.6.4.4 0 0 1 .6 0L4 3.3l3.4-3.4a.4.4 0 0 1 .6 0 .4.4 0 0 1 0 .6L4.25 3.9a.4.4 0 0 1-.5 0z"
          fill="white"
        />
      </svg>
    </Button>
  );
};

const CarouselContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useCarouselContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Update maxIndex when children or orientation change
  useEffect(() => {
    if (containerRef.current && carouselRef.current) {
      const itemsCount = containerRef.current.children.length;
      const carouselSize =
        context.orientation === 'horizontal'
          ? carouselRef.current.offsetWidth
          : carouselRef.current.offsetHeight;
      const itemSize =
        context.orientation === 'horizontal'
          ? containerRef.current.children[0]?.getBoundingClientRect().width || 1
          : containerRef.current.children[0]?.getBoundingClientRect().height ||
            1;
      const visibleItems = Math.round(carouselSize / itemSize);
      const maxIndex = Math.max(itemsCount - visibleItems, 0);
      context.setMaxIndex(maxIndex);
    }
  }, [children, context.orientation, context.setMaxIndex]);

  return (
    <div ref={carouselRef} className="overflow-hidden flex-1">
      <div
        ref={containerRef}
        className={
          'flex ' +
          (context.orientation === 'horizontal'
            ? 'flex-row -mx-2'
            : 'flex-col -my-2') +
          ' ' +
          className
        }
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

const CarouselItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = 'basis-full',
  ...props
}) => {
  const context = useCarouselContext();
  const transform =
    context.orientation === 'horizontal'
      ? `translateX(-${context.index * 100}%)`
      : `translateY(-${context.index * 100}%)`;

  return (
    <div
      className={
        'min-w-0 min-h-0 transition-transform duration-300 ease-in-out shrink-0 grow-0 ' +
        (context.orientation === 'horizontal' ? 'px-2' : 'py-2') +
        ' ' +
        className
      }
      style={{ transform }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Carousel, CarouselContent, CarouselItem };
