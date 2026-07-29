import React from "react";
import { User } from "lucide-react";

export default function UserBadge({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-2.5 bg-slate-800/80 px-3 py-1.5 rounded-full shadow-sm border border-slate-700">
      <div className="bg-emerald-950 p-1.5 rounded-full flex-shrink-0">
        <User className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="text-sm pr-1">
        <p className="text-slate-400 text-[10px] font-medium leading-tight uppercase tracking-wide">
          {user.role || "User"}
        </p>
        <p className="font-bold text-slate-200 text-xs leading-tight truncate max-w-[160px]">
          {user.name || user.email}
        </p>
      </div>
    </div>
  );
}
