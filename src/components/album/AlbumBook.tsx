'use client';

import { useState, useCallback, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhotoEntry } from '@/lib/usePhotoData';
import AlbumCover from './AlbumCover';
import PhotoCarousel from './PhotoCarousel';
import NavigationArrows from './NavigationArrows';

export interface AlbumBookHandle {
  startSlideshow: () => void;
  stopSlideshow: () => void;
  openAlbum: () => void;
  goToCover: () => void;
}

interface AlbumBookProps {
  photos: PhotoEntry[];
  onOpen?: () => void;
  className?: string;
  onCoverChange?: (isCover: boolean) => void;
}

const AUTOPLAY_INTERVAL_MS = 1500;

const AlbumBook = forwardRef<AlbumBookHandle, AlbumBookProps>(function AlbumBook(
  { photos, onOpen, className, onCoverChange },
  ref
) {
  const [currentView, setCurrentView] = useState(0);

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const onCoverChangeRef = useRef(onCoverChange);
  onCoverChangeRef.current = onCoverChange;

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => {
      return b.sortDate.localeCompare(a.sortDate);
    });
  }, [photos]);

  const totalViews = 1 + sortedPhotos.length;

  const goTo = useCallback(
    (next: number, dir: 'forward' | 'backward') => {
      if (isTransitioning) {
        return;
      }

      setDirection(dir);
      setIsTransitioning(true);
      setCurrentView(next);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  useEffect(() => {
    if (currentView === 0 && isPlayingRef.current) {
      setIsPlaying(false);
    }
  }, [currentView]);

  useEffect(() => {
    onCoverChangeRef.current?.(currentView === 0);
  }, [currentView]);

  useEffect(() => {
    if (!isPlaying || currentView === 0 || isTransitioning) {
      return;
    }

    if (currentView >= totalViews - 1) {
      const id = setTimeout(() => {
        goTo(0, 'backward');
      }, AUTOPLAY_INTERVAL_MS);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => {
      goTo(currentView + 1, 'forward');
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearTimeout(id);
  }, [isPlaying, currentView, isTransitioning, totalViews, goTo]);

  useImperativeHandle(ref, () => ({
    startSlideshow() {
      setIsPlaying(true);
      if (currentView === 0) {
        goTo(1, 'forward');
      }
    },
    stopSlideshow() {
      setIsPlaying(false);
    },
    openAlbum() {
      if (currentView === 0) {
        goTo(1, 'forward');
        setIsPlaying(true);
        onOpenRef.current?.();
      }
    },
    goToCover() {
      if (currentView !== 0) {
        setIsPlaying(false);
        goTo(0, 'backward');
      }
    },
  }), [currentView, goTo]);

  function handleNext() {
    if (currentView < totalViews - 1) {
      setIsPlaying(false);
      goTo(currentView + 1, 'forward');
    }
  }

  function handlePrev() {
    if (currentView > 0) {
      setIsPlaying(false);
      goTo(currentView - 1, 'backward');
    }
  }

  function handleTransitionDone() {
    setIsTransitioning(false);
  }

  function handleTogglePlay() {
    setIsPlaying((prev) => {
      return !prev;
    });
  }

  const isCover = currentView === 0;

  const photoIndex = currentView - 1;

  const coverVariants = {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3, ease: 'easeIn' as const } },
  };

  const carouselVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <div
      className={className ?? 'relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl'}
      style={{ minHeight: 540 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCover ? (
          <motion.div
            key="cover"
            className="absolute inset-0"
            variants={coverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AlbumCover photos={sortedPhotos} />
          </motion.div>
        ) : (
          <motion.div
            key="carousel"
            className="absolute inset-0"
            variants={carouselVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PhotoCarousel
              photos={sortedPhotos}
              currentIndex={photoIndex}
              direction={direction}
              onTransitionDone={handleTransitionDone}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationArrows
        onPrev={handlePrev}
        onNext={handleNext}
        canGoPrev={currentView > 0}
        canGoNext={currentView < totalViews - 1}
      />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {Array.from({ length: totalViews }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full transition-colors duration-200"
            style={{ backgroundColor: i === currentView ? 'var(--theme-dot-active)' : 'var(--theme-dot-inactive)' }}
          />
        ))}
      </div>

      {!isCover && (
        <button
          onClick={handleTogglePlay}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md"
          style={{ background: `linear-gradient(to bottom right, var(--theme-accent-from), var(--theme-accent-to))` }}
          aria-label={isPlaying ? 'Pausar slideshow' : 'Retomar slideshow'}
        >
          <span className="text-sm leading-none flex items-center justify-center">{isPlaying ? '⏸' : '▶'}</span>
        </button>
      )}
    </div>
  );
});

export default AlbumBook;
