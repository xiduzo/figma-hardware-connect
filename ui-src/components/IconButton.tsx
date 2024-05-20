import * as Icons from "@heroicons/react/24/outline";
import { cva } from "class-variance-authority";
import { FC } from "react";

export const IconButton: FC<Props> = ({ icon, className, ...buttonProps }) => {
  const Component = Icons[icon];

  return (
    <button
      {...buttonProps}
      className="flex items-center justify-center p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      <Component className={iconButton({ className })} />
    </button>
  );
};

const iconButton = cva("w-5 h-5 text-zinc-800 dark:text-zinc-100");

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: keyof typeof Icons;
};

export type { Props as IconButtonProps };
