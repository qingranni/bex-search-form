import React, { useRef, useState, useEffect } from 'react';
import { color, font, radius, shadow, spacing } from '../theme/tokens';
import { Icon } from './Icon';

const SUGGESTIONS: Record<string, string[]> = {
  '': [
    'New York, United States',
    'London, United Kingdom',
    'Paris, France',
    'Tokyo, Japan',
    'Los Angeles, United States',
    'Dubai, United Arab Emirates',
    'Barcelona, Spain',
    'Rome, Italy',
  ],
  n: ['New York, United States', 'Nashville, United States', 'Naples, Italy', 'Nassau, Bahamas'],
  l: ['London, United Kingdom', 'Las Vegas, United States', 'Lisbon, Portugal', 'Lima, Peru'],
  p: ['Paris, France', 'Prague, Czech Republic', 'Porto, Portugal', 'Phuket, Thailand'],
  t: ['Tokyo, Japan', 'Toronto, Canada', 'Tulum, Mexico', 'Tel Aviv, Israel'],
  d: ['Dubai, United Arab Emirates', 'Denver, United States', 'Dublin, Ireland', 'Dubrovnik, Croatia'],
};

function getSuggestions(query: string): string[] {
  const q = query.trim().toLowerCase();
  const key = Object.keys(SUGGESTIONS).find(k => k && q.startsWith(k));
  const base = key ? SUGGESTIONS[key] : SUGGESTIONS[''];
  return base.filter(s => s.toLowerCase().includes(q) || q === '').slice(0, 5);
}

interface LocationFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}

export const LocationField: React.FC<LocationFieldProps> = ({
  label,
  placeholder = 'Where to?',
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const suggestions = getSuggestions(query);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value]);

  const select = (s: string) => {
    onChange(s);
    setQuery(s);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div
        style={{
          padding: `${spacing.raw.s}px ${spacing.raw.m}px ${spacing.raw.s}px ${spacing.raw.m}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          minHeight: 56,
          cursor: 'text',
        }}
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
      >
        <span style={{ fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="location" size={16} color={color.raw.fgMax} />
          <input
            ref={inputRef}
            value={query}
            placeholder={placeholder}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: font.size.m,
              color: color.raw.fgMax,
              fontWeight: font.weight.medium,
              fontFamily: font.family,
              width: '100%',
              minWidth: 0,
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear"
              onClick={e => { e.stopPropagation(); select(''); inputRef.current?.focus(); }}
              style={{ background: 'none', border: 'none', padding: 0, color: color.raw.fgMax, opacity: 0.5, display: 'flex', cursor: 'pointer' }}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          minWidth: 260,
          background: color.raw.white,
          borderRadius: radius.bexM,
          boxShadow: shadow.high,
          border: `1px solid ${color.raw.outlineVariant}`,
          zIndex: 200,
          overflow: 'hidden',
        }}>
          {suggestions.map(s => (
            <button
              key={s}
              type="button"
              onMouseDown={() => select(s)}
              style={{
                width: '100%',
                padding: `${spacing.raw.s + 2}px ${spacing.raw.m}px`,
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: font.size.m,
                color: color.raw.fgMax,
                fontFamily: font.family,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.raw.s + 2,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = color.raw.bgSecondary)}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name="location" size={16} color={color.raw.fgMax} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
