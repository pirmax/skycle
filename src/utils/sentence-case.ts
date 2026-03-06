export const sentenceCase = (string: string): string => {
  const withSpaces: string = string.replace(
    /([A-Z])/g,
    (c: string): string => ` ${c.toLowerCase()}`,
  );

  const withCapital: string =
    withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);

  return withCapital.trim();
};
