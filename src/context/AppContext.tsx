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
  lastName: string;
  middleName: string;
  showNamePreview: boolean;
  swipeHistory: { name: PolynesianName; action: "like" | "pass" }[];
}

interface AppContextType extends AppState {
  setMode: (mode: "solo" | "couple") => void;
  switchPartner: () => void;
  likeName: (name: PolynesianName) => void;
  passName: (id: string, name?: PolynesianName) => void;
  removeLikedName: (id: string) => void;
  setCultureFilter: (c: Culture | "all") => void;
  setGenderFilter: (g: Gender | "all") => void;
  matchedNames: PolynesianName[];
  likedNames: PolynesianName[];
  resetAll: () => void;
  setLastName: (v: string) => void;
  setMiddleName: (v: string) => void;
  setShowNamePreview: (v: boolean) => void;
  undoLastSwipe: () => boolean;
  refreshDeck: () => void;
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
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [showNamePreview, setShowNamePreview] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState<{ name: PolynesianName; action: "like" | "pass" }[]>([]);

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
      setSwipeHistory((prev) => [...prev, { name, action: "like" }]);
    },
    [mode, currentPartner]
  );

  const passName = useCallback((id: string, name?: PolynesianName) => {
    setPassedIds((prev) => new Set(prev).add(id));
    if (name) {
      setSwipeHistory((prev) => [...prev, { name, action: "pass" }]);
    }
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

  const undoLastSwipe = useCallback(() => {
    if (swipeHistory.length === 0) return false;
    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));

    if (last.action === "like") {
      // Remove from liked
      if (mode === "solo" || currentPartner === "A") {
        setLikedNamesA((prev) => prev.filter((n) => n.id !== last.name.id));
      } else {
        setLikedNamesB((prev) => prev.filter((n) => n.id !== last.name.id));
      }
    } else {
      // Remove from passed
      setPassedIds((prev) => {
        const next = new Set(prev);
        next.delete(last.name.id);
        return next;
      });
    }
    return true;
  }, [swipeHistory, mode, currentPartner]);

  const refreshDeck = useCallback(() => {
    setPassedIds(new Set());
  }, []);

  const matchedNames = likedNamesA.filter((a) => likedNamesB.some((b) => b.id === a.id));
  const likedNames = mode === "solo" || currentPartner === "A" ? likedNamesA : likedNamesB;

  const resetAll = useCallback(() => {
    setLikedNamesA([]);
    setLikedNamesB([]);
    setPassedIds(new Set());
    setSwipeHistory([]);
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
        lastName, setLastName,
        middleName, setMiddleName,
        showNamePreview, setShowNamePreview,
        swipeHistory,
        undoLastSwipe,
        refreshDeck,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
