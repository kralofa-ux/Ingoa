import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { getCultureColor, cultureEmoji } from "@/lib/cultureColors";

const FilterBar = () => {
  const { cultureFilter, setCultureFilter, genderFilter, setGenderFilter } = useApp();
  const [showCultures, setShowCultures] = useState(false);

  const cultures: { value: Culture; label: string }[] = [
    { value: "Cook Islands", label: "Cook Islands" },
    { value: "Samoa", label: "Samoa" },
    { value: "NZ Māori", label: "NZ Māori" },
    { value: "Tonga", label: "Tonga" },
    { value: "Fiji", label: "Fiji" },
    { value: "Hawaii", label: "Hawai'i" },
    { value: "Niue", label: "Niue" },
    { value: "Tahiti", label: "Tahiti" },
  ];

  const genders: { value: Gender | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-body font-semibold text-foreground border border-border"
        >
          {cultureLabel}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCultures ? "rotate-180" : ""}`} />
        </button>
        {showCultures && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCultures(false)} />
            <div className="absolute top-full mt-2 left-0 z-50 glass border border-border rounded-2xl shadow-card-hover py-2 min-w-[220px]">
              <button
                onClick={() => setCultureFilter([])}
                className={`w-full text-left px-4 py-3 text-sm font-body transition-colors flex items-center justify-between ${
                  cultureFilter.length === 0 ? "text-primary font-bold" : "text-foreground hover:bg-secondary"
                }`}
              >
                All Cultures
                {cultureFilter.length === 0 && <Check className="w-4 h-4" />}
              </button>
              {cultures.map((c) => {
                const selected = cultureFilter.includes(c.value);
                const color = getCultureColor(c.value);
                return (
                  <button
                    key={c.value}
                    onClick={() => toggleCulture(c.value)}
                    className={`w-full text-left px-4 py-3 text-sm font-body transition-colors flex items-center justify-between ${
                      selected ? "text-primary font-bold" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                      {cultureEmoji[c.value]} {c.label}
                    </span>
                    {selected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Gender pills */}
      <div className="flex gap-1 glass rounded-full p-1 border border-border">
        {genders.map((g) => (
          <button
            key={g.value}
            onClick={() => setGenderFilter(g.value)}
            className={`px-4 py-2 rounded-full text-sm font-body font-semibold transition-all ${
              genderFilter === g.value
                ? "bg-primary text-primary-foreground shadow-glow-primary"
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
