export const CANVAS_SIZE: number = 1000;
export const CANVAS_PADDING: number = 50;
export const CENTER_RADIUS: number = 100;
export const CIRCLE_SPACING: number = 10;
export const AVAILABLE_SPACE: number = CANVAS_SIZE / 2 - CENTER_RADIUS;
export const PREVIEW_EXAMPLE_USERNAME: string = `pfrazee.com`;
export const EXPORT_FILE_NAME: string = `skycle.png`;
export const WATERMARK: string = `↳ Skycle.app`;
export const MIN_PEOPLE_PER_CIRCLE: number = 1;
export const MAX_PEOPLE_PER_CIRCLE: number = 50;
export const MIN_CIRCLE: number = 1;
export const MAX_CIRCLE: number = 9;
export const MAX_SKEETS_ITERATIONS: number = 80;
export const VERIFIED_IMAGE_URL: string = `${process.env.NEXT_PUBLIC_URL}/verified.png`;
export const DEFAULT_AVATAR: string = `${process.env.NEXT_PUBLIC_URL}/placeholder.png`;
export const DEFAULT_POST_MESSAGE: string = `These are the people I interact the most with on Bluesky 💛 #Skycle`;
export const HANDLE_REGEX: RegExp =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

export const PLACEHOLDER = (): string => {
  const date = new Date();

  if (date.getMonth() === 9 && date.getDate() >= 25 && date.getDate() <= 31) {
    return "Halloween";
  }

  if (date.getMonth() === 11 && date.getDate() >= 1 && date.getDate() <= 25) {
    return "Christmas";
  }

  if (date.getMonth() === 11 && date.getDate() >= 26 && date.getDate() <= 31) {
    return "New Year";
  }

  if (date.getMonth() === 1 && date.getDate() === 14) {
    return "Valentine's Day";
  }

  if (date.getMonth() === 2 && date.getDate() === 17) {
    return "St. Patrick's Day";
  }

  if (date.getMonth() === 6 && date.getDate() === 4) {
    return "Independence Day";
  }

  if (date.getMonth() === 10 && date.getDate() === 31) {
    return "Thanksgiving";
  }

  if (date.getMonth() >= 5 && date.getMonth() <= 8) {
    return "Summer";
  }

  return "Sky";
};

export const SCORES: {
  base: number;
  perReplies: number;
  perMentions: number;
  perQuotes: number;
  perShares: number;
} = {
  base: 1,
  perReplies: 6,
  perMentions: 5,
  perQuotes: 4,
  perShares: 2,
};
