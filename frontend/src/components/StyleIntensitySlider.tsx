interface StyleIntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function StyleIntensitySlider({ value, onChange }: StyleIntensitySliderProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Style Intensity</label>
        <span className="text-xs font-mono text-violet-400 tabular-nums">{value}%</span>
      </div>
      <div className="relative group">
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 rounded-full pointer-events-none"
          style={{
            width: `${value}%`,
            background: 'linear-gradient(90deg, #4c1d95, #7c3aed, #06b6d4)',
          }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full rounded-full bg-surface-3 -z-10" />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-500 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-violet-500 [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-700">
        <span>Subtle</span>
        <span>Balanced</span>
        <span>Intense</span>
      </div>
    </div>
  );
}
