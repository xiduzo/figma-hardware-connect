import { cva } from "class-variance-authority";
import { FC } from "react";

export const TextArea: FC<Props> = ({ className, ...props }) => {
  return <textarea className={textArea({ className })} {...props} />;
};

const textArea = cva("");

type Props = React.InputHTMLAttributes<HTMLTextAreaElement> & {};

export type { Props as TextAreaProps };
