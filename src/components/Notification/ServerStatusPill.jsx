import React, { useState, useEffect, useCallback } from "react";
import { Server } from "lucide-react";
import apiClient from "../../api/axios";

export default function ServerStatusPill() {
  const [isOffline, setIsOffline] = useState(false);

  const checkServerStatus = useCallback(async () => {
    try {
      await apiClient.get("/users", { timeout: 4000 });
      setIsOffline(false);
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleStatusChange = (e) => {
      if (e.detail) {
        setIsOffline(!e.detail.online);
      }
    };

    window.addEventListener("server-status-changed", handleStatusChange);

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 15000);

    return () => {
      window.removeEventListener("server-status-changed", handleStatusChange);
      clearInterval(interval);
    };
  }, [checkServerStatus]);

  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold shadow-sm transition-colors shrink-0">
      <Server className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      <span className="text-slate-600 dark:text-slate-400 font-medium">Server:</span>
      {isOffline ? (
        <span className="inline-flex items-center gap-1.5 text-rose-600 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Offline
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Online
        </span>
      )}
    </div>
  );
}
