import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

const NetworkStatus = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground text-center py-2 px-4 text-sm font-body font-semibold flex items-center justify-center gap-2"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
        >
          <WifiOff className="w-4 h-4" />
          No internet connection
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
