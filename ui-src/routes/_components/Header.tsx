import { PropsWithChildren } from "react";
import { Title } from "../../components";
import { IconBackButton } from "./IconBackButton";

export function Header({ title, children }: Props) {
  return (
    <header className="flex items-center justify-between mb-3">
      <section className="flex items-center space-x-1.5">
        <IconBackButton />
        <Title>{title}</Title>
      </section>
      {children}
    </header>
  );
}

type Props = PropsWithChildren & {
  title: string;
};
