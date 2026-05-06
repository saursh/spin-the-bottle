import React from 'react';

interface OptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  index: number;
  placeholder?: string;
  disabled?: boolean;
}

export const OptionInput: React.FC<OptionInputProps> = ({ value, onChange, onRemove, index, placeholder, disabled }) => {
  const isEmpty = !value && !disabled;

  return (
    <div className="relative group w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-[#C5A059] font-mono group-hover:scale-110 transition-transform">
        {String(index + 1).padStart(2, '0')}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Open Slot"}
        disabled={disabled}
        className={`
          w-full py-4 pl-12 pr-12 text-sm transition-all focus:outline-none
          ${isEmpty 
            ? 'bg-transparent border border-dashed border-white/10 text-white/30 italic rounded-sm' 
            : 'bg-white/5 border border-white/10 text-white/90 rounded-sm focus:border-[#C5A059]/50 shadow-inner'}
          disabled:opacity-50
        `}
      />
      {value && !disabled && (
        <button
          onClick={onRemove}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C5A059] transition-colors"
        >
          <span className="text-[10px] uppercase tracking-tighter">Remove</span>
        </button>
      )}
    </div>
  );
};
