interface NavigationArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export default function NavigationArrows({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: NavigationArrowsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        aria-label="Página anterior"
      >
        <span className="text-lg sm:text-xl leading-none">‹</span>
      </button>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        aria-label="Próxima página"
      >
        <span className="text-lg sm:text-xl leading-none">›</span>
      </button>
    </>
  );
}
