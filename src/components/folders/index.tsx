"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FolderId } from "@/types";

interface FolderLayerProps {
  openFolder: FolderId | null;
  openItemId: string | null;
  onClose: () => void;
  onOpenItem: (itemId: string) => void;
  onCloseItem: () => void;
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

interface DetailWindowProps {
  detail: DetailContent;
  onClose: () => void;
}

interface DetailContent {
  id: string;
  kind: FolderId;
  title: string;
  eyebrow: string;
  imageSrc: string;
  summary: string;
  metadata: Array<{
    label: string;
    value: string;
  }>;
  actions: Array<{
    label: string;
    disabled?: boolean;
  }>;
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

function getDetailContent(
  folderId: FolderId,
  app: FolderAppContent,
): DetailContent {
  const detailCopy: Record<
    FolderId,
    Pick<DetailContent, "summary" | "actions">
  > = {
    projects: {
      summary:
        "Placeholder project detail view. Real project story, role, process, technologies, and outcomes will be added when portfolio content is imported.",
      actions: [
        { label: "Case Study", disabled: true },
        { label: "Repository", disabled: true },
      ],
    },
    education: {
      summary:
        "Placeholder education detail view. Real institution, program, coursework, and credential details will be added later.",
      actions: [{ label: "Details", disabled: true }],
    },
    experience: {
      summary:
        "Placeholder experience detail view. Real role, company, responsibilities, timeline, and impact will be added later.",
      actions: [{ label: "Highlights", disabled: true }],
    },
  };

  const metadataByKind: Record<FolderId, DetailContent["metadata"]> = {
    projects: [
      { label: "Type", value: "Project placeholder" },
      { label: "Status", value: "Content pending" },
      { label: "Detail window", value: "Prototype only" },
    ],
    education: [
      { label: "Type", value: "Education placeholder" },
      { label: "Status", value: "Content pending" },
      { label: "Detail window", value: "Prototype only" },
    ],
    experience: [
      { label: "Type", value: "Experience placeholder" },
      { label: "Status", value: "Content pending" },
      { label: "Detail window", value: "Prototype only" },
    ],
  };

  return {
    id: app.id,
    kind: folderId,
    title: app.label,
    eyebrow: app.category ?? folderTitles[folderId],
    imageSrc: app.imageSrc,
    summary: detailCopy[folderId].summary,
    metadata: metadataByKind[folderId],
    actions: detailCopy[folderId].actions,
  };
}

export function FolderLayer({
  openFolder,
  openItemId,
  onClose,
  onOpenItem,
  onCloseItem,
}: FolderLayerProps) {
  const prefersReducedMotion = useReducedMotion();
  const selectedAppTriggerRef = useRef<HTMLButtonElement | null>(null);
  const folderTitle = openFolder ? folderTitles[openFolder] : "";
  const folderApps = openFolder ? folderAppsById[openFolder] : [];
  const selectedApp =
    openItemId && openFolder
      ? folderApps.find((app) => app.id === openItemId) ?? null
      : null;
  const selectedDetail =
    selectedApp && openFolder ? getDetailContent(openFolder, selectedApp) : null;
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

  const openItem = (itemId: string, trigger: HTMLButtonElement) => {
    selectedAppTriggerRef.current = trigger;
    onOpenItem(itemId);
  };

  const closeItem = () => {
    onCloseItem();

    requestAnimationFrame(() => {
      selectedAppTriggerRef.current?.focus();
    });
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
            inert={selectedDetail !== null}
            aria-hidden={selectedDetail !== null}
          >
            <FolderWindow title={folderTitle} onClose={onClose}>
              <FolderAppGrid apps={folderApps} onOpenItem={openItem} />
            </FolderWindow>
          </motion.div>
          <AnimatePresence>
            {selectedDetail ? (
              <>
                <motion.div
                  key="detail-scrim"
                  className="detail-scrim"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={layerTransition}
                />
                <motion.div
                  key={selectedDetail.id}
                  className="detail-window__motion"
                  variants={windowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={layerTransition}
                >
                  <DetailWindow detail={selectedDetail} onClose={closeItem} />
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
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

export function FolderAppGrid({
  apps,
  onOpenItem,
}: {
  apps: FolderAppContent[];
  onOpenItem: (itemId: string, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="folder-app-grid">
      {apps.map((app) => (
        <FolderApp key={app.id} app={app} onOpenItem={onOpenItem} />
      ))}
    </div>
  );
}

export function FolderApp({
  app,
  onOpenItem,
}: {
  app: FolderAppContent;
  onOpenItem: (itemId: string, trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      className="folder-app"
      onClick={(event) => onOpenItem(app.id, event.currentTarget)}
      aria-label={`Open ${app.label} detail`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Folder placeholders must render as plain image assets. */}
      <img src={app.imageSrc} alt="" />
      <span className="folder-app__label">{app.label}</span>
      {app.category ? (
        <span className="folder-app__category">{app.category}</span>
      ) : null}
    </button>
  );
}

export function DetailWindow({ detail, onClose }: DetailWindowProps) {
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
      className="detail-window"
      aria-modal="true"
      aria-labelledby="detail-window-title"
      role="dialog"
      onKeyDown={handleKeyDown}
    >
      <header className="detail-window__header">
        <button
          type="button"
          className="detail-window__back"
          onClick={onClose}
          aria-label="Back to folder"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
          <span>Folder</span>
        </button>
        <div>
          <p>{detail.eyebrow}</p>
          <h2 id="detail-window-title">{detail.title}</h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className="detail-window__close"
          onClick={onClose}
          aria-label={`Close ${detail.title} detail`}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="detail-window__content">
        <div
          className="detail-window__gallery"
          aria-label={`${detail.title} placeholder gallery`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Detail placeholders must render as plain image assets. */}
          <img src={detail.imageSrc} alt="" />
          <div aria-hidden="true" />
          <div aria-hidden="true" />
        </div>

        <div className="detail-window__body">
          <p className="detail-window__summary">{detail.summary}</p>

          <dl className="detail-window__metadata">
            {detail.metadata.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="detail-window__actions" aria-label="Detail actions">
            {detail.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                disabled={action.disabled}
                aria-disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
