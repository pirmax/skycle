import { atom, type Getter, type Setter } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
  CircleDefinition,
  ProfileDefinition,
  VersionDefinition,
} from "@/types";

export const modalAtom = atom<string | null>(null);
export const loadingAtom = atom<boolean>(false);
export const watermarkAtom = atom<boolean>(true);
export const verifiedAtom = atom<boolean>(true);

export const selectedVersionAtom = atom<VersionDefinition | null>(null);
export const selectedVersionIdAtom = atom<number>(0);

export const handleAtom = atom<string | null>(null);
export const friendsAtom = atom<ProfileDefinition[][]>([]);

export const hiddenFriendsAtom = atomWithStorage<string[]>(
  "skycleHiddenIDs",
  [],
);

export const circlesDefinitionAtom = atom<CircleDefinition[]>([
  {
    numberOfItems: 10,
  },
  {
    numberOfItems: 20,
  },
  {
    numberOfItems: 30,
  },
]);

export const backgroundAtom = atom<{
  source: string;
  width: number;
  height: number;
}>({
  source: "",
  width: 0,
  height: 0,
});

export const coloursAtom = atom<{
  background: string;
  circleBorders: string;
  connectingLines: string;
}>({
  background: "#facc14",
  circleBorders: "#282c34",
  connectingLines: "#282c34",
});

export const hideFriendAtom = atom(
  null,
  (get: Getter, set: Setter, did: string): void => {
    set(hiddenFriendsAtom, [...get(hiddenFriendsAtom), did]);
  },
);

export const unHideFriendsAtom = atom(null, (_: Getter, set: Setter): void => {
  set(hiddenFriendsAtom, []);
});

export const addCircleAtom = atom(null, (get: Getter, set: Setter): void => {
  set(circlesDefinitionAtom, [
    ...get(circlesDefinitionAtom),
    {
      numberOfItems: 20,
    },
  ]);
});

export const removeCircleAtom = atom(null, (get: Getter, set: Setter): void => {
  set(circlesDefinitionAtom, get(circlesDefinitionAtom).slice(0, -1));
});

export const setColourAtom = atom(
  null,
  (get: Getter, set: Setter, key: string, value: string): void => {
    set(coloursAtom, {
      ...get(coloursAtom),
      [key]: value,
    });
  },
);

export const setRandomColoursAtom = atom(
  null,
  (_: Getter, set: Setter): void => {
    const background = `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`;
    const circleBorders = `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`;
    const connectingLines = `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`;

    set(coloursAtom, {
      background,
      circleBorders,
      connectingLines,
    });
  },
);

export const setNumberOfItemsAtom = atom(
  null,
  (get: Getter, set: Setter, index: number, numberOfItems: number): void => {
    set(circlesDefinitionAtom, [
      ...get(circlesDefinitionAtom).slice(0, index),
      {
        numberOfItems,
      },
      ...get(circlesDefinitionAtom).slice(index + 1),
    ]);
  },
);
