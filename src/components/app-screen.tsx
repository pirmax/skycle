import clsx from "clsx";
import Image from "next/image";
import { forwardRef } from "react";

type AppScreenProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppScreen({ children, className, ...props }: AppScreenProps) {
  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <div className="px-4 pt-4">
        <Image
          src="/logo.png"
          alt="Skycle"
          className="mx-auto size-20"
          width="480"
          height="480"
        />
      </div>
      {children}
    </div>
  );
}

type AppScreenHeaderProps = {
  children: React.ReactNode;
};

AppScreen.Header = forwardRef(function AppScreenHeader(
  { children }: AppScreenHeaderProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className="mt-6 px-4 text-white">
      {children}
    </div>
  );
});

type AppScreenTitleProps = {
  children: React.ReactNode;
};

AppScreen.Title = forwardRef(function AppScreenTitle(
  { children }: AppScreenTitleProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className="text-2xl text-white">
      {children}
    </div>
  );
});

type AppScreenSubtitleProps = {
  children: React.ReactNode;
};

AppScreen.Subtitle = forwardRef(function AppScreenSubtitle(
  { children }: AppScreenSubtitleProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className="text-black text-sm">
      {children}
    </div>
  );
});

type AppScreenBodyProps = {
  children: React.ReactNode;
  className?: string;
};

AppScreen.Body = forwardRef(function AppScreenBody(
  { children, className }: AppScreenBodyProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={clsx("mt-6 flex-auto", className)}>
      {children}
    </div>
  );
});
