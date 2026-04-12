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
  "Hawaii": hawaiiFlag,
  "Aotearoa": tinoFlag,
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
        className={`inline-block object-cover rounded-sm ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
        loading="eager"
        decoding="sync"
      />
    );
  }
  const emoji = emojiMap[culture];
  if (emoji) {
    return <span className={className} style={{ fontSize: size * 0.9, lineHeight: `${size}px`, display: 'inline-block', width: size, height: size, textAlign: 'center' }}>{emoji}</span>;
  }
  return <span className={className} style={{ fontSize: size * 0.9, lineHeight: `${size}px`, display: 'inline-block', width: size, height: size, textAlign: 'center' }}>🌊</span>;
};

export default CultureIcon;
