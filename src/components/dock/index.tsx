import type { DockItemContent, FolderId } from "@/types";

interface DockProps {
  items: DockItemContent[];
  onOpenFolder: (folderId: FolderId, trigger: HTMLButtonElement) => void;
}

export function Dock({ items, onOpenFolder }: DockProps) {
  return (
    <nav
      aria-label="Portfolio folders"
      className="dock-wrapper fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-3 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]"
    >
      <div className="dock grid w-fit grid-cols-3 gap-4 rounded-[1.2rem] border border-white/15 bg-white/10 px-4 py-3 shadow-2xl shadow-emerald-950/25 backdrop-blur-2xl sm:gap-6 sm:px-6 sm:py-3.5">
        {items.map((item) => (
          <DockItem key={item.id} item={item} onOpenFolder={onOpenFolder} />
        ))}
      </div>
    </nav>
  );
}

export function DockItem({
  item,
  onOpenFolder,
}: {
  item: DockItemContent;
  onOpenFolder: (folderId: FolderId, trigger: HTMLButtonElement) => void;
}) {
  const imageSrc = `/placeholders/dock/${item.id}-placeholder.svg`;

  return (
    <button
      type="button"
      className="dock-item group flex min-w-[74px] flex-col items-center justify-center gap-1.5 border-0 bg-transparent px-1 py-1 text-xs font-medium text-slate-50 transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-cyan-100 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-w-[90px] sm:gap-2"
      aria-label={`Open ${item.label} folder`}
      onClick={(event) => onOpenFolder(item.id, event.currentTarget)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Dock placeholders must render as image assets. */}
      <img
        src={imageSrc}
        alt=""
        className="size-12 rounded-[0.9rem] object-cover shadow-lg shadow-black/20 transition duration-200 group-hover:shadow-xl motion-reduce:transition-none sm:size-[58px] sm:rounded-[15px]"
      />
      <span>{item.label}</span>
    </button>
  );
}
