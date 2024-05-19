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

const button = cva("px-4 py-2 rounded-md disabled:opacity-50", {
  variants: {
    intent: {
      success: "text-white bg-green-500",
      info: "text-white bg-blue-500",
      warning: "text-white bg-yellow-500",
      danger: "text-white bg-red-500",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {};

export type { Props as ButtonProps };
