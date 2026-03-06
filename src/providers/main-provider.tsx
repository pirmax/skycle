"use client";

import { IconLoader } from "@tabler/icons-react";
import type { Layer } from "konva/lib/Layer";
import type { Stage } from "konva/lib/Stage";
import {
  type Context,
  createContext,
  type MutableRefObject,
  type ReactNode,
  useRef,
  useState,
} from "react";

type ContextProps = {
  toolbarRef: MutableRefObject<HTMLDivElement | null>;
  layersRef: MutableRefObject<Layer[]>;
  stagesRef: MutableRefObject<Stage[]>;
  addToLayerRefs: (element: Layer | null, index: number) => void;
  addToStageRefs: (element: Stage | null, index: number) => void;
  setIsLoading: (value: boolean) => void;
};

type ProviderProps = {
  children: ReactNode;
};

export const MainProviderContext: Context<ContextProps> = createContext<{
  toolbarRef: MutableRefObject<HTMLDivElement | null>;
  layersRef: MutableRefObject<Layer[]>;
  stagesRef: MutableRefObject<Stage[]>;
  addToLayerRefs: (element: Layer | null, index: number) => void;
  addToStageRefs: (element: Stage | null, index: number) => void;
  setIsLoading: (value: boolean) => void;
}>({
  toolbarRef: { current: null },
  layersRef: { current: [] },
  stagesRef: { current: [] },
  addToLayerRefs: () => {},
  addToStageRefs: () => {},
  setIsLoading: () => {},
});

export const MainProvider = ({ children }: ProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toolbarRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const layersRef: MutableRefObject<Layer[]> = useRef<Layer[]>([]);
  const stagesRef: MutableRefObject<Stage[]> = useRef<Stage[]>([]);

  const addToLayerRefs = (element: Layer | null, index: number): void => {
    if (element && !layersRef.current.includes(element)) {
      layersRef.current[index] = element;
    }
  };

  const addToStageRefs = (element: Stage | null, index: number): void => {
    if (element && !stagesRef.current.includes(element)) {
      stagesRef.current[index] = element;
    }
  };

  return (
    <MainProviderContext.Provider
      value={{
        toolbarRef,
        layersRef,
        stagesRef,
        addToLayerRefs,
        addToStageRefs,
        setIsLoading,
      }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white bg-opacity-90">
          <div className="animate-spin">
            <IconLoader className="size-16 animate-spin" />
          </div>
        </div>
      )}
      {children}
    </MainProviderContext.Provider>
  );
};
