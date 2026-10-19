export const genderColorMap: Record<string, { bg: string; dot: string }> = {
  male: { bg: "bg-[hsl(var(--ingoa-tone-1))]", dot: "bg-[hsl(var(--ingoa-tone-1))]" },
  female: { bg: "bg-[hsl(var(--ingoa-tone-2))]", dot: "bg-[hsl(var(--ingoa-tone-2))]" },
  unisex: { bg: "bg-[hsl(var(--ingoa-tone-3))]", dot: "bg-[hsl(var(--ingoa-tone-3))]" },
};

export const getGenderColor = (gender: string) =>
  genderColorMap[gender] || genderColorMap.unisex;

export const genderLabel: Record<string, string> = {
  male: "Male",
  female: "Female",
  unisex: "Unisex",
};
