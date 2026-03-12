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
  "Aotearoa": tinoFlag,
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
    const renderSize = culture === "Aotearoa" ? size * 1.5 : size;
    return (
      <img
        src={svg}
        alt={`${culture} flag`}
        width={renderSize}
        height={renderSize}
        className={`inline-block object-contain rounded-sm ${className}`}
        style={{ width: renderSize, height: renderSize }}
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
