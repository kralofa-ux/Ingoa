import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const FilterBar = () => {
  const { cultureFilter, setCultureFilter, genderFilter, setGenderFilter } = useApp();
  const [showCultures, setShowCultures] = useState(false);

  const cultures: { value: Culture; label: string; emoji: string }[] = [
    { value: "NZ Māori", label: "NZ Māori", emoji: "🇳🇿" },
    { value: "Cook Islands", label: "Cook Islands", emoji: "🇨🇰" },
    { value: "Samoa", label: "Samoa", emoji: "🇼🇸" },
    { value: "Tonga", label: "Tonga", emoji: "🇹🇴" },
    { value: "Fiji", label: "Fiji", emoji: "🇫🇯" },
    { value: "Hawaii", label: "Hawai'i", emoji: "🇺🇸" },
    { value: "Niue", label: "Niue", emoji: "🇳🇺" },
    { value: "Tahiti", label: "Tahiti", emoji: "🇵🇫" },
  ];

  const genders: { value: Gender | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "male", label: "Tāne" },
    { value: "female", label: "Wahine" },
  ];

  const toggleCulture = (culture: Culture) => {
    if (cultureFilter.includes(culture)) {
      setCultureFilter(cultureFilter.filter((c) => c !== culture));
    } else {
      setCultureFilter([...cultureFilter, culture]);
    }
  };

  const cultureLabel =
    cultureFilter.length === 0
      ? "All Cultures"
      : cultureFilter.length === 1
        ? cultures.find((c) => c.value === cultureFilter[0])?.label || cultureFilter[0]
        : `${cultureFilter.length} cultures`;

  return (
    <div className="flex gap-2 justify-center px-4">
      {/* Culture dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowCultures(!showCultures)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-sm font-body font-medium text-foreground border border-border"
        >
          {cultureLabel}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCultures ? "rotate-180" : ""}`} />
        </button>
        {showCultures && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCultures(false)} />
            <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-card-hover py-1 min-w-[200px]">
              <button
                onClick={() => setCultureFilter([])}
                className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors flex items-center justify-between ${
                  cultureFilter.length === 0 ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                }`}
              >
                All Cultures
                {cultureFilter.length === 0 && <Check className="w-4 h-4" />}
              </button>
              {cultures.map((c) => {
                const selected = cultureFilter.includes(c.value);
                return (
                  <button
                    key={c.value}
                    onClick={() => toggleCulture(c.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors flex items-center justify-between ${
                      selected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{c.emoji} {c.label}</span>
                    {selected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Gender pills */}
      <div className="flex gap-1 bg-secondary rounded-full p-1">
        {genders.map((g) => (
          <button
            key={g.value}
            onClick={() => setGenderFilter(g.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all ${
              genderFilter === g.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
