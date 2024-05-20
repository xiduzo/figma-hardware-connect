import { PropsWithChildren } from "react";

export function ButtonGroup({ children }: PropsWithChildren) {
  return <section className="flex items-center space-x-2">{children}</section>;
}
