export type ProfileDefinition = {
  did: string;
  avatar: string;
  displayName: string;
  handle: string;
  url: string;
  score: number;
  verified: boolean;
  interactions?: {
    replies: number;
    mentions: number;
    quotes: number;
    shares: number;
  };
};

export type OwnerProfileDefinition = ProfileDefinition;
export type GroupOfProfilesDefinition = ProfileDefinition[];
export type GroupOfCirclesDefinition = GroupOfProfilesDefinition[];

export type LayoutDefinition = {
  radius: number;
  itemRadius: number;
  itemPositions: number[];
};

export type GroupOfLayoutsDefinition = LayoutDefinition[];

export type VersionDefinition = {
  own: OwnerProfileDefinition;
  friends: GroupOfProfilesDefinition;
};

export type CircleDefinition = {
  numberOfItems: number;
};

export type UnsplashResult = {
  id: string;
  urls: {
    thumb: string;
    full: string;
  };
  width: number;
  height: number;
  alt_description: string;
  color: string;
};
