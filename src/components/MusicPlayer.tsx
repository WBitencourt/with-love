'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import { PhotoEntry } from '@/lib/usePhotoData';
import AlbumBook, { AlbumBookHandle } from '@/components/album/AlbumBook';

interface Song {
  readonly src: string;
  readonly title: string;
}

interface MusicPlayerProps {
  songs: readonly Song[];
  themeId: string;
  photos: PhotoEntry[];
}

interface TimerUnit {
  value: number;
  label: string;
}

const RELATIONSHIP_START = new Date('2022-11-05T11:00:00.000Z');

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);

  const s = Math.floor(seconds % 60);

  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer({ songs, themeId, photos }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [isAlbumCover, setIsAlbumCover] = useState(true);

  const [timerUnits, setTimerUnits] = useState<TimerUnit[]>([
    { value: 0, label: 'anos' },
    { value: 0, label: 'meses' },
    { value: 0, label: 'dias' },
    { value: 0, label: 'horas' },
    { value: 0, label: 'min' },
    { value: 0, label: 'seg' },
  ]);

  const audioRef = useRef<HTMLAudioElement>(null);

  const wasPlayingRef = useRef(false);

  const albumRef = useRef<AlbumBookHandle>(null);

  const startDate = useMemo(() => RELATIONSHIP_START, []);

  useEffect(() => {
    const update = () => {
      const dur = moment.duration(moment().diff(startDate));
      setTimerUnits([
        { value: dur.years(), label: 'anos' },
        { value: dur.months(), label: 'meses' },
        { value: dur.days(), label: 'dias' },
        { value: dur.hours(), label: 'horas' },
        { value: dur.minutes(), label: 'min' },
        { value: dur.seconds(), label: 'seg' },
      ]);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    wasPlayingRef.current = false;
  }, [themeId]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.load();
    setCurrentTime(0);

    if (wasPlayingRef.current) {
      audio.play().catch(() => {});
    }
  }, [currentIndex, themeId]);

  function handleAlbumOpen() {
    wasPlayingRef.current = true;
    audioRef.current?.play().catch(() => {});
  }

  function handleCoverChange(isCover: boolean) {
    setIsAlbumCover(isCover);
  }

  function handleOpenAlbum() {
    albumRef.current?.openAlbum();
  }

  function handleGoToStart() {
    albumRef.current?.goToCover();
  }

  function handlePlayPause() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function handlePrev() {
    wasPlayingRef.current = !(audioRef.current?.paused ?? true);
    setCurrentIndex((prev) => {
      return prev - 1;
    });
  }

  function handleNext() {
    wasPlayingRef.current = !(audioRef.current?.paused ?? true);
    setCurrentIndex((prev) => {
      return prev + 1;
    });
  }

  function handleAudioPlay() {
    setIsPlaying(true);
    wasPlayingRef.current = true;
  }

  function handleAudioPause() {
    setIsPlaying(false);
  }

  function handleAudioEnded() {
    wasPlayingRef.current = true;
    setCurrentIndex((prev) => {
      return (prev + 1) % songs.length;
    });
  }

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current?.currentTime ?? 0);
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current?.duration ?? 0);
  }

  function handleSeek(event: ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }

    setCurrentTime(value);
  }

  const currentSong = songs[currentIndex];

  const canGoPrev = currentIndex > 0;

  const canGoNext = currentIndex < songs.length - 1;

  const remaining = duration > 0 ? duration - currentTime : 0;

  const accentGradient = `linear-gradient(to bottom right, var(--theme-accent-from), var(--theme-accent-to))`;

  return (
    <div className="bg-album-paper backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl w-full">
      <audio
        key={`${themeId}-${currentIndex}`}
        ref={audioRef}
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={currentSong.src} />
      </audio>

      <AlbumBook
        ref={albumRef}
        photos={photos}
        onOpen={handleAlbumOpen}
        onCoverChange={handleCoverChange}
        className="relative w-full overflow-hidden rounded-t-2xl"
      />

      <div className="p-5 flex flex-col gap-4">
        <div>
          <p className="text-xl font-bold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>
            {currentSong.title}
          </p>

          <p className="text-sm mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
            {currentIndex + 1} / {songs.length}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            step={0.1}
            onChange={handleSeek}
            className="w-full h-1 cursor-pointer rounded-full"
            style={{ accentColor: 'var(--theme-accent-from)' }}
            aria-label="Progresso"
          />

          <div className="flex justify-between">
            <span className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              {formatTime(currentTime)}
            </span>

            <span className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              -{formatTime(remaining)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          {songs.length > 1 && (
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className="w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-sm disabled:opacity-40 disabled:pointer-events-none"
              style={{ background: accentGradient }}
              aria-label="Música anterior"
            >
              <span className="text-lg leading-none">‹</span>
            </button>
          )}

          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full text-white flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            style={{ background: accentGradient }}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            <span className="text-2xl leading-none">{isPlaying ? '⏸' : '▶'}</span>
          </button>

          {songs.length > 1 && (
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-sm disabled:opacity-40 disabled:pointer-events-none"
              style={{ background: accentGradient }}
              aria-label="Próxima música"
            >
              <span className="text-lg leading-none">›</span>
            </button>
          )}
        </div>

        <div className="pt-3" style={{ borderTop: '1px solid var(--theme-timer-border)' }}>
          <p
            className="text-[10px] uppercase tracking-widest text-center mb-2"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            Juntos há
          </p>

          <div className="flex flex-wrap justify-center gap-1.5">
            {timerUnits.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-md px-2 py-1 min-w-[36px]"
                style={{ backgroundColor: 'var(--theme-timer-bg)', border: '1px solid var(--theme-timer-border)' }}
              >
                <span
                  className="text-base font-serif font-semibold leading-none [font-variant-numeric:tabular-nums]"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  {String(value).padStart(2, '0')}
                </span>

                <span className="text-[9px] leading-tight mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAlbumCover ? (
        <button
          onClick={handleOpenAlbum}
          className="w-full py-4 text-white font-medium text-base tracking-wide transition-all duration-200 hover:brightness-110 active:brightness-95 cursor-pointer"
          style={{ background: accentGradient }}
          aria-label="Abrir álbum de fotos"
        >
          Abrir Álbum →
        </button>
      ) : (
        <button
          onClick={handleGoToStart}
          className="w-full py-4 text-white font-medium text-base tracking-wide transition-all duration-200 hover:brightness-110 active:brightness-95 cursor-pointer"
          style={{ background: '#6b7280' }}
          aria-label="Voltar ao início"
        >
          Voltar ao início
        </button>
      )}
    </div>
  );
}
