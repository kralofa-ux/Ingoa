export type Culture = "NZ Māori" | "Cook Islands" | "Samoa" | "Tonga" | "Fiji" | "Hawaii" | "Niue" | "Tahiti";
export type Gender = "male" | "female" | "unisex";

export interface PolynesianName {
  id: string;
  name: string;
  meaning: string;
  culture: Culture;
  gender: Gender;
  commonalityScore?: number;
}
