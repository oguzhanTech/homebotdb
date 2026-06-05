export function RobotImagePlaceholder({
  name,
  className = "",
  compact = false,
}: {
  name: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      aria-label={`${name} image placeholder`}
    >
      {!compact && (
        <>
          <div className="absolute h-[80%] w-[80%] rounded-full border border-line" />
          <div className="absolute h-[60%] w-[60%] rounded-full border border-dashed border-line/80" />
        </>
      )}
      <div className="relative flex h-[70%] w-[45%] flex-col items-center">
        <div className="h-[22%] w-[55%] rounded-[40%] border-[3px] border-[#e7e9ec] bg-gradient-to-br from-[#111] to-[#1d2229]" />
        <div className="mt-1 h-[3%] w-[20%] rounded bg-[#12151b]" />
        <div className="mt-1 h-[35%] w-full rounded-[40%] border border-line/20 bg-gradient-to-br from-white to-[#dfe3e9]" />
        <div className="mt-1 h-[25%] w-[70%] rounded-b-[40%] bg-gradient-to-b from-[#111] to-[#232a34]" />
      </div>
      {!compact && (
        <span className="absolute bottom-2 text-[9px] font-bold uppercase tracking-widest text-muted">
          PNG
        </span>
      )}
    </div>
  );
}
