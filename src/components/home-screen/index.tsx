"use client";

import { useEffect, useRef, useState } from "react";
import { Dock } from "@/components/dock";
import { FolderLayer } from "@/components/folders";
import { StatusBar } from "@/components/status-bar";
import { HomeGrid } from "@/components/widgets";
import type {
  DockItemContent,
  FolderId,
  HomeWidgetContent,
  PortfolioUIState,
  Profile,
} from "@/types";

interface HomeScreenProps {
  profile: Profile;
  content: HomeWidgetContent;
  dockItems: DockItemContent[];
}

export function Wallpaper() {
  return <div aria-hidden="true" className="home-wallpaper" />;
}

export function HomeScreen({ profile, content, dockItems }: HomeScreenProps) {
  const [uiState, setUiState] = useState<PortfolioUIState>({
    openFolder: null,
    openItemId: null,
  });
  const lastDockTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isFolderOpen = uiState.openFolder !== null;

  useEffect(() => {
    if (!isFolderOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFolderOpen]);

  const openFolder = (folderId: FolderId, trigger: HTMLButtonElement) => {
    lastDockTriggerRef.current = trigger;
    setUiState({ openFolder: folderId, openItemId: null });
  };

  const closeFolder = () => {
    setUiState({ openFolder: null, openItemId: null });

    requestAnimationFrame(() => {
      lastDockTriggerRef.current?.focus();
    });
  };

  return (
    <section
      data-home-screen="true"
      className="home-screen font-sans text-slate-50 opacity-100 filter-none"
    >
      <Wallpaper />
      <div
        className="home-content"
        hidden={isFolderOpen}
        inert={isFolderOpen}
      >
        <StatusBar />
        <HomeGrid profile={profile} content={content} />
      </div>

      <div hidden={isFolderOpen} inert={isFolderOpen}>
        <Dock items={dockItems} onOpenFolder={openFolder} />
      </div>

      <FolderLayer openFolder={uiState.openFolder} onClose={closeFolder} />
    </section>
  );
}
