import { cva } from "class-variance-authority";

export function Title({ children, className, as, ...props }: Props) {
  const Component = as ?? "h1";
  return (
    <Component className={title({ className })} {...props}>
      {children}
    </Component>
  );
}

const title = cva("dark:text-zinc-100 text-zinc-900");

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export type { Props as TitleProps };
