import { useApp } from "@/context/AppContext";
import { Culture, Gender } from "@/data/names";

const FilterBar = () => {
  const { cultureFilter, setCultureFilter, genderFilter, setGenderFilter } = useApp();

  const cultures: { value: Culture | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Cook Islands", label: "🇨🇰 Cook Islands" },
    { value: "Samoa", label: "🇼🇸 Samoa" },
  ];

  const genders: { value: Gender | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "male", label: "Tāne" },
    { value: "female", label: "Wahine" },
    { value: "unisex", label: "Unisex" },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4">
      <div className="flex gap-1 bg-secondary rounded-full p-1">
        {cultures.map((c) => (
          <button
            key={c.value}
            onClick={() => setCultureFilter(c.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all ${
              cultureFilter === c.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
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
