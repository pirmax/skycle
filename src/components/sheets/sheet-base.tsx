import type { JSX, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type SheetBaseProps = {
  modal: string | null;
  setModal: (value: string | null) => void;
  name: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function SheetBase({
  modal,
  setModal,
  name,
  title,
  description,
  children,
}: SheetBaseProps): JSX.Element {
  return (
    <Sheet
      open={modal === name}
      defaultOpen={false}
      onOpenChange={(): void => setModal(null)}
    >
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
          <div className="py-10">{children}</div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
