import React, { useRef, useState, useEffect } from 'react';
import { color, font, radius, shadow, spacing } from '../theme/tokens';
import { Icon } from './Icon';

function formatShort(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFull(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return d > start && d < end;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarMonthProps {
  year: number;
  month: number;
  start: Date | null;
  end: Date | null;
  onSelect: (d: Date) => void;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({ year, month, start, end, onSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div style={{ minWidth: 252 }}>
      <div style={{ textAlign: 'center', fontWeight: font.weight.bold, fontSize: font.size.m, color: color.raw.fgMax, marginBottom: 12 }}>
        {MONTHS[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.5, padding: '4px 0' }}>{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const isPast = date < today;
          const isStart = start ? isSameDay(date, start) : false;
          const isEnd = end ? isSameDay(date, end) : false;
          const inRange = isInRange(date, start, end);
          const isSelected = isStart || isEnd;

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => !isPast && onSelect(date)}
              style={{
                aspectRatio: '1',
                borderRadius: isSelected ? radius.max : radius.l,
                border: 'none',
                background: isSelected
                  ? color.raw.fgMax
                  : inRange
                    ? color.raw.bgSecondary
                    : 'transparent',
                color: isSelected ? color.raw.white : isPast ? color.raw.outlineVariant : color.raw.fgMax,
                fontSize: font.size.s,
                fontWeight: isSelected ? font.weight.bold : font.weight.regular,
                cursor: isPast ? 'not-allowed' : 'pointer',
                fontFamily: font.family,
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (!isPast && !isSelected) (e.currentTarget as HTMLElement).style.background = color.raw.bgSecondary; }}
              onMouseLeave={e => { if (!isPast && !isSelected) (e.currentTarget as HTMLElement).style.background = inRange ? color.raw.bgSecondary : 'transparent'; }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface DateRangeFieldProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  label?: string;
  singleDate?: boolean;
}

export const DateRangeField: React.FC<DateRangeFieldProps> = ({
  startDate,
  endDate,
  onChange,
  label,
  singleDate = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const today = new Date();
  const [viewMonth, setViewMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (d: Date) => {
    if (singleDate) { onChange(d, null); setOpen(false); return; }
    if (selecting === 'start' || (startDate && d < startDate)) {
      onChange(d, null);
      setSelecting('end');
    } else {
      onChange(startDate, d);
      setOpen(false);
    }
  };

  const prevMonth = () => setViewMonth(vm => vm.month === 0 ? { year: vm.year - 1, month: 11 } : { year: vm.year, month: vm.month - 1 });
  const nextMonth = () => setViewMonth(vm => vm.month === 11 ? { year: vm.year + 1, month: 0 } : { year: vm.year, month: vm.month + 1 });

  const nextView = viewMonth.month === 11
    ? { year: viewMonth.year + 1, month: 0 }
    : { year: viewMonth.year, month: viewMonth.month + 1 };

  const displayText = () => {
    if (singleDate) return startDate ? formatFull(startDate) : 'Select date';
    if (!startDate) return 'Add dates';
    if (!endDate) return `${formatShort(startDate)} – ?`;
    return `${formatShort(startDate)} – ${formatShort(endDate)}`;
  };

  const navBtnStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: radius.max, border: `1px solid ${color.raw.outlineVariant}`,
    background: 'transparent', color: color.raw.fgMax, fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: font.family,
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button
        type="button"
        onClick={() => { setOpen(v => !v); setSelecting('start'); }}
        style={{
          width: '100%', minHeight: 56, background: 'transparent', border: 'none',
          padding: `${spacing.raw.s}px ${spacing.raw.m}px`, textAlign: 'left',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label ?? (singleDate ? 'Date' : 'Check-in – Check-out')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="calendar" size={16} color={color.raw.fgMax} />
          <span style={{ fontSize: font.size.m, color: startDate ? color.raw.fgMax : color.raw.fgMax, opacity: startDate ? 1 : 0.4, fontWeight: font.weight.medium, fontFamily: font.family }}>
            {displayText()}
          </span>
        </div>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          background: color.raw.white, borderRadius: radius.bexM,
          boxShadow: shadow.high, border: `1px solid ${color.raw.outlineVariant}`,
          zIndex: 200, padding: `${spacing.raw.l}px`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.raw.m }}>
            <button type="button" onClick={prevMonth} style={navBtnStyle}>‹</button>
            <button type="button" onClick={nextMonth} style={navBtnStyle}>›</button>
          </div>
          <div style={{ display: 'flex', gap: spacing.raw.xl }}>
            <CalendarMonth year={viewMonth.year} month={viewMonth.month} start={startDate} end={endDate} onSelect={handleSelect} />
            {!singleDate && (
              <CalendarMonth year={nextView.year} month={nextView.month} start={startDate} end={endDate} onSelect={handleSelect} />
            )}
          </div>
          {!singleDate && (
            <div style={{ marginTop: spacing.raw.s + 4, fontSize: font.size.s, color: color.raw.fgMax, opacity: 0.5, textAlign: 'center' }}>
              {selecting === 'start' ? 'Select check-in date' : 'Select check-out date'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
