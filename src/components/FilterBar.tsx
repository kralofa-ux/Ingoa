import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FilterBar = () => {
  const { cultureFilter, setCultureFilter, genderFilter, setGenderFilter } = useApp();
  const [showCultures, setShowCultures] = useState(false);

  const cultures: { value: Culture | "all"; label: string }[] = [
    { value: "all", label: "All Cultures" },
    { value: "NZ Māori", label: "🇳🇿 NZ Māori" },
    { value: "Cook Islands", label: "🇨🇰 Cook Islands" },
    { value: "Samoa", label: "🇼🇸 Samoa" },
    { value: "Tonga", label: "🇹🇴 Tonga" },
    { value: "Fiji", label: "🇫🇯 Fiji" },
    { value: "Hawaii", label: "🇺🇸 Hawai'i" },
    { value: "Niue", label: "🇳🇺 Niue" },
    { value: "Tahiti", label: "🇵🇫 Tahiti" },
  ];

  const genders: { value: Gender | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "male", label: "Tāne" },
    { value: "female", label: "Wahine" },
    { value: "unisex", label: "Unisex" },
  ];

  const selectedCulture = cultures.find((c) => c.value === cultureFilter);

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4">
      {/* Culture dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowCultures(!showCultures)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-sm font-body font-medium text-foreground border border-border"
        >
          {selectedCulture?.label || "All Cultures"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCultures ? "rotate-180" : ""}`} />
        </button>
        {showCultures && (
          <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-card-hover py-1 min-w-[180px]">
            {cultures.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setCultureFilter(c.value);
                  setShowCultures(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-body transition-colors ${
                  cultureFilter === c.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
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
