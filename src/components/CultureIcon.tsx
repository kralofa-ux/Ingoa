import tinoFlag from "@/assets/tino.svg";
import hawaiiFlag from "@/assets/hawaii_flag.svg";

const emojiMap: Record<string, string> = {
  "Cook Islands": "🇨🇰",
  "Samoa": "🇼🇸",
  "Tonga": "🇹🇴",
  "Fiji": "🇫🇯",
  "Niue": "🇳🇺",
  "Tahiti": "🇵🇫",
};

const svgMap: Record<string, string> = {
  "NZ Māori": tinoFlag,
  "Hawaii": hawaiiFlag,
};

interface CultureIconProps {
  culture: string;
  size?: number;
  className?: string;
}

const CultureIcon = ({ culture, size = 20, className = "" }: CultureIconProps) => {
  const svg = svgMap[culture];
  if (svg) {
    return (
      <img
        src={svg}
        alt={`${culture} flag`}
        width={size}
        height={size}
        className={`inline-block object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const emoji = emojiMap[culture];
  if (emoji) {
    return <span className={className} style={{ fontSize: size * 0.9 }}>{emoji}</span>;
  }
  return <span className={className} style={{ fontSize: size * 0.9 }}>🌊</span>;
};

export default CultureIcon;
