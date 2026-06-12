import Image from 'next/image';

interface PolaroidPhotoProps {
  src: string;
  date: string;
  location: string;
  rotation?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PolaroidPhoto({
  src,
  date,
  location,
  rotation = 0,
  size = 'md',
}: PolaroidPhotoProps) {
  const dimensionsMap = {
    sm: { width: 140, photoHeight: 175, captionHeight: 'h-14', padding: 'p-2', bottomPad: 'pb-4', textSize: 'text-[10px]' },
    md: { width: 260, photoHeight: 320, captionHeight: 'h-24', padding: 'p-3', bottomPad: 'pb-6', textSize: 'text-xs' },
    lg: { width: 280, photoHeight: 330, captionHeight: 'h-24', padding: 'p-3', bottomPad: 'pb-6', textSize: 'text-xs' },
  };

  const dimensions = dimensionsMap[size];

  return (
    <div
      className="bg-white shadow-2xl inline-block select-none"
      style={{
        transform: `rotate(${rotation}deg)`,
        width: dimensions.width,
        padding: size === 'sm' ? 7 : 10,
        paddingBottom: 0,
      }}
    >
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ height: dimensions.photoHeight }}
      >
        <Image
          src={src}
          alt={`${date} — ${location}`}
          fill
          className="object-cover"
          sizes={`${dimensions.width}px`}
        />
      </div>
      <div className={`flex flex-col items-center justify-center gap-0.5 ${dimensions.captionHeight} ${dimensions.bottomPad}`}>
        <span className={`${dimensions.textSize} font-medium text-gray-600 text-center leading-tight`}>
          {date}
        </span>
        <span className={`${dimensions.textSize} text-gray-400 italic text-center leading-tight`}>
          {location}
        </span>
      </div>
    </div>
  );
}
