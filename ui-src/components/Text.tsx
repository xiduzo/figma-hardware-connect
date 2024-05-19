import { VariantProps, cva } from "class-variance-authority";
import { FC } from "react";

export const Text: FC<Props> = ({
  children,
  className,
  dimmed,
  isError,
  ...props
}) => {
  return (
    <p className={text({ className, dimmed, isError })} {...props}>
      {children}
    </p>
  );
};

const text = cva("", {
  variants: {
    dimmed: {
      true: "opacity-60",
    },
    isError: {
      true: "text-red-500",
      false: "text-zinc-900 dark:text-zinc-100",
    },
  },
  defaultVariants: {
    isError: false,
  },
});

type Props = React.HtmlHTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof text> & {};

export type { Props as TextProps };
