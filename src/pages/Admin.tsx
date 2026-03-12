import { useState } from "react";
import { useAdmin, useAdminStats, useAdminNames, NameRow } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Users, Heart, TrendingUp, Database,
  Plus, Upload, Search, ChevronLeft, ChevronRight,
  Check, X, Edit2, Loader2, BarChart3,
} from "lucide-react";

const CULTURES = ["Aotearoa", "Cook Islands", "Samoa", "Tonga", "Fiji", "Hawaii", "Niue", "Tahiti"];
const GENDERS = ["male", "female", "unisex"];

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"stats" | "names">("stats");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-2xl font-display text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground font-body mb-6">You don't have admin privileges.</p>
        <button onClick={() => navigate("/browse")} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-body font-medium">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8 pt-6 px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-display text-foreground">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("stats")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
            tab === "stats" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-1.5" />Analytics
        </button>
        <button
          onClick={() => setTab("names")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
            tab === "names" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Database className="w-4 h-4 inline mr-1.5" />Names
        </button>
      </div>

      {tab === "stats" ? <StatsPanel /> : <NamesPanel />}
    </div>
  );
};

const StatsPanel = () => {
  const { stats, loading } = useAdminStats();

  if (loading || !stats) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const statCards = [
    { label: "Users", value: stats.total_users, icon: Users, color: "text-primary" },
    { label: "Active Names", value: stats.total_names, icon: Database, color: "text-accent" },
    { label: "Total Likes", value: stats.total_likes, icon: Heart, color: "text-coral" },
    { label: "Total Passes", value: stats.total_passes, icon: X, color: "text-muted-foreground" },
    { label: "Couples", value: stats.couple_connections, icon: Users, color: "text-primary" },
    { label: "Conversion", value: stats.total_likes + stats.total_passes > 0 ? `${Math.round((stats.total_likes / (stats.total_likes + stats.total_passes)) * 100)}%` : "0%", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-2xl font-display text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground font-body">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Culture Popularity */}
      {stats.culture_stats && (
        <section>
          <h2 className="text-sm font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Likes by Culture
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {stats.culture_stats.map((c, i) => {
              const max = Math.max(...stats.culture_stats!.map((x) => x.like_count));
              const pct = max > 0 ? (c.like_count / max) * 100 : 0;
              return (
                <div key={c.culture} className={`px-4 py-3 flex items-center gap-3 ${i < stats.culture_stats!.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-sm font-body text-foreground w-28 flex-shrink-0">{c.culture}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full gradient-ocean transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-body w-8 text-right">{c.like_count}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Top Names */}
      {stats.top_names && stats.top_names.length > 0 && (
        <section>
          <h2 className="text-sm font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Top 20 Most Liked Names
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {stats.top_names.map((n, i) => (
              <div key={`${n.name}-${i}`} className={`px-4 py-2.5 flex items-center justify-between ${i < stats.top_names!.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-body w-5">{i + 1}</span>
                  <div>
                    <span className="text-sm font-body font-medium text-foreground">{n.name}</span>
                    <span className="text-xs text-muted-foreground font-body ml-2">{n.culture}</span>
                  </div>
                </div>
                <span className="text-xs font-body text-primary font-medium">{n.like_count} ❤️</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const NamesPanel = () => {
  const {
    names, loading, total, page, setPage, pageSize,
    search, setSearch, cultureFilter, setCultureFilter,
    updateName, addName, bulkInsert, refresh,
  } = useAdminNames();
  const [showAdd, setShowAdd] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NameRow>>({});
  const [addForm, setAddForm] = useState({ id: "", name: "", culture: "Aotearoa", gender: "male", meaning: "", commonality_score: 2, status: "active" });
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  const startEdit = (n: NameRow) => {
    setEditingId(n.id);
    setEditForm({ name: n.name, culture: n.culture, gender: n.gender, meaning: n.meaning, commonality_score: n.commonality_score, status: n.status });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateName(editingId, editForm);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!addForm.id || !addForm.name) return;
    await addName(addForm as any);
    setAddForm({ id: "", name: "", culture: "Aotearoa", gender: "male", meaning: "", commonality_score: 2, status: "active" });
    setShowAdd(false);
  };

  const handleCsvImport = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    try {
      const lines = csvText.trim().split("\n");
      const rows: Omit<NameRow, "created_at">[] = [];
      for (const line of lines) {
        const parts = line.split(",").map((s) => s.trim());
        if (parts.length < 4) continue;
        const [id, name, culture, gender, meaning = "", score = "2", status = "active"] = parts;
        rows.push({
          id,
          name,
          culture,
          gender,
          meaning: meaning || null,
          commonality_score: parseInt(score) || 2,
          status,
        });
      }
      if (rows.length > 0) {
        await bulkInsert(rows);
      }
      setCsvText("");
      setShowCsv(false);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search names..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={cultureFilter}
          onChange={(e) => { setCultureFilter(e.target.value); setPage(0); }}
          className="px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm font-body focus:outline-none"
        >
          <option value="">All cultures</option>
          {CULTURES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-body font-medium flex items-center gap-1.5">
          <Plus className="w-4 h-4" />Add Name
        </button>
        <button onClick={() => setShowCsv(!showCsv)} className="px-4 py-2 rounded-xl bg-secondary text-foreground text-sm font-body font-medium flex items-center gap-1.5">
          <Upload className="w-4 h-4" />CSV Import
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-body font-semibold text-foreground">Add New Name</h3>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="ID (e.g. nzm-999)" value={addForm.id} onChange={(e) => setAddForm({ ...addForm, id: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border" />
            <input placeholder="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border" />
            <select value={addForm.culture} onChange={(e) => setAddForm({ ...addForm, culture: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border">
              {CULTURES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={addForm.gender} onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border">
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <input placeholder="Meaning" value={addForm.meaning} onChange={(e) => setAddForm({ ...addForm, meaning: e.target.value })} className="col-span-2 px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-body border border-border" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body font-medium">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-body">Cancel</button>
          </div>
        </div>
      )}

      {/* CSV Import */}
      {showCsv && (
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-body font-semibold text-foreground">CSV Import</h3>
          <p className="text-xs text-muted-foreground font-body">Format: id,name,culture,gender,meaning,commonality_score,status</p>
          <textarea
            rows={6}
            placeholder="nzm-200,Aroha,Aotearoa,female,Love,3,active"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-mono border border-border resize-none"
          />
          <div className="flex gap-2">
            <button onClick={handleCsvImport} disabled={importing} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body font-medium disabled:opacity-50 flex items-center gap-1.5">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importing ? "Importing..." : "Import"}
            </button>
            <button onClick={() => setShowCsv(false)} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-body">Cancel</button>
          </div>
        </div>
      )}

      {/* Names Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : names.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground font-body text-sm">No names found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">Name</th>
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">Culture</th>
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">Gender</th>
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium hidden sm:table-cell">Meaning</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground font-medium">Score</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="px-3 py-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {names.map((n) => (
                  <tr key={n.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    {editingId === n.id ? (
                      <>
                        <td className="px-3 py-2"><input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary text-foreground text-sm border border-border" /></td>
                        <td className="px-3 py-2">
                          <select value={editForm.culture || ""} onChange={(e) => setEditForm({ ...editForm, culture: e.target.value })} className="px-2 py-1 rounded bg-secondary text-foreground text-sm border border-border">
                            {CULTURES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select value={editForm.gender || ""} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })} className="px-2 py-1 rounded bg-secondary text-foreground text-sm border border-border">
                            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2 hidden sm:table-cell"><input value={editForm.meaning || ""} onChange={(e) => setEditForm({ ...editForm, meaning: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary text-foreground text-sm border border-border" /></td>
                        <td className="px-3 py-2 text-center">
                          <select value={editForm.commonality_score || 2} onChange={(e) => setEditForm({ ...editForm, commonality_score: parseInt(e.target.value) })} className="px-2 py-1 rounded bg-secondary text-foreground text-sm border border-border">
                            <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <select value={editForm.status || "active"} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="px-2 py-1 rounded bg-secondary text-foreground text-sm border border-border">
                            <option value="active">Active</option><option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <button onClick={saveEdit} className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 text-foreground font-medium">{n.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{n.culture}</td>
                        <td className="px-3 py-2 text-muted-foreground">{n.gender}</td>
                        <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell truncate max-w-[150px]">{n.meaning}</td>
                        <td className="px-3 py-2 text-center text-muted-foreground">{n.commonality_score}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${n.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                            {n.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <button onClick={() => startEdit(n)} className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-body">{total} names total</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-body text-muted-foreground">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
