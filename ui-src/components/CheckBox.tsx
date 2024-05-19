import { cva } from "class-variance-authority";
import { FC } from "react";

export const CheckBox: FC<Props> = ({ className, ...props }) => {
  return (
    <input className={checkbox({ className })} {...props} type="checkbox" />
  );
};

const checkbox = cva("p-2 rounded-sm");

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {};

export type { Props as CheckBoxProps };
