"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FolderId } from "@/types";

interface FolderLayerProps {
  openFolder: FolderId | null;
  onClose: () => void;
}

interface FolderWindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

interface FolderAppContent {
  id: string;
  label: string;
  category?: string;
  imageSrc: string;
}

const folderTitles: Record<FolderId, string> = {
  education: "Education",
  projects: "Projects",
  experience: "Experience",
};

const folderAppsById: Record<FolderId, FolderAppContent[]> = {
  projects: Array.from({ length: 10 }, (_, index) => {
    const appNumber = index + 1;

    return {
      id: `project-${appNumber}`,
      label: `Project ${String(appNumber).padStart(2, "0")}`,
      category: "Placeholder",
      imageSrc: `/placeholders/folders/projects/project-${String(appNumber).padStart(2, "0")}.svg`,
    };
  }),
  education: [
    {
      id: "university",
      label: "University",
      category: "Education",
      imageSrc: "/placeholders/folders/education/university.svg",
    },
    {
      id: "additional-program",
      label: "Additional Program",
      category: "Program",
      imageSrc: "/placeholders/folders/education/additional-program.svg",
    },
    {
      id: "certification",
      label: "Certification",
      category: "Credential",
      imageSrc: "/placeholders/folders/education/certification.svg",
    },
  ],
  experience: Array.from({ length: 4 }, (_, index) => {
    const appNumber = index + 1;

    return {
      id: `experience-${appNumber}`,
      label: `Experience ${String(appNumber).padStart(2, "0")}`,
      category: "Placeholder",
      imageSrc: `/placeholders/folders/experience/experience-${String(appNumber).padStart(2, "0")}.svg`,
    };
  }),
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function FolderLayer({ openFolder, onClose }: FolderLayerProps) {
  const prefersReducedMotion = useReducedMotion();
  const folderTitle = openFolder ? folderTitles[openFolder] : "";
  const folderApps = openFolder ? folderAppsById[openFolder] : [];
  const layerTransition = prefersReducedMotion
    ? { duration: 0.12 }
    : { duration: 0.42, ease: "easeOut" as const };
  const windowVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.97, y: 18 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 12 },
      };

  return (
    <AnimatePresence>
      {openFolder ? (
        <motion.div
          className="folder-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={layerTransition}
        >
          <motion.div
            className="folder-window__motion"
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={layerTransition}
          >
            <FolderWindow title={folderTitle} onClose={onClose}>
              <FolderAppGrid apps={folderApps} />
            </FolderWindow>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function FolderWindow({ title, children, onClose }: FolderWindowProps) {
  const windowRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      windowRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <section
      ref={windowRef}
      className="folder-window"
      aria-modal="true"
      aria-labelledby="folder-window-title"
      role="dialog"
      onKeyDown={handleKeyDown}
    >
      <header className="folder-window__header">
        <button
          type="button"
          className="folder-window__back"
          onClick={onClose}
          aria-label="Back to home screen"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
          <span>Home</span>
        </button>
        <h2 id="folder-window-title">{title}</h2>
        <button
          ref={closeButtonRef}
          type="button"
          className="folder-window__close"
          onClick={onClose}
          aria-label={`Close ${title} folder`}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="folder-window__content">{children}</div>
    </section>
  );
}

export function FolderAppGrid({ apps }: { apps: FolderAppContent[] }) {
  return (
    <div className="folder-app-grid">
      {apps.map((app) => (
        <FolderApp key={app.id} app={app} />
      ))}
    </div>
  );
}

export function FolderApp({ app }: { app: FolderAppContent }) {
  return (
    <button type="button" className="folder-app">
      {/* eslint-disable-next-line @next/next/no-img-element -- Folder placeholders must render as plain image assets. */}
      <img src={app.imageSrc} alt="" />
      <span className="folder-app__label">{app.label}</span>
      {app.category ? <span className="folder-app__category">{app.category}</span> : null}
    </button>
  );
}
