export type Culture = "Cook Islands" | "Samoa";
export type Gender = "male" | "female" | "unisex";

export interface PolynesianName {
  id: string;
  name: string;
  meaning: string;
  culture: Culture;
  gender: Gender;
}

export const polynesianNames: PolynesianName[] = [
  // Cook Islands names
  { id: "ci-1", name: "Tangaroa", meaning: "God of the sea", culture: "Cook Islands", gender: "male" },
  { id: "ci-2", name: "Moana", meaning: "Ocean, deep water", culture: "Cook Islands", gender: "unisex" },
  { id: "ci-3", name: "Teina", meaning: "Younger sibling", culture: "Cook Islands", gender: "unisex" },
  { id: "ci-4", name: "Marama", meaning: "Moon, light", culture: "Cook Islands", gender: "female" },
  { id: "ci-5", name: "Teuira", meaning: "Beautiful question", culture: "Cook Islands", gender: "female" },
  { id: "ci-6", name: "Rangi", meaning: "Sky, heavens", culture: "Cook Islands", gender: "male" },
  { id: "ci-7", name: "Teariki", meaning: "The chief", culture: "Cook Islands", gender: "male" },
  { id: "ci-8", name: "Ngatokorua", meaning: "Two stars", culture: "Cook Islands", gender: "unisex" },
  { id: "ci-9", name: "Ina", meaning: "Legendary goddess", culture: "Cook Islands", gender: "female" },
  { id: "ci-10", name: "Terei", meaning: "Sailing, voyaging", culture: "Cook Islands", gender: "male" },
  { id: "ci-11", name: "Akaiti", meaning: "Gentle path", culture: "Cook Islands", gender: "female" },
  { id: "ci-12", name: "Ngametua", meaning: "Strong roots", culture: "Cook Islands", gender: "male" },
  { id: "ci-13", name: "Tuaine", meaning: "Standing strong", culture: "Cook Islands", gender: "female" },
  { id: "ci-14", name: "Tavake", meaning: "Tropic bird", culture: "Cook Islands", gender: "male" },
  { id: "ci-15", name: "Mere", meaning: "Beloved", culture: "Cook Islands", gender: "female" },

  // Samoan names
  { id: "sa-1", name: "Sina", meaning: "White, shining", culture: "Samoa", gender: "female" },
  { id: "sa-2", name: "Tui", meaning: "King, royal", culture: "Samoa", gender: "male" },
  { id: "sa-3", name: "Leilani", meaning: "Heavenly lei, royal child", culture: "Samoa", gender: "female" },
  { id: "sa-4", name: "Manu", meaning: "Bird, creature of nature", culture: "Samoa", gender: "male" },
  { id: "sa-5", name: "Tala", meaning: "Story, tale", culture: "Samoa", gender: "unisex" },
  { id: "sa-6", name: "Sefina", meaning: "Gentle breeze", culture: "Samoa", gender: "female" },
  { id: "sa-7", name: "Lotu", meaning: "Prayer, devotion", culture: "Samoa", gender: "unisex" },
  { id: "sa-8", name: "Fetū", meaning: "Star", culture: "Samoa", gender: "unisex" },
  { id: "sa-9", name: "Tamā", meaning: "Child, son", culture: "Samoa", gender: "male" },
  { id: "sa-10", name: "Masina", meaning: "Moon", culture: "Samoa", gender: "female" },
  { id: "sa-11", name: "Sāmoa", meaning: "Sacred center", culture: "Samoa", gender: "unisex" },
  { id: "sa-12", name: "Toa", meaning: "Brave warrior", culture: "Samoa", gender: "male" },
  { id: "sa-13", name: "Lagi", meaning: "Sky, heaven", culture: "Samoa", gender: "female" },
  { id: "sa-14", name: "Vaiaso", meaning: "Week of life", culture: "Samoa", gender: "male" },
  { id: "sa-15", name: "Teuila", meaning: "Red ginger flower", culture: "Samoa", gender: "female" },
  { id: "sa-16", name: "Alofa", meaning: "Love", culture: "Samoa", gender: "unisex" },
  { id: "sa-17", name: "Nafanua", meaning: "Legendary warrior goddess", culture: "Samoa", gender: "female" },
  { id: "sa-18", name: "Malietoa", meaning: "Great warrior chief", culture: "Samoa", gender: "male" },
];
