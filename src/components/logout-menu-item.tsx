// src/components/logout-menu-item.tsx
"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutMenuItem() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      window.location.href = data.redirect || "/login";
    } catch {
      setLoading(false);
    }
  }

  return (
    <DropdownMenuItem onSelect={handleLogout} disabled={loading} variant="destructive">
      <LogOut />
      {loading ? "Signing out…" : "Sign out"}
    </DropdownMenuItem>
  );
}