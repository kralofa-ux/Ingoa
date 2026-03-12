export type CultureColorKey =
  | "NZ Māori"
  | "Cook Islands"
  | "Samoa"
  | "Tonga"
  | "Fiji"
  | "Hawaii"
  | "Niue"
  | "Tahiti";

export interface CultureColor {
  bg: string;
  text: string;
  border: string;
  dot: string;
  hsl: string;
}

export const cultureColors: Record<CultureColorKey, CultureColor> = {
  "NZ Māori": {
    bg: "bg-[hsl(var(--culture-maori))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-maori))]",
    dot: "bg-[hsl(var(--culture-maori))]",
    hsl: "var(--culture-maori)",
  },
  "Cook Islands": {
    bg: "bg-[hsl(var(--culture-cook))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-cook))]",
    dot: "bg-[hsl(var(--culture-cook))]",
    hsl: "var(--culture-cook)",
  },
  "Samoa": {
    bg: "bg-[hsl(var(--culture-samoa))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-samoa))]",
    dot: "bg-[hsl(var(--culture-samoa))]",
    hsl: "var(--culture-samoa)",
  },
  "Tonga": {
    bg: "bg-[hsl(var(--culture-tonga))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-tonga))]",
    dot: "bg-[hsl(var(--culture-tonga))]",
    hsl: "var(--culture-tonga)",
  },
  "Fiji": {
    bg: "bg-[hsl(var(--culture-fiji))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-fiji))]",
    dot: "bg-[hsl(var(--culture-fiji))]",
    hsl: "var(--culture-fiji)",
  },
  "Hawaii": {
    bg: "bg-[hsl(var(--culture-hawaii))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-hawaii))]",
    dot: "bg-[hsl(var(--culture-hawaii))]",
    hsl: "var(--culture-hawaii)",
  },
  "Niue": {
    bg: "bg-[hsl(var(--culture-niue))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-niue))]",
    dot: "bg-[hsl(var(--culture-niue))]",
    hsl: "var(--culture-niue)",
  },
  "Tahiti": {
    bg: "bg-[hsl(var(--culture-tahiti))]",
    text: "text-white",
    border: "border-[hsl(var(--culture-tahiti))]",
    dot: "bg-[hsl(var(--culture-tahiti))]",
    hsl: "var(--culture-tahiti)",
  },
};

export const getCultureColor = (culture: string): CultureColor => {
  return cultureColors[culture as CultureColorKey] || cultureColors["NZ Māori"];
};

export const cultureEmoji: Record<string, string> = {
  "NZ Māori": "🔴⚫⚪",
  "Cook Islands": "🇨🇰",
  "Samoa": "🇼🇸",
  "Tonga": "🇹🇴",
  "Fiji": "🇫🇯",
  "Hawaii": "🌺",
  "Niue": "🇳🇺",
  "Tahiti": "🇵🇫",
};
