"use client";

import { useEffect, useState } from "react";

function formatStatusDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatStatusTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="status-bar" aria-label="Local system status">
      <div className="flex items-center gap-3">
        <time dateTime={now.toISOString()}>{formatStatusTime(now)}</time>
        <span className="text-slate-50/55" aria-hidden="true">
          |
        </span>
        <span>{formatStatusDate(now)}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5">
          <span className="wifi-indicator" aria-hidden="true">
            <span />
          </span>
          <span>Wi-Fi</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="battery-indicator" aria-hidden="true">
            <span />
          </span>
          <span>82%</span>
        </span>
      </div>
    </div>
  );
}
