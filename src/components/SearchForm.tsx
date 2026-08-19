import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { color, radius, shadow, font, spacing } from '../theme/tokens';
import { Icon } from './Icon';
import { LocationField } from './LocationField';
import { DateRangeField } from './DateField';
import { TravelerSelector, type TravelerCounts } from './TravelerSelector';

// ─── LOB definitions ──────────────────────────────────────────────────────────

type LobId = 'stays' | 'flights' | 'cars' | 'packages' | 'things-to-do' | 'cruises';

interface Lob { id: LobId; label: string }

const LOBS: Lob[] = [
  { id: 'stays',        label: 'Stays'        },
  { id: 'flights',      label: 'Flights'       },
  { id: 'cars',         label: 'Cars'          },
  { id: 'packages',     label: 'Packages'      },
  { id: 'things-to-do', label: 'Things to do'  },
  { id: 'cruises',      label: 'Cruises'       },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const Divider: React.FC = () => (
  <div style={{ width: 1, alignSelf: 'stretch', margin: '10px 0', background: color.raw.outlineVariant, flexShrink: 0 }} />
);

// BEX primary button: yellow bg, near-black text, pill shape
const SubmitButton: React.FC<{ label?: string }> = ({ label = 'Search' }) => (
  <motion.button
    type="submit"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    style={{
      height: 48,
      paddingInline: 24,
      borderRadius: radius.max,
      border: 'none',
      background: color.raw.bgBrand,           // --bex-btn-primary: #fddb32
      color: color.raw.fgMax,                  // --bex-fg-on-brand: #0c0e1c
      fontSize: font.size.m,
      fontWeight: font.weight.bold,
      fontFamily: font.family,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
      letterSpacing: '-0.01em',
      boxShadow: `0 2px 8px rgba(253,219,50,0.4)`,
    }}
  >
    <Icon name="search" size={17} color={color.raw.fgMax} />
    {label}
  </motion.button>
);

const FieldCell: React.FC<{ children: React.ReactNode; grow?: boolean }> = ({ children, grow }) => (
  <div style={{ display: 'flex', alignItems: 'stretch', flex: grow ? 1 : undefined, minWidth: 0 }}>
    {children}
  </div>
);

// ─── Stays ────────────────────────────────────────────────────────────────────

interface StaysState {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  travelers: TravelerCounts;
}

const StaysForm: React.FC = () => {
  const [state, setState] = useState<StaysState>({
    destination: '', startDate: null, endDate: null,
    travelers: { adults: 2, children: 0, infants: 0, rooms: 1 },
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FieldCell grow>
        <LocationField label="Going to" placeholder="Where are you going?" value={state.destination} onChange={v => setState(s => ({ ...s, destination: v }))} />
      </FieldCell>
      <Divider />
      <FieldCell grow>
        <DateRangeField startDate={state.startDate} endDate={state.endDate} onChange={(s, e) => setState(st => ({ ...st, startDate: s, endDate: e }))} label="Check-in – Check-out" />
      </FieldCell>
      <Divider />
      <FieldCell>
        <TravelerSelector value={state.travelers} onChange={v => setState(s => ({ ...s, travelers: v }))} showRooms />
      </FieldCell>
      <div style={{ padding: `0 ${spacing.raw.s}px 0 ${spacing.raw.m}px` }}>
        <SubmitButton />
      </div>
    </div>
  );
};

// ─── Flights ──────────────────────────────────────────────────────────────────

type FlightType = 'roundtrip' | 'oneway' | 'multicity';
type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';
const CABIN_LABELS: Record<CabinClass, string> = { economy: 'Economy', 'premium-economy': 'Premium Economy', business: 'Business', first: 'First Class' };

interface FlightsState {
  type: FlightType;
  cabin: CabinClass;
  origin: string;
  destination: string;
  departDate: Date | null;
  returnDate: Date | null;
  travelers: TravelerCounts;
}

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '3px 12px',
  borderRadius: radius.max,
  border: `1px solid ${active ? color.raw.fgMax : color.raw.outlineVariant}`,
  background: active ? color.raw.fgMax : 'transparent',
  color: active ? color.raw.white : color.raw.fgMax,
  fontSize: font.size.s,
  fontWeight: font.weight.medium,
  fontFamily: font.family,
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
  transition: 'all 0.15s ease',
});

const FlightsForm: React.FC = () => {
  const [state, setState] = useState<FlightsState>({
    type: 'roundtrip', cabin: 'economy', origin: '', destination: '',
    departDate: null, returnDate: null,
    travelers: { adults: 1, children: 0, infants: 0, rooms: 1 },
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.raw.s + 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.raw.s }}>
        {(['roundtrip', 'oneway', 'multicity'] as FlightType[]).map(t => (
          <button key={t} type="button" onClick={() => setState(s => ({ ...s, type: t }))} style={chipStyle(state.type === t)}>
            {t === 'roundtrip' ? 'Round trip' : t === 'oneway' ? 'One way' : 'Multi-city'}
          </button>
        ))}
        <div style={{ width: 1, height: 18, background: color.raw.outlineVariant }} />
        <select value={state.cabin} onChange={e => setState(s => ({ ...s, cabin: e.target.value as CabinClass }))}
          style={{ border: 'none', background: 'transparent', fontSize: font.size.s, fontWeight: font.weight.medium, color: color.raw.fgMax, cursor: 'pointer', outline: 'none', fontFamily: font.family }}>
          {(Object.entries(CABIN_LABELS) as [CabinClass, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FieldCell grow>
          <LocationField label="From" placeholder="Flying from?" value={state.origin} onChange={v => setState(s => ({ ...s, origin: v }))} />
        </FieldCell>
        <motion.button
          type="button" aria-label="Swap" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92, rotate: 180 }}
          onClick={() => setState(s => ({ ...s, origin: s.destination, destination: s.origin }))}
          style={{
            width: 34, height: 34, borderRadius: radius.max, border: `1px solid ${color.raw.outlineVariant}`,
            background: color.raw.white, color: color.raw.fgMax, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', flexShrink: 0, zIndex: 1, margin: '0 -4px',
            boxShadow: shadow.medium,
          }}
        >
          <Icon name="swap" size={17} />
        </motion.button>
        <FieldCell grow>
          <LocationField label="To" placeholder="Flying to?" value={state.destination} onChange={v => setState(s => ({ ...s, destination: v }))} />
        </FieldCell>
        <Divider />
        <FieldCell grow>
          <DateRangeField
            startDate={state.departDate} endDate={state.type === 'oneway' ? null : state.returnDate}
            onChange={(s, e) => setState(st => ({ ...st, departDate: s, returnDate: e }))}
            label={state.type === 'oneway' ? 'Departure' : 'Depart – Return'} singleDate={state.type === 'oneway'}
          />
        </FieldCell>
        <Divider />
        <FieldCell>
          <TravelerSelector value={state.travelers} onChange={v => setState(s => ({ ...s, travelers: v }))} />
        </FieldCell>
        <div style={{ padding: `0 ${spacing.raw.s}px 0 ${spacing.raw.m}px` }}>
          <SubmitButton label="Search flights" />
        </div>
      </div>
    </div>
  );
};

// ─── Cars ─────────────────────────────────────────────────────────────────────

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2), m = i % 2 === 0 ? '00' : '30';
  const ampm = h < 12 ? 'AM' : 'PM', dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${dh}:${m} ${ampm}`;
});

interface CarsState {
  pickup: string; dropoff: string; sameDropoff: boolean;
  pickupDate: Date | null; dropoffDate: Date | null;
  pickupTime: string; dropoffTime: string;
}

const CarsForm: React.FC = () => {
  const [state, setState] = useState<CarsState>({
    pickup: '', dropoff: '', sameDropoff: true, pickupDate: null, dropoffDate: null,
    pickupTime: '10:00 AM', dropoffTime: '10:00 AM',
  });
  const timeSelectStyle: React.CSSProperties = {
    border: `1px solid ${color.raw.outlineVariant}`, borderRadius: radius.bexM,
    padding: '4px 8px', fontSize: font.size.s, color: color.raw.fgMax,
    background: color.raw.white, cursor: 'pointer', fontFamily: font.family,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.raw.s + 4 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: spacing.raw.s, fontSize: font.size.s, color: color.raw.fgMax, cursor: 'pointer', userSelect: 'none' }}>
        <input type="checkbox" checked={!state.sameDropoff} onChange={e => setState(s => ({ ...s, sameDropoff: !e.target.checked }))} style={{ accentColor: color.raw.fgMax, width: 16, height: 16 }} />
        Return car to a different location
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FieldCell grow>
          <LocationField label="Pick-up location" placeholder="City, airport or address" value={state.pickup} onChange={v => setState(s => ({ ...s, pickup: v }))} />
        </FieldCell>
        {!state.sameDropoff && (<><Divider /><FieldCell grow><LocationField label="Drop-off location" placeholder="City, airport or address" value={state.dropoff} onChange={v => setState(s => ({ ...s, dropoff: v }))} /></FieldCell></>)}
        <Divider />
        <FieldCell grow>
          <div style={{ padding: `${spacing.raw.s}px ${spacing.raw.m}px`, minHeight: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pick-up</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.raw.s }}>
              <DateRangeField startDate={state.pickupDate} endDate={null} onChange={d => setState(s => ({ ...s, pickupDate: d }))} singleDate label="" />
              <select value={state.pickupTime} onChange={e => setState(s => ({ ...s, pickupTime: e.target.value }))} style={timeSelectStyle}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </FieldCell>
        <Divider />
        <FieldCell grow>
          <div style={{ padding: `${spacing.raw.s}px ${spacing.raw.m}px`, minHeight: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Drop-off</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.raw.s }}>
              <DateRangeField startDate={state.dropoffDate} endDate={null} onChange={d => setState(s => ({ ...s, dropoffDate: d }))} singleDate label="" />
              <select value={state.dropoffTime} onChange={e => setState(s => ({ ...s, dropoffTime: e.target.value }))} style={timeSelectStyle}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </FieldCell>
        <div style={{ padding: `0 ${spacing.raw.s}px 0 ${spacing.raw.m}px` }}>
          <SubmitButton label="Search cars" />
        </div>
      </div>
    </div>
  );
};

// ─── Packages ─────────────────────────────────────────────────────────────────

type PackageType = 'flight-hotel' | 'flight-hotel-car' | 'hotel-car';
const PKG_LABELS: Record<PackageType, string> = { 'flight-hotel': 'Flight + Hotel', 'flight-hotel-car': 'Flight + Hotel + Car', 'hotel-car': 'Hotel + Car' };

interface PackagesState {
  pkgType: PackageType; origin: string; destination: string;
  startDate: Date | null; endDate: Date | null; travelers: TravelerCounts;
}

const PackagesForm: React.FC = () => {
  const [state, setState] = useState<PackagesState>({
    pkgType: 'flight-hotel', origin: '', destination: '', startDate: null, endDate: null,
    travelers: { adults: 2, children: 0, infants: 0, rooms: 1 },
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.raw.s + 4 }}>
      <div style={{ display: 'flex', gap: spacing.raw.s }}>
        {(Object.entries(PKG_LABELS) as [PackageType, string][]).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setState(s => ({ ...s, pkgType: k }))} style={chipStyle(state.pkgType === k)}>{v}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {state.pkgType !== 'hotel-car' && (<><FieldCell grow><LocationField label="Leaving from" placeholder="City or airport" value={state.origin} onChange={v => setState(s => ({ ...s, origin: v }))} /></FieldCell><Divider /></>)}
        <FieldCell grow><LocationField label="Going to" placeholder="City or hotel" value={state.destination} onChange={v => setState(s => ({ ...s, destination: v }))} /></FieldCell>
        <Divider />
        <FieldCell grow><DateRangeField startDate={state.startDate} endDate={state.endDate} onChange={(s, e) => setState(st => ({ ...st, startDate: s, endDate: e }))} label="Depart – Return" /></FieldCell>
        <Divider />
        <FieldCell><TravelerSelector value={state.travelers} onChange={v => setState(s => ({ ...s, travelers: v }))} showRooms /></FieldCell>
        <div style={{ padding: `0 ${spacing.raw.s}px 0 ${spacing.raw.m}px` }}><SubmitButton label="Search packages" /></div>
      </div>
    </div>
  );
};

// ─── Things to Do ─────────────────────────────────────────────────────────────

interface ThingsToDoState { destination: string; startDate: Date | null; endDate: Date | null; travelers: TravelerCounts; }

const ThingsToDoForm: React.FC = () => {
  const [state, setState] = useState<ThingsToDoState>({ destination: '', startDate: null, endDate: null, travelers: { adults: 2, children: 0, infants: 0, rooms: 1 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FieldCell grow><LocationField label="Destination" placeholder="Where do you want to explore?" value={state.destination} onChange={v => setState(s => ({ ...s, destination: v }))} /></FieldCell>
      <Divider />
      <FieldCell grow><DateRangeField startDate={state.startDate} endDate={state.endDate} onChange={(s, e) => setState(st => ({ ...st, startDate: s, endDate: e }))} label="Dates" /></FieldCell>
      <Divider />
      <FieldCell><TravelerSelector value={state.travelers} onChange={v => setState(s => ({ ...s, travelers: v }))} /></FieldCell>
      <div style={{ padding: `0 ${spacing.raw.s}px 0 ${spacing.raw.m}px` }}><SubmitButton label="Search activities" /></div>
    </div>
  );
};

// ─── Cruises ──────────────────────────────────────────────────────────────────

const CRUISE_LINES = ['Any cruise line', 'Carnival', 'Royal Caribbean', 'Norwegian', 'Princess', 'Celebrity', 'Disney', 'MSC', 'Holland America'];
const CRUISE_DURATIONS = ['Any length', '2–5 nights', '6–9 nights', '10–14 nights', '15+ nights'];
const CRUISE_DESTINATIONS = ['Anywhere', 'Caribbean', 'Mediterranean', 'Alaska', 'Bahamas', 'Europe', 'Hawaii', 'Mexico', 'South Pacific'];

interface CruisesState { destination: string; cruiseLine: string; duration: string; departDate: Date | null; travelers: TravelerCounts; }

const CruisesForm: React.FC = () => {
  const [state, setState] = useState<CruisesState>({ destination: 'Anywhere', cruiseLine: 'Any cruise line', duration: 'Any length', departDate: null, travelers: { adults: 2, children: 0, infants: 0, rooms: 1 } });

  const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
    <div style={{ flex: 1, padding: `${spacing.raw.s}px ${spacing.raw.m}px`, minHeight: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
      <span style={{ fontSize: font.size.s, fontWeight: font.weight.bold, color: color.raw.fgMax, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: font.size.m, fontWeight: font.weight.medium, color: color.raw.fgMax, cursor: 'pointer', outline: 'none', padding: 0, fontFamily: font.family }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SelectField label="Destination" value={state.destination} options={CRUISE_DESTINATIONS} onChange={v => setState(s => ({ ...s, destination: v }))} />
      <Divider />
      <SelectField label="Cruise line" value={state.cruiseLine} options={CRUISE_LINES} onChange={v => setState(s => ({ ...s, cruiseLine: v }))} />
      <Divider />
      <SelectField label="Duration" value={state.duration} options={CRUISE_DURATIONS} onChange={v => setState(s => ({ ...s, duration: v }))} />
      <Divider />
      <FieldCell grow><DateRangeField startDate={state.departDate} endDate={null} onChange={d => setState(s => ({ ...s, departDate: d }))} label="Departure month" singleDate /></FieldCell>
      <Divider />
      <FieldCell><TravelerSelector value={state.travelers} onChange={v => setState(s => ({ ...s, travelers: v }))} /></FieldCell>
      <div style={{ padding: `0 ${spacing.raw.s}px 0 ${spacing.raw.m}px` }}><SubmitButton label="Search cruises" /></div>
    </div>
  );
};

// ─── LOB forms map ─────────────────────────────────────────────────────────────

const LOB_FORMS: Record<LobId, React.FC> = {
  'stays': StaysForm, 'flights': FlightsForm, 'cars': CarsForm,
  'packages': PackagesForm, 'things-to-do': ThingsToDoForm, 'cruises': CruisesForm,
};

// ─── LOB Tab ──────────────────────────────────────────────────────────────────

const LobTab: React.FC<{ lob: Lob; active: boolean; onClick: () => void }> = ({ lob, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 18px 12px',
      border: 'none',
      borderRadius: `${radius.raw.xxl}px ${radius.raw.xxl}px 0 0`,
      background: active ? color.raw.white : 'transparent',
      color: active ? color.raw.fgMax : 'rgba(255,255,255,0.85)',
      fontSize: font.size.m,
      fontWeight: active ? font.weight.bold : font.weight.medium,
      fontFamily: font.family,
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.15s, color 0.15s',
      whiteSpace: 'nowrap',
    }}
  >
    {lob.label}
    {active && (
      <motion.div
        layoutId="lob-active-indicator"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          height: 3,
          borderRadius: 99,
          background: color.raw.bgBrand,       // OneKey yellow underline
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
      />
    )}
  </button>
);

// ─── Main SearchForm ──────────────────────────────────────────────────────────

export const SearchForm: React.FC = () => {
  const [activeLob, setActiveLob] = useState<LobId>('stays');
  const ActiveForm = LOB_FORMS[activeLob];
  const isMultiRow = activeLob === 'flights' || activeLob === 'cars' || activeLob === 'packages';

  return (
    <div style={{ fontFamily: font.family }}>
      {/* Tab bar — sits flush on top of the card */}
      <div style={{ display: 'flex', gap: 2, paddingLeft: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {LOBS.map(lob => (
          <LobTab key={lob.id} lob={lob} active={activeLob === lob.id} onClick={() => setActiveLob(lob.id)} />
        ))}
      </div>

      {/* White card */}
      <div style={{
        background: color.raw.white,
        borderRadius: `0 ${radius.raw.xxl}px ${radius.raw.xxl}px ${radius.raw.xxl}px`,
        boxShadow: shadow.high,
        overflow: 'visible',
      }}>
        <form onSubmit={e => e.preventDefault()}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLob}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                padding: isMultiRow ? `${spacing.raw.m}px ${spacing.raw.s}px ${spacing.raw.m}px ${spacing.raw.s}px` : `${spacing.raw.xs}px ${spacing.raw.s}px ${spacing.raw.xs}px ${spacing.raw.s}px`,
                minHeight: 72,
              }}
            >
              <ActiveForm />
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};
