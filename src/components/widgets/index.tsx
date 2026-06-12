"use client";

import {
  ArrowDownToLine,
  Eye,
  MapPin,
} from "lucide-react";
import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type {
  HomeWidgetContent,
  Profile,
  ResumeContent,
  WidgetList,
} from "@/types";

type ProfileContent = HomeWidgetContent["profile"];
type GlassTone = "primary" | "panel" | "utility";

interface GlassWidgetProps {
  children: ReactNode;
  className?: string;
  tone?: GlassTone;
  ariaLabel?: string;
}

const glassToneStyles: Record<GlassTone, string> = {
  primary: "glass-tone-primary",
  panel: "glass-tone-panel",
  utility: "glass-tone-utility",
};

const skillPlaceholderByLabel: Record<string, string> = {
  Python: "/placeholders/skills/python-placeholder.svg",
  Java: "/placeholders/skills/java-placeholder.svg",
  JavaScript: "/placeholders/skills/javascript-placeholder.svg",
  HTML: "/placeholders/skills/html-placeholder.svg",
  CSS: "/placeholders/skills/css-placeholder.svg",
  "Next.js": "/placeholders/skills/nextjs-placeholder.svg",
  TypeScript: "/placeholders/skills/typescript-placeholder.svg",
  React: "/placeholders/skills/react-placeholder.svg",
  "Node.js": "/placeholders/skills/nodejs-placeholder.svg",
  SQL: "/placeholders/skills/sql-placeholder.svg",
};

function classNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function HomeGrid({
  profile,
  content,
}: {
  profile: Profile;
  content: HomeWidgetContent;
}) {
  const github = profile.socials.find((social) =>
    social.name.toLowerCase().includes("github"),
  );
  const linkedin = profile.socials.find((social) =>
    social.name.toLowerCase().includes("linkedin"),
  );

  return (
    <div className="home-grid">
      <ProfileWidget profile={profile} content={content.profile} />
      <CollageWidget />
      <SkillsWidget content={content.technicalSkills} />
      <div className="home-utility utility-cluster min-h-0">
        <ResumeWidget content={content.resume} resumeUrl={profile.resumeUrl} />
        <div className="social-apps">
          {github ? (
            <ImageApp label={github.name} href={github.url} kind="github" />
          ) : null}
          {profile.email ? (
            <ImageApp
              label="Email"
              href={`mailto:${profile.email}`}
              kind="email"
            />
          ) : null}
          {linkedin ? (
            <ImageApp
              label={linkedin.name}
              href={linkedin.url}
              kind="linkedin"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function GlassWidget({
  children,
  className,
  tone = "panel",
  ariaLabel,
}: GlassWidgetProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={classNames(
        "glass-widget relative isolate overflow-hidden border text-slate-50 backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:opacity-70 after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:-z-10 after:h-px after:bg-white/10",
        glassToneStyles[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ProfileWidget({
  profile,
  content,
}: {
  profile: Profile;
  content: ProfileContent;
}) {
  const [hasHomeImageError, setHasHomeImageError] = useState(false);

  return (
    <GlassWidget
      tone="primary"
      ariaLabel="Profile"
      className="home-profile"
    >
      <div className="profile-widget__content">
        <div className="max-w-[32rem]">
          <h1 className="text-4xl font-semibold leading-none tracking-normal text-white lg:text-[2.85rem]">
            {profile.name}
          </h1>
          <p className="mt-3 text-xl font-medium text-cyan-100">
            {profile.role}
          </p>
          <p className="mt-4 max-w-xl text-base font-normal leading-6 text-slate-100/95">
            {content.body}
          </p>
          <p className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-base font-medium text-slate-50">
            <MapPin aria-hidden="true" className="size-4 text-cyan-100" />
            {profile.location}
          </p>
        </div>

        <div className="profile-widget__image relative mx-auto flex shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/10 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl sm:mx-0">
          {profile.homeProfileImage && !hasHomeImageError ? (
            // eslint-disable-next-line @next/next/no-img-element -- Profile images are user-managed files in public/.
            <img
              src={profile.homeProfileImage}
              alt={`Portrait of ${profile.name}`}
              className="size-full object-cover"
              onError={() => setHasHomeImageError(true)}
            />
          ) : (
            <>
              <div className="absolute inset-3 rounded-[0.95rem] bg-[radial-gradient(circle_at_32%_20%,rgba(204,251,241,0.9),transparent_27%),radial-gradient(circle_at_72%_34%,rgba(216,180,254,0.72),transparent_30%),linear-gradient(145deg,rgba(6,78,59,0.95),rgba(20,184,166,0.78)_58%,rgba(30,64,175,0.76))]" />
              <div
                aria-hidden="true"
                className="relative size-24 rounded-full bg-emerald-950/85 shadow-inner shadow-white/20 sm:size-28"
              >
                <div className="absolute left-1/2 top-7 h-9 w-16 -translate-x-1/2 rounded-full bg-cyan-50/90" />
                <div className="absolute bottom-4 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-full bg-cyan-50/90" />
              </div>
              <span className="sr-only">Illustrated placeholder profile image for {profile.name}</span>
            </>
          )}
        </div>
      </div>
    </GlassWidget>
  );
}

const collageSlides = [
  {
    label: "CalHacks",
    src: "/placeholders/collage/calhacks.png",
    alt: "CalHacks",
  },
  {
    label: "Atlassian SFO",
    src: "/placeholders/collage/meatatlassian.png",
    alt: "Me at Atlassian SF Office",
  },
  {
    label: "Girls Who Code",
    src: "/placeholders/collage/gwc-art.png",
    alt: "Girls Who Code",
  },
  {
    label: "NVIDIA GTC",
    src: "/placeholders/collage/nvidiagtc.png",
    alt: "NVIDIA GTC",
  },
  {
    label: "Make With Notion",
    src: "/placeholders/collage/notion.png",
    alt: "Make with Notion",
  },
  {
    label: "HackDavis",
    src: "/placeholders/collage/hackdavis.png",
    alt: "HackDavis",
  },
];

export function CollageWidget() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ dragging: false, startX: 0, scrollLeft: 0 });
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
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

    if (!scroller) {
      return;
    }

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveSlide(Math.min(collageSlides.length - 1, Math.max(0, nextIndex)));
  };

  return (
    <GlassWidget
      tone="panel"
      ariaLabel="Collage"
      className="home-collage aspect-square max-h-full w-full p-2.5"
    >
      <div
        ref={scrollerRef}
        className="flex size-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-[0.95rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onScroll={handleScroll}
      >
        {collageSlides.map((slide, index) => (
          <div
            key={slide.label}
            className="relative size-full shrink-0 snap-center overflow-hidden rounded-[0.95rem] border border-white/10 bg-slate-950/20"
            aria-label={`${slide.label} collage image ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Collage placeholders should be simple replaceable image files. */}
            <img
              src={slide.src}
              alt={slide.alt}
              className="size-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/38 via-transparent to-white/5" />
            <p className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-slate-950/30 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
              {slide.label}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {collageSlides.map((slide, index) => (
          <span
            key={slide.label}
            className={classNames(
              "size-1.5 rounded-full bg-white/40",
              activeSlide === index && "w-5 bg-white/80",
            )}
          />
        ))}
      </div>
    </GlassWidget>
  );
}

export function SkillsWidget({ content }: { content: WidgetList }) {
  return (
    <GlassWidget tone="panel" ariaLabel={content.title} className="home-skills min-h-0">
      <h2 className="text-xl font-medium leading-none text-white">
        {content.title}
      </h2>
      <div className="skills-panel">
        <div className="skills-grid">
          {content.items.slice(0, 10).map((skill) => (
            <SkillItem key={skill} label={skill} />
          ))}
        </div>
      </div>
    </GlassWidget>
  );
}

export function SkillItem({ label }: { label: string }) {
  const imageSrc = skillPlaceholderByLabel[label];

  return (
    <div className="skill-item" aria-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Skill placeholders must render as plain img elements. */}
      <img src={imageSrc} alt={label} />
      <span>{label}</span>
    </div>
  );
}

export function ResumeWidget({
  content,
  resumeUrl,
}: {
  content: ResumeContent;
  resumeUrl?: string;
}) {
  const activeResumeUrl = resumeUrl ?? "/Harsita_Keerthikanth_SWE_Resume.pdf";
  const actionClass =
    "resume-action inline-flex items-center justify-center rounded-full border text-sm font-medium transition duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-cyan-100 motion-reduce:transition-none";

  return (
    <GlassWidget
      tone="utility"
      ariaLabel={content.title}
      className="resume-widget min-h-36 md:min-h-33"
    >
      <div className="resume-content">
        <div className="resume-copy text-left">
          <h2 className="text-xl font-medium text-white">{content.title}</h2>

          <div className="resume-actions">
            <a
              href={activeResumeUrl}
              className={`${actionClass} border-cyan-100/20 bg-cyan-50/15 text-white hover:bg-cyan-50/20`}
            >
              <Eye aria-hidden="true" className="size-4" />
              {content.viewLabel}
            </a>
            <a
              href={activeResumeUrl}
              download
              className={`${actionClass} border-white/15 bg-white/10 text-white hover:bg-white/15`}
            >
              <ArrowDownToLine aria-hidden="true" className="size-4" />
              {content.downloadLabel}
            </a>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- Resume preview placeholder is a static asset. */}
        <img
          src="/placeholders/resume-preview.svg"
          alt="Abstract résumé preview placeholder"
          className="resume-preview"
        />
      </div>
    </GlassWidget>
  );
}

export function ImageApp({
  label,
  href,
  kind,
}: {
  label: string;
  href: string;
  kind: "github" | "linkedin" | "email";
}) {
  const imageSrc = `/placeholders/${kind}-placeholder.svg`;
  const opensInNewTab = kind !== "email";

  return (
    <a
      href={href}
      target={opensInNewTab ? "_blank" : undefined}
      rel={opensInNewTab ? "noreferrer" : undefined}
      aria-label={label}
      title={label}
      className="image-app group inline-flex w-20 flex-col items-center gap-2 bg-transparent text-center text-sm font-normal text-slate-50 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Social app placeholders must render as plain img elements. */}
      <img
        src={imageSrc}
        alt={label}
        className="rounded-[1rem] object-cover shadow-xl shadow-black/20 transition duration-200 group-hover:shadow-2xl group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-4 group-focus-visible:outline-cyan-100"
      />
      {label}
    </a>
  );
}
