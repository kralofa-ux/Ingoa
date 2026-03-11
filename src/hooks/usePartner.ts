import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface PartnerStatus {
  connected: boolean;
  partner_name?: string;
  partner_id?: string;
  connection_id?: string;
}

export const usePartner = () => {
  const { user, session } = useAuth();
  const [status, setStatus] = useState<PartnerStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string | null>(null);

  const invoke = useCallback(
    async (action: string, extra: Record<string, string> = {}) => {
      if (!session) throw new Error("Not authenticated");
      const res = await supabase.functions.invoke("partner-code", {
        body: { action, ...extra },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    [session]
  );

  const fetchStatus = useCallback(async () => {
    if (!user || !session) return;
    try {
      const data = await invoke("status");
      setStatus(data);
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  }, [user, session, invoke]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const generateCode = useCallback(async () => {
    const data = await invoke("generate");
    setCode(data.code);
    return data.code;
  }, [invoke]);

  const joinCode = useCallback(
    async (inputCode: string) => {
      const data = await invoke("join", { code: inputCode });
      if (data.error) throw new Error(data.error);
      await fetchStatus();
      return data;
    },
    [invoke, fetchStatus]
  );

  const disconnect = useCallback(async () => {
    await invoke("disconnect");
    setStatus({ connected: false });
    setCode(null);
  }, [invoke]);

  return {
    status,
    loading,
    code,
    generateCode,
    joinCode,
    disconnect,
    refreshStatus: fetchStatus,
  };
};
