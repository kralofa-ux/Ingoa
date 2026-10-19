export const genderColorMap: Record<string, { bg: string; dot: string }> = {
  male: { bg: "bg-[hsl(var(--gender-male-surface))]", dot: "bg-[hsl(var(--gender-male-surface))]" },
  female: { bg: "bg-[hsl(var(--gender-female-surface))]", dot: "bg-[hsl(var(--gender-female-surface))]" },
  unisex: { bg: "bg-[hsl(var(--gender-unisex-surface))]", dot: "bg-[hsl(var(--gender-unisex-surface))]" },
};

export const getGenderColor = (gender: string) =>
  genderColorMap[gender] || genderColorMap.unisex;

export const genderLabel: Record<string, string> = {
  male: "Male",
  female: "Female",
  unisex: "Unisex",
};
