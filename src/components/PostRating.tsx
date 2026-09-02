interface PostRatingProps {
  value: number;
  count: number;
}

function StarIcon({ fill, index }: { fill: number; index: number }) {
  const clipped = Math.max(0, Math.min(1, fill));
  const gradId = `post-star-${index}`;

  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
          <stop offset={`${clipped * 100}%`} stopColor="#fbbc04" />
          <stop offset={`${clipped * 100}%`} stopColor="#5f6368" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M10 1.5l2.35 4.76 5.25.76-3.8 3.7.9 5.24L10 13.77l-4.7 2.47.9-5.24-3.8-3.7 5.25-.76L10 1.5z"
      />
    </svg>
  );
}

export default function PostRating({ value, count }: PostRatingProps) {
  const display = Math.round(value * 10) / 10;

  return (
    <section
      className="mt-8 border-t border-border/80 pt-6"
      aria-label={`Rated ${display} out of 5 from ${count.toLocaleString("en-US")} reviews`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted sm:text-[0.95rem]">
        <span className="font-medium text-foreground">{display.toFixed(1)}</span>
        <span className="flex items-center gap-px" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} index={index} fill={display - index} />
          ))}
        </span>
        <span className="text-muted">
          ({count.toLocaleString("en-US")})
        </span>
        <span aria-hidden="true" className="text-muted-dim">
          ·
        </span>
        <span>Free</span>
        <span aria-hidden="true" className="text-muted-dim">
          ·
        </span>
        <span>Android</span>
        <span aria-hidden="true" className="text-muted-dim">
          ·
        </span>
        <span>Game</span>
      </div>
    </section>
  );
}
