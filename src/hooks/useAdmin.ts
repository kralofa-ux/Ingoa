import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    const check = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      setLoading(false);
    };
    check();
  }, [user]);

  return { isAdmin, loading };
};

interface AdminStats {
  total_users: number;
  total_names: number;
  total_likes: number;
  total_passes: number;
  couple_connections: number;
  culture_stats: { culture: string; like_count: number }[] | null;
  top_names: { name: string; culture: string; like_count: number }[] | null;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc("get_admin_stats");
    setStats(data as unknown as AdminStats);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, refresh: fetch };
};

export interface NameRow {
  id: string;
  name: string;
  culture: string;
  gender: string;
  meaning: string | null;
  commonality_score: number;
  status: string;
  created_at: string;
}

export const useAdminNames = () => {
  const [names, setNames] = useState<NameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [cultureFilter, setCultureFilter] = useState("");
  const pageSize = 50;

  const fetchNames = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("names")
      .select("id, name, culture, gender, meaning, commonality_score, status, created_at", { count: "exact" })
      .order("name")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (search) query = query.ilike("name", `%${search}%`);
    if (cultureFilter) query = query.eq("culture", cultureFilter);

    const { data, count } = await query;
    setNames(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, search, cultureFilter]);

  useEffect(() => { fetchNames(); }, [fetchNames]);

  const updateName = async (id: string, updates: Partial<NameRow>) => {
    await supabase.from("names").update(updates).eq("id", id);
    await fetchNames();
  };

  const addName = async (name: Omit<NameRow, "created_at">) => {
    await supabase.from("names").insert(name);
    await fetchNames();
  };

  const bulkInsert = async (rows: Omit<NameRow, "created_at">[]) => {
    // Insert in chunks of 100
    for (let i = 0; i < rows.length; i += 100) {
      await supabase.from("names").insert(rows.slice(i, i + 100));
    }
    await fetchNames();
  };

  return {
    names, loading, total, page, setPage, pageSize,
    search, setSearch, cultureFilter, setCultureFilter,
    updateName, addName, bulkInsert, refresh: fetchNames,
  };
};
