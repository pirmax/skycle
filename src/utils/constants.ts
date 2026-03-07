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

/**
 * Calcule un score d'interaction sophistiqué basé sur:
 * - Pondération logarithmique pour éviter la domination d'un seul type
 * - Bonus de diversité pour les relations équilibrées
 * - Bonus pour les interactions de haute qualité (replies et mentions)
 * - Pénalité pour les relations unidimensionnelles
 */
export const calculateInteractionScore = (interactions: {
  replies: number;
  mentions: number;
  quotes: number;
  shares: number;
}): number => {
  const { replies, mentions, quotes, shares } = interactions;

  // Pondération logarithmique pour éviter que les grandes quantités dominent
  // log10(1+n) permet une croissance qui ralentit avec le volume
  const repliesScore = replies > 0 ? Math.log10(1 + replies) * 10 : 0;
  const mentionsScore = mentions > 0 ? Math.log10(1 + mentions) * 8 : 0;
  const quotesScore = quotes > 0 ? Math.log10(1 + quotes) * 6 : 0;
  const sharesScore = shares > 0 ? Math.log10(1 + shares) * 3 : 0;

  // Score de base logarithmique
  const baseScore = repliesScore + mentionsScore + quotesScore + sharesScore;

  // Bonus de diversité: récompense les relations avec plusieurs types d'interactions
  const typesCount = [replies, mentions, quotes, shares].filter(
    (n) => n > 0,
  ).length;
  const diversityMultiplier = 1 + (typesCount - 1) * 0.3; // 1.0 → 1.3 → 1.6 → 1.9

  // Bonus pour les interactions de haute qualité (conversations réelles)
  // Les replies et mentions montrent un engagement actif
  const highQualityCount = replies + mentions;
  const qualityBonus =
    highQualityCount > 0 ? Math.sqrt(highQualityCount) * 2 : 0;

  // Bonus d'intensité: récompense les relations très actives
  const totalInteractions = replies + mentions + quotes + shares;
  const intensityBonus =
    totalInteractions > 10 ? Math.log10(totalInteractions) * 3 : 0;

  // Calcul final avec tous les composants
  const finalScore =
    (baseScore + qualityBonus + intensityBonus) * diversityMultiplier;

  return Math.round(finalScore * 100) / 100; // Arrondi à 2 décimales
};
