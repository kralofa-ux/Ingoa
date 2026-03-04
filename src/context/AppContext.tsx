import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { PolynesianName, Culture, Gender } from "@/data/names";

interface AppState {
  mode: "solo" | "couple";
  currentPartner: "A" | "B";
  likedNamesA: PolynesianName[];
  likedNamesB: PolynesianName[];
  passedIds: Set<string>;
  cultureFilter: Culture | "all";
  genderFilter: Gender | "all";
}

interface AppContextType extends AppState {
  setMode: (mode: "solo" | "couple") => void;
  switchPartner: () => void;
  likeName: (name: PolynesianName) => void;
  passName: (id: string) => void;
  removeLikedName: (id: string) => void;
  setCultureFilter: (c: Culture | "all") => void;
  setGenderFilter: (g: Gender | "all") => void;
  matchedNames: PolynesianName[];
  likedNames: PolynesianName[];
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"solo" | "couple">("solo");
  const [currentPartner, setCurrentPartner] = useState<"A" | "B">("A");
  const [likedNamesA, setLikedNamesA] = useState<PolynesianName[]>([]);
  const [likedNamesB, setLikedNamesB] = useState<PolynesianName[]>([]);
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  const [cultureFilter, setCultureFilter] = useState<Culture | "all">("all");
  const [genderFilter, setGenderFilter] = useState<Gender | "all">("all");

  const switchPartner = useCallback(() => {
    setCurrentPartner((p) => (p === "A" ? "B" : "A"));
  }, []);

  const likeName = useCallback(
    (name: PolynesianName) => {
      if (mode === "solo" || currentPartner === "A") {
        setLikedNamesA((prev) => (prev.find((n) => n.id === name.id) ? prev : [...prev, name]));
      } else {
        setLikedNamesB((prev) => (prev.find((n) => n.id === name.id) ? prev : [...prev, name]));
      }
    },
    [mode, currentPartner]
  );

  const passName = useCallback((id: string) => {
    setPassedIds((prev) => new Set(prev).add(id));
  }, []);

  const removeLikedName = useCallback(
    (id: string) => {
      if (mode === "solo" || currentPartner === "A") {
        setLikedNamesA((prev) => prev.filter((n) => n.id !== id));
      } else {
        setLikedNamesB((prev) => prev.filter((n) => n.id !== id));
      }
    },
    [mode, currentPartner]
  );

  const matchedNames = likedNamesA.filter((a) => likedNamesB.some((b) => b.id === a.id));
  const likedNames = mode === "solo" || currentPartner === "A" ? likedNamesA : likedNamesB;

  const resetAll = useCallback(() => {
    setLikedNamesA([]);
    setLikedNamesB([]);
    setPassedIds(new Set());
  }, []);

  return (
    <AppContext.Provider
      value={{
        mode, setMode,
        currentPartner, switchPartner,
        likedNamesA, likedNamesB,
        passedIds,
        cultureFilter, setCultureFilter,
        genderFilter, setGenderFilter,
        likeName, passName, removeLikedName,
        matchedNames, likedNames,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
