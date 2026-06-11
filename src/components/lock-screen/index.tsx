"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ArrowUp, ChevronsUp, MapPin } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type WheelEvent,
} from "react";
import type { Profile } from "@/types";

interface LockScreenProps {
  profile: Profile;
  onEnter: () => void;
}

interface SwipeToUnlockProps {
  onEnter: () => void;
}

const MOBILE_DRAG_DISTANCE_THRESHOLD = 155;
const DESKTOP_DRAG_DISTANCE_THRESHOLD = 205;
const LOCK_MOVEMENT_RATIO = 0.7;

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getUnlockThreshold() {
  if (typeof window === "undefined") {
    return DESKTOP_DRAG_DISTANCE_THRESHOLD;
  }

  return window.innerWidth < 768
    ? MOBILE_DRAG_DISTANCE_THRESHOLD
    : DESKTOP_DRAG_DISTANCE_THRESHOLD;
}

export function LockScreen({ profile, onEnter }: LockScreenProps) {
  const [now, setNow] = useState(() => new Date());
  const [isLeaving, setIsLeaving] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const y = useMotionValue(0);
  const reducedOpacity = useMotionValue(1);
  const opacity = useTransform(y, [0, -95, -180, -360], [1, 0.9, 0.58, 0]);
  const blur = useTransform(y, [0, -180], [0, 2]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const wheelDistance = useRef(0);
  const wheelResetTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (wheelResetTimer.current) {
        window.clearTimeout(wheelResetTimer.current);
      }
    };
  }, []);

  const time = useMemo(() => formatTime(now), [now]);
  const date = useMemo(() => formatDate(now), [now]);

  const unlock = useCallback(() => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);

    if (prefersReducedMotion) {
      animate(reducedOpacity, 0, {
        duration: 0.28,
        ease: "easeOut",
        onComplete: onEnter,
      });
      return;
    }

    const viewportHeight =
      typeof window === "undefined" ? 720 : window.innerHeight;

    animate(y, -viewportHeight - 80, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onComplete: onEnter,
    });
  }, [isLeaving, onEnter, prefersReducedMotion, reducedOpacity, y]);

  const resetLockPosition = useCallback(() => {
    if (prefersReducedMotion) {
      y.set(0);
      return;
    }

    animate(y, 0, {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
    });
  }, [prefersReducedMotion, y]);

  const handlePan = (_event: PointerEvent, info: PanInfo) => {
    if (isLeaving) {
      return;
    }

    y.set(Math.min(0, info.offset.y * LOCK_MOVEMENT_RATIO));
  };

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    const draggedUpEnough = info.offset.y <= -getUnlockThreshold();

    if (draggedUpEnough) {
      unlock();
      return;
    }

    resetLockPosition();
  };

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    if (isLeaving) {
      return;
    }

    const upwardIntent = Math.abs(event.deltaY);

    if (upwardIntent < 4) {
      return;
    }

    wheelDistance.current += upwardIntent;
    y.set(
      Math.max(
        y.get() - Math.min(upwardIntent * LOCK_MOVEMENT_RATIO, 28),
        -getUnlockThreshold() * LOCK_MOVEMENT_RATIO,
      ),
    );

    if (wheelResetTimer.current) {
      window.clearTimeout(wheelResetTimer.current);
    }

    wheelResetTimer.current = window.setTimeout(() => {
      wheelDistance.current = 0;
      resetLockPosition();
    }, 180);

    if (wheelDistance.current >= getUnlockThreshold()) {
      if (wheelResetTimer.current) {
        window.clearTimeout(wheelResetTimer.current);
      }
      unlock();
    }
  };

  return (
    <motion.section
      className="fixed inset-0 z-30 isolate flex min-h-screen touch-none items-center justify-center overflow-hidden bg-emerald-950 px-5 py-7 text-white"
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onWheel={handleWheel}
      style={{ y, opacity: prefersReducedMotion ? reducedOpacity : opacity, filter }}
      aria-label="Portfolio lock screen"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.72),transparent_28%),radial-gradient(circle_at_80%_16%,rgba(236,72,153,0.58),transparent_28%),radial-gradient(circle_at_78%_78%,rgba(6,182,212,0.52),transparent_30%),linear-gradient(135deg,#052e22_0%,#12343b_48%,#361248_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18),transparent_34%,rgba(255,255,255,0.08)_62%,transparent)]" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 text-center md:grid md:grid-cols-[1fr_340px] md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-lg font-medium text-emerald-50/90" suppressHydrationWarning>
            {date}
          </p>
          <p
            className="mt-2 text-7xl font-semibold leading-none text-white drop-shadow-sm sm:text-8xl md:text-9xl"
            suppressHydrationWarning
          >
            {time}
          </p>
          <div className="mt-8 max-w-2xl">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-xl font-medium text-emerald-100">
              {profile.role}
            </p>
            <p className="mt-4 text-lg leading-8 text-white/85">
              {profile.introduction}.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-950/20 backdrop-blur-md">
              <MapPin aria-hidden="true" className="size-4" />
              {profile.location}
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-[340px] flex-col items-center">
          <div className="relative flex aspect-square w-48 items-center justify-center rounded-[2rem] border border-white/30 bg-white/20 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:w-60">
            <div className="absolute inset-4 rounded-[1.5rem] bg-[radial-gradient(circle_at_35%_28%,#fef3c7,transparent_28%),radial-gradient(circle_at_68%_36%,#f9a8d4,transparent_30%),linear-gradient(145deg,#a7f3d0,#67e8f9_52%,#c4b5fd)]" />
            <div
              aria-hidden="true"
              className="relative h-24 w-24 rounded-full bg-emerald-950/80 shadow-inner shadow-white/20 sm:h-32 sm:w-32"
            >
              <div className="absolute left-1/2 top-8 h-9 w-16 -translate-x-1/2 rounded-full bg-white/85 sm:top-10 sm:h-11 sm:w-20" />
              <div className="absolute bottom-4 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-full bg-white/85 sm:h-12 sm:w-28" />
            </div>
            <span className="sr-only">Illustrated placeholder avatar for Harsita</span>
          </div>

          <button
            type="button"
            onClick={unlock}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/20 px-5 py-3 text-base font-semibold text-white shadow-xl shadow-emerald-950/25 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/25 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            aria-label="Enter the portfolio home screen"
          >
            <ArrowUp aria-hidden="true" className="size-5" />
            Swipe up to explore
          </button>
          <SwipeToUnlock onEnter={unlock} />
        </div>
      </div>
    </motion.section>
  );
}

export function SwipeToUnlock({ onEnter }: SwipeToUnlockProps) {
  return (
    <button
      type="button"
      onClick={onEnter}
      className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white/90 transition duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-white motion-reduce:transition-none"
    >
      <ChevronsUp aria-hidden="true" className="size-4" />
      Drag, wheel, or press Enter
    </button>
  );
}
