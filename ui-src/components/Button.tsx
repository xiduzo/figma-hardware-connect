import { VariantProps, cva } from "class-variance-authority";
import { FC } from "react";

export const Button: FC<Props> = ({
  children,
  className,
  intent,
  ...props
}) => {
  return (
    <button className={button({ className, intent })} {...props}>
      {children}
    </button>
  );
};

const button = cva(
  "w-full px-2 py-1 transition-all duration-200 border border-transparent rounded-md disabled:opacity-50",
  {
    variants: {
      intent: {
        success: "text-white bg-green-500",
        info: "text-white bg-blue-500",
        warning: "text-white bg-yellow-500",
        danger: "text-white bg-red-500",
        plain: "text-white border-white active:bg-zinc-50 active:bg-opacity-5",
      },
    },
    defaultVariants: {
      intent: "plain",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {};

export type { Props as ButtonProps };

<p className="hover:bg-zinc-50 hover:bg-opacity-75"></p>;
