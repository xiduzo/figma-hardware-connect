import { cva } from "class-variance-authority";

export function TextArea({ className, ...props }: Props) {
  return <textarea className={textArea({ className })} {...props} />;
}

const textArea = cva("");

type Props = React.InputHTMLAttributes<HTMLTextAreaElement> & {};

export type { Props as TextAreaProps };
