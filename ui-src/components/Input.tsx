import { VariantProps, cva } from "class-variance-authority";
import { FC } from "react";

export const Input: FC<Props> = ({ className, ...props }) => {
  return <input className={input({ className })} {...props} />;
};

const input = cva(
  "py-1.5 px-1 bg-stone-100 dark:bg-stone-800 transition duration-150 placeholder:opacity-50 placeholder:font-light text-zinc-800 dark:text-zinc-100 border ring-0 focuse:outline",
  {
    variants: {
      hasError: {
        true: "border-red-700 outline-red-300",
        false:
          "border-stone-800 border-b-stone-700 hover:border-stone-700 focus:outline-blue-400",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  },
);

type Props = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof input> & {};

export type { Props as InputProps };

<input className="font-extralight border-b-stone-400 transition duration-200" />;
