import type {VariantProps} from '@principium/variants';

import {pv} from '@principium/variants';

/**
 * Card **Tailwind Variants** component
 *
 * @example
 * <div className={cn(cardVariants({isHoverable, isPressable, isBlurred, isDisabled}))}>
 *    <div className={cn(cardVariants.header())}>
 *      <div className={cn(cardVariants.title())}>Title</div>
 *      <div className={cn(cardVariants.description())}>Description</div>
 *    </div>
 *    <div className={cn(cardVariants.body())}>Body</div>
 *    <div className={cn(cardVariants.footer({isFooterBlurred: isBlurred}))}>
 *      Footer
 *    </div>
 * </div>
 */
const cardVariants = pv(
  {
    base: 'shadow-sm shadow-border-300/50 border border-border-300 flex flex-col relative overflow-hidden outline-hidden text-background-950 box-border bg-background-100 focus-within:outline-outline-400 dark:focus-within:outline-outline-600',
    header:
      'flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased',
    title: 'font-semibold leading-none',
    description: 'text-muted-600 text-sm',
    body: 'relative flex w-full p-3 flex-auto flex-col break-words text-left overflow-y-auto subpixel-antialiased',
    footer: 'p-3 flex w-full items-center overflow-hidden color-inherit subpixel-antialiased',
  },
  {
    variants: {
      isHoverable: {
        true: {
          base: 'hover:bg-background-200 dark:hover:bg-background-800',
        },
      },
      isPressable: {
        true: {base: 'cursor-pointer'},
      },
      isBlurred: {
        true: {
          base: 'bg-background-100/80 dark:bg-background-100/20 backdrop-blur-md backdrop-saturate-150',
        },
      },
      isFooterBlurred: {
        true: {
          footer: 'bg-background-100/10 backdrop-blur backdrop-saturate-150',
        },
      },
      disabled: {
        true: {
          base: 'opacity-50 cursor-not-allowed',
        },
      },
    },
    compoundVariants: [
      {
        isPressable: true,
        class: 'active:scale-97',
      },
    ],
    defaultVariants: {
      isHoverable: false,
      isPressable: false,
      disabled: false,
      isFooterBlurred: false,
    },
  },
);

export type CardVariantProps = VariantProps<typeof cardVariants.base>;

export {cardVariants};
