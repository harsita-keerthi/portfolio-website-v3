"use client";

import { useState } from "react";
import { LockScreen } from "@/components/lock-screen";
import { HomeScreen } from "@/components/home-screen";
import type { DockItemContent, HomeWidgetContent, Profile } from "@/types";

interface PortfolioOSProps {
  profile: Profile;
  content: HomeWidgetContent;
  dockItems: DockItemContent[];
}

export function PortfolioOS({ profile, content, dockItems }: PortfolioOSProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-slate-950">
      <div
        aria-hidden={!isUnlocked}
        className={isUnlocked ? "opacity-100" : "pointer-events-none opacity-100"}
        inert={!isUnlocked}
      >
        <HomeScreen
          profile={profile}
          content={content}
          dockItems={dockItems}
        />
      </div>

      {!isUnlocked ? (
        <LockScreen profile={profile} onEnter={() => setIsUnlocked(true)} />
      ) : null}
    </main>
  );
}
