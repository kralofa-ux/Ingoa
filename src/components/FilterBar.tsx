import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";

const FilterBar = () => {
  const { cultureFilter, setCultureFilter, genderFilter, setGenderFilter } = useApp();

  const cultures: { value: Culture; label: string }[] = [
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

  const toggleCulture = (culture: Culture) => {
    if (cultureFilter.includes(culture)) {
      setCultureFilter(cultureFilter.filter((c) => c !== culture));
    } else {
      setCultureFilter([...cultureFilter, culture]);
    }
  };

  const allSelected = cultureFilter.length === 0;

  return (
    <div className="space-y-3 px-4">
      {/* Culture multi-select chips */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        <button
          onClick={() => setCultureFilter([])}
          className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all border ${
            allSelected
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-secondary text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          All
        </button>
        {cultures.map((c) => {
          const isSelected = cultureFilter.includes(c.value);
          return (
            <button
              key={c.value}
              onClick={() => toggleCulture(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Gender pills */}
      <div className="flex gap-1 bg-secondary rounded-full p-1 justify-center">
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
