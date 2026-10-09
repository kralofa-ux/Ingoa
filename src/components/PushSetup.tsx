import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { initPush } from "@/lib/push";

/** Registers the device for match notifications once a user is signed in (native only). */
export default function PushSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) void initPush(navigate);
  }, [user?.id, navigate]);
  return null;
}
