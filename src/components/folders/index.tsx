"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import type {
  EducationItem,
  ExperienceItem,
  FolderId,
  MediaItem,
  Project,
} from "@/types";

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

type DetailContent =
  | { kind: "education"; item: EducationItem }
  | { kind: "projects"; item: Project }
  | { kind: "experience"; item: ExperienceItem };

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
  if (folderId === "education") {
    return {
      kind: "education",
      item:
        education.find((item) => item.id === app.id) ??
        ({
          id: app.id,
          title: app.label,
          dateLabel: "",
          gallery: [{ src: app.imageSrc, alt: `${app.label} artwork` }],
          coursework: [],
          activities: [],
          honors: [],
        } satisfies EducationItem),
    };
  }

  if (folderId === "experience") {
    return {
      kind: "experience",
      item:
        experience.find((item) => item.id === app.id) ??
        ({
          id: app.id,
          title: app.label,
          dateLabel: "",
          description: "",
          techStack: [],
          gallery: [],
        } satisfies ExperienceItem),
    };
  }

  return {
    kind: "projects",
    item:
      projects.find((item) => item.id === app.id) ??
      ({
        id: app.id,
        slug: app.id,
        title: app.label,
        shortDescription: "",
        description: "",
        role: "",
        dateLabel: "",
        context: "personal",
        disciplines: [],
        projectTypes: [],
        techStack: [],
        gallery: [{ src: app.imageSrc, alt: `${app.label} artwork` }],
      } satisfies Project),
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
                  key={`${selectedDetail.kind}-${selectedDetail.item.id}`}
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
  const title = getDetailTitle(detail);
  const eyebrow = getDetailEyebrow(detail.kind);

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
          <p>{eyebrow}</p>
          <h2 id="detail-window-title">{title}</h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className="detail-window__close"
          onClick={onClose}
          aria-label={`Close ${title} detail`}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="detail-window__content">
        {detail.kind === "education" ? (
          <EducationDetail item={detail.item} />
        ) : null}
        {detail.kind === "projects" ? <ProjectDetail item={detail.item} /> : null}
        {detail.kind === "experience" ? (
          <ExperienceDetail item={detail.item} />
        ) : null}
      </div>
    </section>
  );
}

function getDetailEyebrow(kind: FolderId) {
  if (kind === "projects") {
    return "Project";
  }

  if (kind === "education") {
    return "Education";
  }

  return "Experience";
}

function getDetailTitle(detail: DetailContent) {
  if (detail.kind === "education") {
    return detail.item.subtitle
      ? `${detail.item.title} / ${detail.item.subtitle}`
      : detail.item.title;
  }

  if (detail.kind === "experience" && detail.item.organization) {
    return `${detail.item.title} / ${detail.item.organization}`;
  }

  return detail.item.title;
}

function getEducationMedia(item: EducationItem): MediaItem[] {
  if (item.gallery?.length) {
    return item.gallery;
  }

  if (item.image) {
    return [{ src: item.image, alt: `${item.title} artwork` }];
  }

  return [];
}

function EducationDetail({ item }: { item: EducationItem }) {
  const media = getEducationMedia(item);

  return (
    <article className="detail-body">
      {item.dateLabel ? <p className="detail-date">{item.dateLabel}</p> : null}
      <MediaCarousel items={media} label={`${item.title} images`} />
      <ChipSection title="Relevant coursework" items={item.coursework} />
      <TextListSection title="Activities and societies" items={item.activities} />
      <TextListSection title="Honors" items={item.honors} />
    </article>
  );
}

function ProjectDetail({ item }: { item: Project }) {
  return (
    <article className="detail-body">
      <ChipSection title="Project type" items={item.projectTypes} tone="type" />
      <MediaCarousel items={item.gallery} label={`${item.title} images`} />
      {item.description ? (
        <section className="detail-section">
          <h3>Description</h3>
          <p className="detail-copy">{item.description}</p>
        </section>
      ) : null}
      <ChipSection title="Tech stack" items={item.techStack} />
      {item.liveUrl || item.githubUrl ? (
        <section className="detail-section">
          <div className="detail-link-row">
            {item.liveUrl ? (
              <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
                <span className="sr-only"> opens in a new tab</span>
              </a>
            ) : null}
            {item.githubUrl ? (
              <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub
                <span className="sr-only"> opens in a new tab</span>
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function ExperienceDetail({ item }: { item: ExperienceItem }) {
  return (
    <article className="detail-body">
      {item.dateLabel ? <p className="detail-date">{item.dateLabel}</p> : null}
      <MediaCarousel
        items={item.gallery ?? []}
        label={`${item.title} images`}
      />
      {item.description ? (
        <section className="detail-section">
          <h3>Description</h3>
          <p className="detail-copy">{item.description}</p>
        </section>
      ) : null}
      <ChipSection title="Tech stack" items={item.techStack} />
    </article>
  );
}

function ChipSection({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "type";
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="detail-section">
      <h3>{title}</h3>
      <div className={tone === "type" ? "detail-tags detail-tags--type" : "detail-tags"}>
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function TextListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="detail-section">
      <h3>{title}</h3>
      <ul className="detail-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function MediaCarousel({
  items,
  label,
}: {
  items: MediaItem[];
  label: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ dragging: false, startX: 0, scrollLeft: 0 });
  const hasMultipleItems = items.length > 1;

  if (items.length === 0) {
    return null;
  }

  const scrollToIndex = (nextIndex: number) => {
    const boundedIndex = Math.min(items.length - 1, Math.max(0, nextIndex));
    setActiveIndex(boundedIndex);
    scrollerRef.current?.scrollTo({
      left: scrollerRef.current.clientWidth * boundedIndex,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveIndex(Math.min(items.length - 1, Math.max(0, nextIndex)));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (!scroller || !hasMultipleItems) {
      return;
    }

    dragState.current = {
      dragging: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (!scroller || !dragState.current.dragging) {
      return;
    }

    const delta = event.clientX - dragState.current.startX;
    scroller.scrollLeft = dragState.current.scrollLeft - delta;
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    dragState.current.dragging = false;

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultipleItems) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <section className="detail-section media-carousel" aria-label={label}>
      <div
        ref={scrollerRef}
        className="media-carousel__track"
        tabIndex={hasMultipleItems ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <figure key={item.src} className="media-carousel__slide">
            {/* eslint-disable-next-line @next/next/no-img-element -- Portfolio media is data-driven and may be replaced by uploaded assets. */}
            <img src={item.src} alt={item.alt} draggable={false} />
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>

      {hasMultipleItems ? (
        <div className="media-carousel__controls">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            aria-label="Show previous image"
          >
            Previous
          </button>
          <div aria-label="Image pagination" className="media-carousel__dots">
            {items.map((item, index) => (
              <button
                key={item.src}
                type="button"
                className={index === activeIndex ? "is-active" : undefined}
                onClick={() => scrollToIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            aria-label="Show next image"
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
