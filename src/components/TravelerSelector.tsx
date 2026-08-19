import React, { useState, useRef, useEffect } from 'react';
import { color, radius, shadow, font, spacing } from '../theme/tokens';
import { Icon } from './Icon';

export interface TravelerCounts {
  adults: number;
  children: number;
  infants: number;
  rooms: number;
}

interface CounterRowProps {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

const CounterRow: React.FC<CounterRowProps> = ({ label, sublabel, value, min, max, onChange }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.raw.s}px 0`,
    borderBottom: `1px solid ${color.raw.outlineVariant}`,
  }}>
    <div>
      <div style={{ fontSize: font.size.m, fontWeight: font.weight.medium, color: color.raw.fgMax }}>{label}</div>
      {sublabel && <div style={{ fontSize: font.size.s, color: color.raw.fgMax, opacity: 0.6, marginTop: 2 }}>{sublabel}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.raw.m }}>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.max,
          border: `1px solid ${value <= min ? color.raw.outlineVariant : color.raw.fgMax}`,
          background: 'transparent',
          color: value <= min ? color.raw.outlineVariant : color.raw.fgMax,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <Icon name="minus" size={16} />
      </button>
      <span style={{
        width: 24,
        textAlign: 'center',
        fontSize: font.size.l,
        fontWeight: font.weight.bold,
        color: color.raw.fgMax,
      }}>{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.max,
          border: `1px solid ${value >= max ? color.raw.outlineVariant : color.raw.fgMax}`,
          background: 'transparent',
          color: value >= max ? color.raw.outlineVariant : color.raw.fgMax,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  </div>
);

interface TravelerSelectorProps {
  value: TravelerCounts;
  onChange: (v: TravelerCounts) => void;
  showRooms?: boolean;
}

export const TravelerSelector: React.FC<TravelerSelectorProps> = ({
  value,
  onChange,
  showRooms = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = () => {
    const parts: string[] = [`${value.adults} adult${value.adults !== 1 ? 's' : ''}`];
    if (value.children > 0) parts.push(`${value.children} child${value.children !== 1 ? 'ren' : ''}`);
    if (value.infants > 0) parts.push(`${value.infants} infant${value.infants !== 1 ? 's' : ''}`);
    if (showRooms) parts.push(`${value.rooms} room${value.rooms !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 56,
          background: 'transparent',
          border: 'none',
          padding: `${spacing.raw.s}px ${spacing.raw.m}px`,
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {showRooms ? 'Travelers & rooms' : 'Travelers'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="travelers" size={16} color={color.raw.fgMax} />
          <span style={{ fontSize: font.size.m, color: color.raw.fgMax, fontWeight: font.weight.medium, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label()}
          </span>
        </div>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          minWidth: 290,
          background: color.raw.white,
          borderRadius: radius.bexM,
          boxShadow: shadow.high,
          border: `1px solid ${color.raw.outlineVariant}`,
          padding: `${spacing.raw.s}px ${spacing.raw.l}px ${spacing.raw.m}px`,
          zIndex: 200,
        }}>
          <CounterRow label="Adults" sublabel="Age 18+" value={value.adults} min={1} max={14} onChange={v => onChange({ ...value, adults: v })} />
          <CounterRow label="Children" sublabel="Age 2–17" value={value.children} min={0} max={6} onChange={v => onChange({ ...value, children: v })} />
          <CounterRow label="Infants" sublabel="Under 2" value={value.infants} min={0} max={6} onChange={v => onChange({ ...value, infants: v })} />
          {showRooms && (
            <CounterRow label="Rooms" value={value.rooms} min={1} max={8} onChange={v => onChange({ ...value, rooms: v })} />
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              marginTop: spacing.raw.m,
              width: '100%',
              height: 44,
              borderRadius: radius.max,
              border: 'none',
              background: color.raw.fgMax,
              color: color.raw.white,
              fontSize: font.size.m,
              fontWeight: font.weight.bold,
              cursor: 'pointer',
              fontFamily: font.family,
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};
