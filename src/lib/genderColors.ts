export const genderColorMap: Record<string, { bg: string; dot: string }> = {
  male: { bg: "bg-[hsl(200,80%,50%)]", dot: "bg-[hsl(200,80%,50%)]" },
  female: { bg: "bg-[hsl(340,70%,55%)]", dot: "bg-[hsl(340,70%,55%)]" },
  unisex: { bg: "bg-[hsl(30,85%,55%)]", dot: "bg-[hsl(30,85%,55%)]" },
};

export const getGenderColor = (gender: string) =>
  genderColorMap[gender] || genderColorMap.unisex;

export const genderLabel: Record<string, string> = {
  male: "Male",
  female: "Female",
  unisex: "Unisex",
};
