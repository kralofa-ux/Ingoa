import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { PolynesianName, Culture, Gender } from "@/data/names";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface AppState {
  mode: "solo" | "couple";
  currentPartner: "A" | "B";
  likedNamesA: PolynesianName[];
  likedNamesB: PolynesianName[];
  passedIds: Set<string>;
  cultureFilter: Culture[];
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
  setCultureFilter: (c: Culture[]) => void;
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
  const { profile, user } = useAuth();
  const [mode, setModeState] = useState<"solo" | "couple">("solo");
  const [currentPartner, setCurrentPartner] = useState<"A" | "B">("A");
  const [likedNamesA, setLikedNamesA] = useState<PolynesianName[]>([]);
  const [likedNamesB, setLikedNamesB] = useState<PolynesianName[]>([]);
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  const [cultureFilter, setCultureFilter] = useState<Culture[]>([]);
  const [genderFilter, setGenderFilter] = useState<Gender | "all">("all");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [showNamePreview, setShowNamePreview] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState<{ name: PolynesianName; action: "like" | "pass" }[]>([]);

  // Sync profile preferences — handle both old (boy/girl/both) and new (male/female/all) formats
  useEffect(() => {
    if (profile) {
      setModeState(profile.mode as "solo" | "couple");
      setLastName(profile.last_name || "");
      setMiddleName(profile.middle_name || "");
      if (profile.selected_cultures && profile.selected_cultures.length > 0) {
        setCultureFilter(profile.selected_cultures as Culture[]);
      }
      const gp = profile.gender_preference;
      if (gp === "male" || gp === "boy") setGenderFilter("male");
      else if (gp === "female" || gp === "girl") setGenderFilter("female");
      else setGenderFilter("all");
    }
  }, [profile]);

  // Load liked/passed from cloud
  useEffect(() => {
    if (!user) return;
    const loadSwipeData = async () => {
      const [likedRes, passedRes] = await Promise.all([
        supabase.from("liked_names").select("name_id").eq("user_id", user.id),
        supabase.from("passed_names").select("name_id").eq("user_id", user.id),
      ]);
      if (passedRes.data) {
        setPassedIds(new Set(passedRes.data.map((r) => r.name_id)));
      }
      // Resolve liked name IDs from the names table
      if (likedRes.data && likedRes.data.length > 0) {
        const nameIds = likedRes.data.map((r) => r.name_id);
        const { data: nameRows } = await supabase
          .from("names")
          .select("id, name, culture, gender, meaning")
          .in("id", nameIds);
        if (nameRows) {
          const likedObjs: PolynesianName[] = nameRows.map((r) => ({
            id: r.id,
            name: r.name,
            meaning: r.meaning ?? "",
            culture: r.culture as Culture,
            gender: r.gender as Gender,
          }));
          setLikedNamesA(likedObjs);
        }
      }
    };
    loadSwipeData();
  }, [user]);

  const setMode = useCallback((m: "solo" | "couple") => {
    setModeState(m);
  }, []);

  const switchPartner = useCallback(() => {
    setCurrentPartner((p) => (p === "A" ? "B" : "A"));
  }, []);

  const likeName = useCallback(
    async (name: PolynesianName) => {
      if (mode === "solo" || currentPartner === "A") {
        setLikedNamesA((prev) => (prev.find((n) => n.id === name.id) ? prev : [...prev, name]));
      } else {
        setLikedNamesB((prev) => (prev.find((n) => n.id === name.id) ? prev : [...prev, name]));
      }
      setSwipeHistory((prev) => [...prev, { name, action: "like" }]);
      if (user) {
        await supabase.from("liked_names").upsert({ user_id: user.id, name_id: name.id });
      }
    },
    [mode, currentPartner, user]
  );

  const passName = useCallback(async (id: string, name?: PolynesianName) => {
    setPassedIds((prev) => new Set(prev).add(id));
    if (name) {
      setSwipeHistory((prev) => [...prev, { name, action: "pass" }]);
    }
    if (user) {
      await supabase.from("passed_names").upsert({ user_id: user.id, name_id: id });
    }
  }, [user]);

  const removeLikedName = useCallback(
    async (id: string) => {
      if (mode === "solo" || currentPartner === "A") {
        setLikedNamesA((prev) => prev.filter((n) => n.id !== id));
      } else {
        setLikedNamesB((prev) => prev.filter((n) => n.id !== id));
      }
      if (user) {
        await supabase.from("liked_names").delete().eq("user_id", user.id).eq("name_id", id);
      }
    },
    [mode, currentPartner, user]
  );

  const undoLastSwipe = useCallback(() => {
    if (swipeHistory.length === 0) return false;
    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));

    if (last.action === "like") {
      if (mode === "solo" || currentPartner === "A") {
        setLikedNamesA((prev) => prev.filter((n) => n.id !== last.name.id));
      } else {
        setLikedNamesB((prev) => prev.filter((n) => n.id !== last.name.id));
      }
      if (user) {
        supabase.from("liked_names").delete().eq("user_id", user.id).eq("name_id", last.name.id);
      }
    } else {
      setPassedIds((prev) => {
        const next = new Set(prev);
        next.delete(last.name.id);
        return next;
      });
      if (user) {
        supabase.from("passed_names").delete().eq("user_id", user.id).eq("name_id", last.name.id);
      }
    }
    return true;
  }, [swipeHistory, mode, currentPartner, user]);

  const refreshDeck = useCallback(async () => {
    setPassedIds(new Set());
    if (user) {
      await supabase.from("passed_names").delete().eq("user_id", user.id);
    }
  }, [user]);

  const matchedNames = likedNamesA.filter((a) => likedNamesB.some((b) => b.id === a.id));
  const likedNames = mode === "solo" || currentPartner === "A" ? likedNamesA : likedNamesB;

  const resetAll = useCallback(async () => {
    setLikedNamesA([]);
    setLikedNamesB([]);
    setPassedIds(new Set());
    setSwipeHistory([]);
    if (user) {
      await Promise.all([
        supabase.from("liked_names").delete().eq("user_id", user.id),
        supabase.from("passed_names").delete().eq("user_id", user.id),
      ]);
    }
  }, [user]);

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
