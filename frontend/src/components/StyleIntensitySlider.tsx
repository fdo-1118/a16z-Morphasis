interface StyleIntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const sans = { fontFamily: "'domaine-sans-text', 'Helvetica Neue', Arial, sans-serif" };

export function StyleIntensitySlider({ value, onChange }: StyleIntensitySliderProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label
          className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]"
          style={sans}
        >
          Style Intensity
        </label>
        <span className="text-xs font-mono text-zinc-400 tabular-nums">{value}%</span>
      </div>
      <div className="relative group">
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 pointer-events-none"
          style={{
            width: `${value}%`,
            background: 'linear-gradient(90deg, #002D2D, #336D5D)',
          }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-surface-4 -z-10" />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-400 [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-700" style={sans}>
        <span>Subtle</span>
        <span>Balanced</span>
        <span>Intense</span>
      </div>
    </div>
  );
}
