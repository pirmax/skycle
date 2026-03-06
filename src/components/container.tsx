import clsx from "clsx";
import type { JSX } from "react";

type ContainerProps = React.HTMLProps<HTMLDivElement> & {
  className?: string;
};

export function Container({
  className,
  ...props
}: ContainerProps): JSX.Element {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
