import { cva } from "class-variance-authority";
import React, { FC } from "react";

export const Select: FC<Props> = ({ children, className, ...props }) => {
  return (
    <select className={select({ className })} {...props}>
      {children}
    </select>
  );
};

const select = cva(
  "py-1.5 px-1 bg-stone-100 dark:bg-stone-800 text-zinc-800 dark:text-zinc-100 border border-stone-800 hover:border-stone-700 focus:outline-blue-400",
);

type Props = React.InputHTMLAttributes<HTMLSelectElement> & {};

export type { Props as SelectProps };
