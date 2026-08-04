import React from "react";
import { User } from "lucide-react";

export default function UserBadge({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="bg-emerald-100 dark:bg-emerald-950 p-1.5 rounded-full flex-shrink-0">
        <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="text-sm pr-1">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold leading-tight uppercase tracking-wide">
          {user.role || "User"}
        </p>
        <p className="font-bold text-slate-900 dark:text-slate-200 text-xs leading-tight truncate max-w-[160px]">
          {user.name || user.email}
        </p>
      </div>
    </div>
  );
}
