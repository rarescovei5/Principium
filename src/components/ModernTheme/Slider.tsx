import React, { useRef } from 'react';
import { SetStateAction } from 'react';

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  setValue: React.Dispatch<SetStateAction<number>>;
  max: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({
  className,
  value,
  setValue,
  max,
  step = 1,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let newValue = ((e.clientX - rect.left) / rect.width) * max;
    // Round based on step size
    newValue = Math.round(newValue / step) * step;
    // Clamp the value between 0 and max
    newValue = Math.max(0, Math.min(newValue, max));
    setValue(newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection and other default behavior
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={sliderRef} className={`bg-surface rounded-lg h-2.5 ${className}`}>
      <div
        style={{ width: `${(Math.max(0, Math.min(value, max)) / max) * 100}%` }}
        className="bg-text relative h-full rounded-lg transition-transform duration-300"
      >
        <span
          onMouseDown={handleMouseDown}
          className="w-5 aspect-square rounded-lg absolute bg-bg border border-white top-[50%] -translate-y-[50%] right-0"
        ></span>
      </div>
    </div>
  );
};

export { Slider };
