import { cva } from "class-variance-authority";
import { FC } from "react";

export const Label: FC<Props> = ({ children, className, ...props }) => {
  return (
    <label className={label({ className })} {...props}>
      {children}
    </label>
  );
};

const label = cva("");

type Props = React.HtmlHTMLAttributes<HTMLLabelElement> & {};

export type { Props as LabelProps };
