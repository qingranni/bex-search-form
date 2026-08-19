import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// BexStatusBar is now rendered fixed in App.tsx
import { ExpediaLogo } from './ExpediaLogo';
import type { Warmth } from './VersionSwitcher';

// ─── Figma pictogram assets — refreshed from Lite node 7051:374819 (Aug 2026)
const LOB_PICTOGRAMS: Record<string, string> = {
  stays:      'https://www.figma.com/api/mcp/asset/7ddeaffe-5255-495e-8884-df63ea8c7631.png',
  flights:    'https://www.figma.com/api/mcp/asset/9bafe27c-f567-4aaa-ac8a-942202531e11.png',
  cars:       'https://www.figma.com/api/mcp/asset/26459eb8-01e3-41e7-9ede-ebf24b33753a.png',
  packages:   'https://www.figma.com/api/mcp/asset/4ec77f99-6308-4ab9-9e31-5b5b18559ba9.png',
  activities: 'https://www.figma.com/api/mcp/asset/92107ca5-817c-483c-956d-9a16e86d86bb.png',
  cruises:    'https://www.figma.com/api/mcp/asset/8b4c9ef2-b888-4e14-b07d-f90710d13a52.png',
};

// ─── LOB config ───────────────────────────────────────────────────────────────

export type LobId = 'stays' | 'flights' | 'cars' | 'packages' | 'activities' | 'cruises';

const LOBS: { id: LobId; label: string }[] = [
  { id: 'stays',      label: 'Stays' },
  { id: 'flights',    label: 'Flights' },
  { id: 'cars',       label: 'Cars' },
  { id: 'packages',   label: 'Packages' },
  { id: 'activities', label: 'Activities' },
  { id: 'cruises',    label: 'Cruises' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconLocation = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C14.1197 2 15.9982 2.78564 17.4014 4.08008C18.9957 5.52717 20 7.61206 20 9.92969C19.9999 12.0631 19.0904 13.9385 18.0098 15.5195C16.7942 17.298 15.0091 19.2099 12.6562 21.2549C12.28 21.5819 11.72 21.5819 11.3438 21.2549C8.99091 19.2099 7.20581 17.298 5.99023 15.5195C4.9078 13.9358 4.00009 12.0704 4 9.92969C4 7.61206 5.00425 5.52717 6.59863 4.08008C8.00177 2.78562 9.88025 2 12 2ZM12 4C10.3884 4 8.99123 4.59201 7.95215 5.55176L7.94531 5.55859C6.74679 6.64512 6 8.2017 6 9.92969C6.00009 11.4926 6.66213 12.9576 7.6416 14.3906C8.62099 15.8235 10.0589 17.4161 12 19.165C13.9411 17.4161 15.379 15.8235 16.3584 14.3906C17.3356 12.9608 17.9999 11.4858 18 9.92969C18 8.20171 17.2532 6.64512 16.0547 5.55859L16.0469 5.55176C15.0078 4.59225 13.6114 4 12 4ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2C7.77614 2 8 2.22386 8 2.5V4H16V2.5C16 2.22386 16.2239 2 16.5 2H17.5C17.7761 2 18 2.22386 18 2.5V4H19C20.6569 4 22 5.34315 22 7V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V7C2 5.34315 3.34315 4 5 4H6V2.5C6 2.22386 6.22386 2 6.5 2H7.5ZM4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V10H4V19ZM8.5 16C8.77614 16 9 16.2239 9 16.5V17.5C9 17.7761 8.77614 18 8.5 18H7.5C7.22386 18 7 17.7761 7 17.5V16.5C7 16.2239 7.22386 16 7.5 16H8.5ZM12.5 16C12.7761 16 13 16.2239 13 16.5V17.5C13 17.7761 12.7761 18 12.5 18H11.5C11.2239 18 11 17.7761 11 17.5V16.5C11 16.2239 11.2239 16 11.5 16H12.5ZM16.5 16C16.7761 16 17 16.2239 17 16.5V17.5C17 17.7761 16.7761 18 16.5 18H15.5C15.2239 18 15 17.7761 15 17.5V16.5C15 16.2239 15.2239 16 15.5 16H16.5ZM8.5 12C8.77614 12 9 12.2239 9 12.5V13.5C9 13.7761 8.77614 14 8.5 14H7.5C7.22386 14 7 13.7761 7 13.5V12.5C7 12.2239 7.22386 12 7.5 12H8.5ZM12.5 12C12.7761 12 13 12.2239 13 12.5V13.5C13 13.7761 12.7761 14 12.5 14H11.5C11.2239 14 11 13.7761 11 13.5V12.5C11 12.2239 11.2239 12 11.5 12H12.5ZM16.5 12C16.7761 12 17 12.2239 17 12.5V13.5C17 13.7761 16.7761 14 16.5 14H15.5C15.2239 14 15 13.7761 15 13.5V12.5C15 12.2239 15.2239 12 15.5 12H16.5ZM5 6C4.44772 6 4 6.44772 4 7V8H20V7C20 6.44772 19.5523 6 19 6H5Z" fill="currentColor"/>
  </svg>
);

const IconPerson = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 12C16.0554 12 19.4194 14.9752 19.9783 18.8604C20.1575 20.1064 19.1192 20.9997 18.0603 21H5.9402C4.88114 21 3.84202 20.1066 4.02126 18.8604C4.58018 14.9752 7.9442 12 11.9998 12ZM11.9998 14C8.99125 14 6.50253 16.1686 6.02321 19H17.9763C17.497 16.1686 15.0083 14 11.9998 14ZM11.9998 3C14.2089 3 15.9998 4.79086 15.9998 7C15.9998 9.20914 14.2089 11 11.9998 11C9.79064 11 7.99977 9.20913 7.99977 7C7.99977 4.79087 9.79064 3.00001 11.9998 3ZM11.9998 5C10.8952 5.00001 9.99977 5.89544 9.99977 7C9.99977 8.10456 10.8952 8.99999 11.9998 9C13.1043 9 13.9998 8.10457 13.9998 7C13.9998 5.89543 13.1043 5 11.9998 5Z" fill="currentColor"/>
  </svg>
);

const IconPlane = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
  </svg>
);

// Takeoff: plane rotated 45° CW so nose points NE (departing)
// EGDS 2 "Flight takeoff" glyph — plane body sweeping up-right, runway line at bottom
const IconFlightTakeoff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49 1.27-.34 8.2-2.2 4.91-1.32c.81-.22 1.29-1.05 1.06-1.86z"/>
  </svg>
);

// EGDS 2 "Flight land" glyph — plane body sweeping down-right, runway line at bottom
const IconFlightLanding = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2.5 19h19v2h-19zM19.34 9.21c-.31-.76-1.12-1.18-1.91-.9l-4.07 1.54-8.43-4.09-1.83.7 5.55 5.47-3.8 1.43-2.8-1.51-1.34.51 2.74 4.12 10.45-3.96 4.98-1.88c.79-.28 1.22-1.11.94-1.93z"/>
  </svg>
);

const IconSwap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7.5 17L7.5 7M7.5 7L4 10.5M7.5 7L11 10.5M16.5 7L16.5 17M16.5 17L20 13.5M16.5 17L13 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM11 7V12.4142L14.2929 15.7071L15.7071 14.2929L13 11.5858V7H11Z" fill="currentColor"/>
  </svg>
);

const IconSeat = () => (
  <svg width="24" height="24" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <path d="M12.9707 1.51193L13.0859 1.52854L13.8242 1.65939C14.6394 1.80363 15.1844 2.58141 15.041 3.3967L13.4775 12.261C13.351 12.9776 12.7277 13.5001 12 13.5002V14.2502L11.9893 14.4709C11.9675 14.6905 11.9138 14.907 11.8291 15.1115C11.7161 15.3842 11.5495 15.6323 11.3408 15.841C11.1321 16.0496 10.8839 16.2154 10.6113 16.3283C10.4069 16.413 10.1912 16.4677 9.97168 16.4895L9.75 16.5002H5.25V15.7502C5.2501 15.3362 5.58606 15.0005 6 15.0002H9.75C9.84826 15.0002 9.94631 14.9802 10.0371 14.9426C10.1278 14.905 10.2108 14.8498 10.2803 14.7805C10.3497 14.711 10.4057 14.628 10.4434 14.5373C10.4716 14.4692 10.4898 14.3966 10.4971 14.3235L10.5 14.2502V13.5002H4.5C3.67172 13.5001 3.00004 12.8285 3 12.0002V11.2502C3.00006 10.0074 4.00832 9.00072 5.25 9.00021H9.48242L9.61523 8.25021H5.625L5.5498 8.2424C5.37896 8.20748 5.25012 8.05635 5.25 7.87521V7.50021C5.25 7.22275 5.40102 6.98053 5.625 6.8508C5.73531 6.78692 5.86336 6.75026 6 6.75021H9.87891L10.4785 3.35373L10.502 3.24045C10.7594 2.11763 11.828 1.36976 12.9707 1.51193ZM12.8252 3.00607C12.4174 2.93417 12.0282 3.20678 11.9561 3.61447L10.7412 10.5002H5.25C4.83604 10.5005 4.50006 10.8362 4.5 11.2502V12.0002H12L13.5635 3.13596L12.8252 3.00607Z" />
  </svg>
);

const DURATION_OPTIONS = [
  '1-3 nights', '3-5 nights', '3-9 nights', '5-7 nights',
  '7-10 nights', '10-14 nights', '14+ nights',
];

const TIME_OPTIONS = [
  '6:00am', '6:30am', '7:00am', '7:30am', '8:00am', '8:30am',
  '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
  '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm',
  '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '5:30pm',
  '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm',
];

// ─── Field values ─────────────────────────────────────────────────────────────

type FieldType = 'where' | 'origin' | 'when' | 'who' | null;

interface FieldValues {
  where: string;
  when: string;
  adults: number;
  children: number;
  infants: number;
  rooms: number;
  origin: string;
  cabinClass: string;
  carDropoff: string;
  pickupTime: string;
  dropoffTime: string;
  duration: string;
}

const WARM_FIELDS: FieldValues = {
  where: 'New York (and vicinity), NY, United States',
  when: 'Wed, Jul 29 – Fri, Jul 31',
  adults: 2,
  children: 0,
  infants: 0,
  rooms: 1,
  origin: 'Austin, TX (AUS-Austin-Bergstrom-Intl.)',
  cabinClass: 'Economy',
  carDropoff: 'Same as pick-up',
  pickupTime: '10:30am',
  dropoffTime: '10:30am',
  duration: '3-9 nights',
};

const COLD_FIELDS: FieldValues = {
  where: '',
  when: '',
  adults: 2,
  children: 0,
  infants: 0,
  rooms: 1,
  origin: '',
  cabinClass: 'Economy',
  carDropoff: '',
  pickupTime: '10:00am',
  dropoffTime: '10:00am',
  duration: '',
};

// ─── Destination suggestions ──────────────────────────────────────────────────
// Kinds match EGDS2 typeahead icon spec (Figma: ObKdPkKTCJTynraxUq5Qww/6047:34)

type SuggestionKind = 'allAirports' | 'airport' | 'city' | 'neighborhood' | 'poi' | 'hotel' | 'activity' | 'busStation';
interface Suggestion { kind: SuggestionKind; primary: string; secondary: string; }

const ALL_SUGGESTIONS: Suggestion[] = [
  // New York
  { kind: 'city',         primary: 'New York (and vicinity)',          secondary: 'New York, United States' },
  { kind: 'allAirports',  primary: 'New York (JFK, LGA, EWR)',         secondary: 'New York, United States' },
  { kind: 'airport',      primary: 'New York (JFK – John F. Kennedy)', secondary: '15 mi from city center' },
  { kind: 'airport',      primary: 'New York (LGA – LaGuardia)',       secondary: '8 mi from city center' },
  { kind: 'neighborhood', primary: 'Manhattan, New York',              secondary: 'New York, United States' },
  { kind: 'neighborhood', primary: 'Brooklyn, New York',               secondary: 'New York, United States' },
  { kind: 'hotel',        primary: 'The Plaza Hotel',                  secondary: 'Midtown Manhattan, New York' },
  { kind: 'hotel',        primary: 'New York Midtown hotels',          secondary: 'New York, United States' },
  { kind: 'poi',          primary: 'Times Square',                     secondary: 'Manhattan, New York' },
  { kind: 'poi',          primary: 'Central Park',                     secondary: 'Manhattan, New York' },
  { kind: 'activity',     primary: 'NYC: Broadway Show Tickets',       secondary: 'New York, United States' },
  // London
  { kind: 'city',         primary: 'London',                           secondary: 'United Kingdom' },
  { kind: 'allAirports',  primary: 'London (LHR, LGW, STN, LCY)',     secondary: 'London, United Kingdom' },
  { kind: 'airport',      primary: 'London (LHR – Heathrow)',          secondary: '14 mi from city center' },
  { kind: 'neighborhood', primary: 'Soho, London',                     secondary: 'London, United Kingdom' },
  { kind: 'hotel',        primary: 'The Ritz London',                  secondary: 'Westminster, London' },
  { kind: 'poi',          primary: 'Big Ben',                          secondary: 'Westminster, London' },
  { kind: 'activity',     primary: 'London Eye Experience',            secondary: 'London, United Kingdom' },
  { kind: 'busStation',   primary: 'London Victoria Coach Station',    secondary: 'London, United Kingdom' },
  // Paris
  { kind: 'city',         primary: 'Paris',                            secondary: 'France' },
  { kind: 'airport',      primary: 'Paris (CDG – Charles de Gaulle)',  secondary: '14 mi from city center' },
  { kind: 'hotel',        primary: 'Hôtel de Crillon',                 secondary: 'Place de la Concorde, Paris' },
  { kind: 'poi',          primary: 'Eiffel Tower',                     secondary: '7th Arrondissement, Paris' },
  { kind: 'activity',     primary: 'Skip-the-Line: Louvre Museum',     secondary: 'Paris, France' },
  // Tokyo
  { kind: 'city',         primary: 'Tokyo',                            secondary: 'Japan' },
  { kind: 'airport',      primary: 'Tokyo (NRT – Narita Intl.)',       secondary: '37 mi from city center' },
  { kind: 'neighborhood', primary: 'Shinjuku, Tokyo',                  secondary: 'Tokyo, Japan' },
  { kind: 'poi',          primary: 'Shibuya Crossing',                 secondary: 'Shibuya, Tokyo' },
  { kind: 'activity',     primary: 'Tokyo: Teamlab Borderless',        secondary: 'Tokyo, Japan' },
  // Dubai
  { kind: 'city',         primary: 'Dubai',                            secondary: 'United Arab Emirates' },
  { kind: 'airport',      primary: 'Dubai (DXB – Dubai Intl.)',        secondary: '4 mi from city center' },
  { kind: 'hotel',        primary: 'Burj Al Arab',                     secondary: 'Jumeirah, Dubai' },
  { kind: 'activity',     primary: 'Desert Safari Dubai',              secondary: 'Dubai, UAE' },
  // Los Angeles
  { kind: 'city',         primary: 'Los Angeles',                      secondary: 'California, United States' },
  { kind: 'allAirports',  primary: 'Los Angeles (LAX)',                secondary: 'California, United States' },
  { kind: 'neighborhood', primary: 'Hollywood, Los Angeles',           secondary: 'California, United States' },
  { kind: 'neighborhood', primary: 'Santa Monica, Los Angeles',        secondary: 'California, United States' },
  { kind: 'poi',          primary: 'Griffith Observatory',             secondary: 'Los Feliz, Los Angeles' },
  // Barcelona
  { kind: 'city',         primary: 'Barcelona',                        secondary: 'Spain' },
  { kind: 'poi',          primary: 'Sagrada Família',                  secondary: 'Barcelona, Spain' },
  { kind: 'activity',     primary: 'FC Barcelona Museum Tour',         secondary: 'Barcelona, Spain' },
  // Rome
  { kind: 'city',         primary: 'Rome',                             secondary: 'Italy' },
  { kind: 'poi',          primary: 'Colosseum',                        secondary: 'Rome, Italy' },
  { kind: 'activity',     primary: 'Skip-the-Line: Vatican Museums',   secondary: 'Rome, Italy' },
  // Seoul
  { kind: 'city',         primary: 'Seoul',                            secondary: 'South Korea' },
  { kind: 'allAirports',  primary: 'Seoul (SEL – All Airports)',       secondary: 'South Korea' },
  { kind: 'airport',      primary: 'Seoul (ICN – Incheon Intl.)',      secondary: '30 mi from city center' },
  { kind: 'airport',      primary: 'Seoul (GMP – Gimpo Intl.)',        secondary: '10 mi from city center' },
  // Sydney
  { kind: 'city',         primary: 'Sydney',                           secondary: 'Australia' },
  { kind: 'poi',          primary: 'Sydney Opera House',               secondary: 'Sydney, Australia' },
  // Cancún
  { kind: 'city',         primary: 'Cancún',                           secondary: 'Mexico' },
  // Phoenix
  { kind: 'city',         primary: 'Phoenix',                          secondary: 'Arizona, United States' },
  { kind: 'airport',      primary: 'Phoenix (PHX – Sky Harbor Intl.)', secondary: '4 mi from city center' },
  { kind: 'hotel',        primary: 'Arizona Grand Resort & Spa',       secondary: 'Ahwatukee, Phoenix' },
  { kind: 'activity',     primary: 'Desert Botanical Garden',          secondary: 'Phoenix, Arizona' },
  // Miami / Las Vegas
  { kind: 'city',         primary: 'Miami',                            secondary: 'Florida, United States' },
  { kind: 'neighborhood', primary: 'South Beach, Miami Beach',         secondary: 'Florida, United States' },
  { kind: 'city',         primary: 'Las Vegas',                        secondary: 'Nevada, United States' },
  { kind: 'hotel',        primary: 'Bellagio Hotel & Casino',          secondary: 'The Strip, Las Vegas' },
  // Seattle
  { kind: 'allAirports',  primary: 'Seattle (SEA – Seattle-Tacoma Intl.)', secondary: 'Washington, United States' },
  { kind: 'city',         primary: 'Seattle',                          secondary: 'Washington, United States' },
  { kind: 'neighborhood', primary: 'Downtown Seattle',                 secondary: 'Seattle, Washington, United States' },
  { kind: 'poi',          primary: 'Seattle Cruise Ship Terminal 91',  secondary: 'Seattle, Washington, United States' },
  { kind: 'neighborhood', primary: 'Seattle Waterfront',               secondary: 'Seattle, Washington, United States' },
  { kind: 'hotel',        primary: 'Seattle Downtown Hilton',          secondary: 'Seattle, Washington, United States' },
  { kind: 'hotel',        primary: 'The Westin Seattle',               secondary: 'Seattle, Washington, United States' },
  { kind: 'activity',     primary: 'Seattle: Space Needle Tickets',    secondary: 'Seattle, Washington, United States' },
  { kind: 'poi',          primary: 'Pike Place Market',                secondary: 'Seattle, Washington, United States' },
];

// ── EGDS2 typeahead icons (per Figma spec ObKdPkKTCJTynraxUq5Qww/6047:34) ───

// lob_flights — airplane silhouette (airport / all airports / metrocode)
const IconSuggestAirport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#191e3b"/>
  </svg>
);

// location_city — city skyline with buildings (city / multicity / neighborhood)
const IconSuggestCity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5v-2h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="#191e3b"/>
  </svg>
);

// place — map pin (POI)
const IconSuggestPoi = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#191e3b"/>
  </svg>
);

// bed — hotel bed (hotel)
const IconSuggestHotel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#191e3b"/>
  </svg>
);

// lob_activities — star ticket (activity)
const IconSuggestActivity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 12c0-1.1.9-2 2-2v-2c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v2c1.1 0 2 .9 2 2s-.9 2-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c-1.1 0-2-.9-2-2zm-4.42 3.8L12 13.67l-3.58 2.13 1-4.03-3.08-2.61 4.03-.35L12 5.08l1.63 3.73 4.03.35-3.08 2.61 1 4.03z" fill="#191e3b"/>
  </svg>
);

// directions_bus — front-view bus (bus station)
const IconSuggestBus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" fill="#191e3b"/>
  </svg>
);

function SuggestionIcon({ kind }: { kind: SuggestionKind }) {
  if (kind === 'allAirports' || kind === 'airport') return <IconSuggestAirport />;
  if (kind === 'hotel')                             return <IconSuggestHotel />;
  if (kind === 'poi')                               return <IconSuggestPoi />;
  if (kind === 'activity')                          return <IconSuggestActivity />;
  if (kind === 'busStation')                        return <IconSuggestBus />;
  return <IconSuggestCity />; // city, neighborhood
}

// ─── Field sheet — full-screen slide-up modal ─────────────────────────────────

interface SheetProps {
  type: FieldType;
  lob: LobId;
  fieldValues: FieldValues;
  onClose: () => void;
  onChange: (v: Partial<FieldValues>) => void;
}

// ── Calendar helpers ──────────────────────────────────────────────────────────
const CAL_DAYS  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const CAL_MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const SHORT_MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getCalDays(year: number, month: number): (Date | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatRangeLabel(start: Date | null, end: Date | null): string {
  if (!start) return '';
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

// ── FieldSheet ────────────────────────────────────────────────────────────────
const FieldSheet: React.FC<SheetProps> = ({ type, lob, fieldValues, onClose, onChange }) => {
  const [query, setQuery] = useState(type === 'origin' ? fieldValues.origin : fieldValues.where);
  const inputRef = useRef<HTMLInputElement>(null);

  // Travelers state
  const [adults, setAdults]     = useState(fieldValues.adults);
  const [children, setChildren] = useState(fieldValues.children);
  const [infants, setInfants]   = useState(fieldValues.infants ?? 0);
  const [pets, setPets]         = useState(false);

  // Calendar state
  const today = new Date();
  const [calTab, setCalTab]       = useState<'exact' | 'flexible'>('exact');
  const [displayMonth, setDisplayMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd,   setRangeEnd]   = useState<Date | null>(null);
  const [hoverDate,  setHoverDate]  = useState<Date | null>(null);
  const [flexibility, setFlexibility] = useState('Exact dates');
  const [flexDur, setFlexDur]       = useState('');
  const [mustWeekend, setMustWeekend] = useState(false);
  const [flexMonths, setFlexMonths] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'where' || type === 'origin') {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [type]);

  const results = ALL_SUGGESTIONS.filter(s =>
    query.trim()
      ? s.primary.toLowerCase().includes(query.toLowerCase()) ||
        s.secondary.toLowerCase().includes(query.toLowerCase())
      : true
  ).slice(0, 7);

  // ── EGDS Step input row ────────────────────────────────────────────────────
  const StepInput = ({ label, sub, value, min, max, onCh }: {
    label: string; sub?: string; value: number; min: number; max: number; onCh: (v: number) => void;
  }) => (
    <div className="bex-si">
      <div className="bex-si__labels">
        <span className="bex-si__label">{label}</span>
        {sub && <span className="bex-si__sub">{sub}</span>}
      </div>
      <div className="bex-si__controls">
        <button
          type="button"
          onClick={() => onCh(Math.max(min, value - 1))}
          disabled={value <= min}
          className={`bex-si__btn${value <= min ? ' bex-si__btn--dim' : ''}`}
          aria-label={`Decrease ${label}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>
        </button>
        <span className="bex-si__value">{value}</span>
        <button
          type="button"
          onClick={() => onCh(Math.min(max, value + 1))}
          disabled={value >= max}
          className={`bex-si__btn${value >= max ? ' bex-si__btn--dim' : ''}`}
          aria-label={`Increase ${label}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  );

  // ── Calendar month block ───────────────────────────────────────────────────
  const CalMonth = ({ year, month }: { year: number; month: number }) => {
    const cells = getCalDays(year, month);
    const todayD = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return (
      <div className="bex-cal__month">
        <div className="bex-cal__month-header">{CAL_MONTH_NAMES[month]} {year}</div>
        <div className="bex-cal__dow-row">
          {CAL_DAYS.map(d => <span key={d} className="bex-cal__dow">{d}</span>)}
        </div>
        <div className="bex-cal__grid">
          {cells.map((date, i) => {
            if (!date) return <span key={i} className="bex-cal__cell bex-cal__cell--empty" />;
            const isPast  = date < todayD;
            const isToday = sameDay(date, todayD);
            const isStart = rangeStart && sameDay(date, rangeStart);
            const isEnd   = rangeEnd   && sameDay(date, rangeEnd);
            const preview = rangeStart && !rangeEnd && hoverDate;
            const low  = rangeStart && (rangeEnd ?? (preview && hoverDate! >= rangeStart ? hoverDate : null));
            const high = low === rangeEnd ? rangeEnd : (low === hoverDate ? hoverDate : null);
            const inRange = low && high && date > (rangeStart ?? low) && date < high;
            const cx = [
              'bex-cal__cell',
              isPast  ? 'bex-cal__cell--past'  : '',
              isToday ? 'bex-cal__cell--today'  : '',
              isStart ? 'bex-cal__cell--sel bex-cal__cell--start' : '',
              isEnd   ? 'bex-cal__cell--sel bex-cal__cell--end'   : '',
              inRange ? 'bex-cal__cell--range' : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={i}
                type="button"
                className={cx}
                disabled={isPast}
                onClick={() => {
                  if (!rangeStart || (rangeStart && rangeEnd)) {
                    setRangeStart(date); setRangeEnd(null);
                  } else if (date < rangeStart) {
                    setRangeStart(date); setRangeEnd(null);
                  } else {
                    setRangeEnd(date);
                  }
                }}
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1);
  const sheetSpring = { type: 'spring', stiffness: 420, damping: 42, mass: 0.8 } as const;

  return (
    <div className="bex-fs-overlay">
      {/* Dimmed backdrop */}
      <motion.div
        className="bex-fs-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* ── WHERE / ORIGIN sheet ──────────────────────────────────────────── */}
      {(type === 'where' || type === 'origin') && (
        <motion.div
          className="bex-fs"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={sheetSpring}
        >
          {/* Close */}
          <button type="button" className="bex-fs__close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#1a6cda"/></svg>
          </button>

          {/* Large search input */}
          <div className="bex-fs__search-row">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={type === 'origin' ? 'City or airport' : 'Where to?'}
              className="bex-fs__search-input"
              autoComplete="off"
              spellCheck={false}
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="bex-fs__search-clear"
                aria-label="Clear"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#fff"/></svg>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="bex-fs__divider" />

          {/* Results */}
          <div className="bex-fs__results">
            {results.map((s, i) => (
              <button
                key={i}
                type="button"
                className="bex-fs__result-row"
                onMouseDown={() => {
                  const val = s.primary;
                  if (type === 'origin') onChange({ origin: val });
                  else onChange({ where: val });
                  onClose();
                }}
              >
                <span className="bex-fs__result-icon">
                  <SuggestionIcon kind={s.kind} />
                </span>
                <span className="bex-fs__result-text">
                  <span className="bex-fs__result-primary">{s.primary}</span>
                  {s.secondary && <span className="bex-fs__result-secondary">{s.secondary}</span>}
                </span>
              </button>
            ))}
            {query.trim().length > 0 && (
              <button
                type="button"
                className="bex-fs__search-for"
                onMouseDown={() => {
                  if (type === 'origin') onChange({ origin: query.trim() });
                  else onChange({ where: query.trim() });
                  onClose();
                }}
              >
                <span className="bex-fs__search-for-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </span>
                <span className="bex-fs__search-for-text">Search for "{query.trim()}"</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ── WHO sheet — EGDS Travelers ─────────────────────────────────────── */}
      {type === 'who' && (
        <motion.div
          className="bex-fs bex-fs--travelers"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={sheetSpring}
        >
          {/* Toolbar — X left + "Travelers" centered */}
          <div className="bex-trav__toolbar">
            <button type="button" className="bex-fs__close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#1a6cda"/></svg>
            </button>
            <span className="bex-trav__title">Travelers</span>
            <span className="bex-trav__toolbar-spacer" aria-hidden="true" />
          </div>

          {/* Body */}
          <div className="bex-trav__body">
            {/* Room 1 heading */}
            <p className="bex-trav__room-label">Room 1</p>

            {/* Adults */}
            <StepInput label="Adults" value={adults} min={1} max={14} onCh={setAdults} />

            {/* Children */}
            <StepInput label="Children" sub="Ages 0 to 17" value={children} min={0} max={6} onCh={setChildren} />

            {/* Add another room */}
            <div className="bex-trav__add-room-row">
              <button type="button" className="bex-trav__add-room">Add another room</button>
            </div>
          </div>

          {/* Done footer */}
          <div className="bex-trav__footer">
            <button
              type="button"
              className="bex-trav__done"
              onClick={() => { onChange({ adults, children, infants }); onClose(); }}
            >
              Done
            </button>
          </div>
        </motion.div>
      )}

      {/* ── WHEN sheet — Calendar ─────────────────────────────────────────── */}
      {type === 'when' && (
        <motion.div
          className="bex-fs bex-cal"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={sheetSpring}
        >
          {/* Toolbar — close button */}
          <div className="bex-cal__toolbar">
            <button type="button" className="bex-fs__close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#191e3b"/></svg>
            </button>
          </div>

          {/* Tabs: Calendar | Flexible dates — flexible only for Stays */}
          {lob === 'stays' ? (
            <>
              <div className="bex-cal__tabs" role="tablist">
                <button role="tab" aria-selected={calTab === 'exact'}
                  className={`bex-cal__tab${calTab === 'exact' ? ' bex-cal__tab--active' : ''}`}
                  onClick={() => setCalTab('exact')}>Calendar</button>
                <button role="tab" aria-selected={calTab === 'flexible'}
                  className={`bex-cal__tab${calTab === 'flexible' ? ' bex-cal__tab--active' : ''}`}
                  onClick={() => setCalTab('flexible')}>Flexible dates</button>
              </div>
              <div className="bex-cal__tab-underline" />
            </>
          ) : (
            <div className="bex-cal__tab-underline bex-cal__tab-underline--solo" />
          )}

          {(calTab === 'exact' || lob !== 'stays') ? (
            <>
              {/* Date range header */}
              <div className="bex-cal__range-hdr">
                <div className={`bex-cal__range-box${rangeStart ? ' bex-cal__range-box--set' : ''}`}>
                  <span className="bex-cal__range-box-val">
                    {rangeStart
                      ? rangeStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Start date'}
                  </span>
                </div>
                <svg className="bex-cal__range-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M14 6l6 6-6 6" stroke="#191e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className={`bex-cal__range-box${rangeEnd ? ' bex-cal__range-box--set' : ''}`}>
                  <span className="bex-cal__range-box-val">
                    {rangeEnd
                      ? rangeEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'End date'}
                  </span>
                </div>
              </div>

              {/* Scrollable calendar months */}
              <div className="bex-cal__body">
                <CalMonth year={displayMonth.getFullYear()} month={displayMonth.getMonth()} />
                <CalMonth year={nextMonth.getFullYear()} month={nextMonth.getMonth()} />
              </div>

              {/* Flexibility footer pills + Done */}
              <div className="bex-cal__footer">
                <div className="bex-cal__flex-footer">
                  {['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days'].map(f => (
                    <button key={f} type="button"
                      className={`bex-cal__flex-footer-pill${flexibility === f ? ' bex-cal__flex-footer-pill--sel' : ''}`}
                      onClick={() => setFlexibility(f)}>{f}</button>
                  ))}
                </div>
                <button type="button" className="bex-cal__save"
                  onClick={() => {
                    if (rangeStart) onChange({ when: formatRangeLabel(rangeStart, rangeEnd) });
                    onClose();
                  }}>Done</button>
              </div>
            </>
          ) : (
            <>
              {/* Flexible dates body */}
              <div className="bex-cal__body">
                <div className="bex-cal__flex">
                  <p className="bex-cal__flex-heading">How long do you want to stay?</p>
                  <div className="bex-cal__flex-pills">
                    {['1 night', '2-3 nights', '4-5 nights', '6-7 nights'].map(d => (
                      <button key={d} type="button"
                        className={`bex-cal__flex-pill${flexDur === d ? ' bex-cal__flex-pill--sel' : ''}`}
                        onClick={() => setFlexDur(d)}>{d}</button>
                    ))}
                  </div>
                  <label className="bex-cal__weekend-row">
                    <span className="bex-si__checkbox-wrap">
                      <input type="checkbox" className="bex-si__checkbox" checked={mustWeekend}
                        onChange={e => setMustWeekend(e.target.checked)} />
                      <span className="bex-si__checkbox-box" aria-hidden="true">
                        {mustWeekend && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/></svg>}
                      </span>
                    </span>
                    <span className="bex-cal__weekend-label">Must include weekend</span>
                  </label>
                  <div className="bex-cal__flex-divider" />
                  <p className="bex-cal__flex-heading">When do you want to travel?</p>
                  <p className="bex-cal__flex-sub">You can select more than one month.</p>
                  <div className="bex-cal__flex-months">
                    {Array.from({ length: 12 }, (_, i) => {
                      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
                      const key = `${d.getFullYear()}-${d.getMonth()}`;
                      const sel = flexMonths.includes(key);
                      return (
                        <button key={key} type="button"
                          className={`bex-cal__flex-month${sel ? ' bex-cal__flex-month--sel' : ''}`}
                          onClick={() => setFlexMonths(sel ? flexMonths.filter(k => k !== key) : [...flexMonths, key])}>
                          <svg className="bex-cal__flex-month-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span className="bex-cal__flex-month-name">{CAL_MONTH_NAMES[d.getMonth()]}</span>
                          <span className="bex-cal__flex-month-year">{d.getFullYear()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="bex-cal__footer bex-cal__footer--flex">
                <button type="button" className="bex-cal__save"
                  onClick={() => {
                    const months = flexMonths.map(k => {
                      const [, m] = k.split('-').map(Number);
                      return SHORT_MONTH_NAMES[m];
                    });
                    onChange({ when: [flexDur, months.join(', ')].filter(Boolean).join(' · ') });
                    onClose();
                  }}>Done</button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ─── EGDS Standard input row ──────────────────────────────────────────────────
// Two-line: small gray label (12px) at top + dark value (14px) below when filled

// Single-line field: shows label as gray placeholder when empty, dark value when filled.
interface InputRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}

const InputRow: React.FC<InputRowProps> = ({ icon, label, value, onClick }) => (
  <button type="button" className={`bex-hero-pro__field${!value ? ' bex-hero-pro__field--empty' : ''}`} onClick={onClick}>
    <span className="bex-hero-pro__field-icon">{icon}</span>
    <span className="bex-hero-pro__field-text">
      <span className="bex-hero-pro__field-value">{value || label}</span>
    </span>
  </button>
);

// ─── Skeleton row counts per LOB ─────────────────────────────────────────────


// ─── BexHero (Lite) ───────────────────────────────────────────────────────────

interface BexHeroProps {
  warmth?: Warmth;
  /** When true: renders only LOB nav + form (no status bar/toolbar). Used in scroll-expand overlay. */
  overlay?: boolean;
}

type FlightType = 'roundtrip' | 'oneway' | 'multicity';
type PackageType = 'stay+flight' | 'flight+car' | 'stay+car' | 'stay+flight+car';

const LOB_PILL_LABELS: Record<string, string> = {
  stays: 'Search for stays', flights: 'Search for flights',
  cars: 'Search for cars', packages: 'Search for packages',
  activities: 'Search for activities', cruises: 'Search for cruises',
};

export const BexHero: React.FC<BexHeroProps> = ({ warmth = 'cold', overlay = false }) => {
  const [activeLob, setActiveLob] = useState<LobId>('stays');
  const [flightType, setFlightType] = useState<FlightType>('roundtrip');
  const [packageType, setPackageType] = useState<PackageType>('stay+flight'); // default: Stay + Flight
  const [openSheet, setOpenSheet] = useState<FieldType>(null);
  const [bundleExpanded, setBundleExpanded] = useState(false);
  const [carDropoffExpanded, setCarDropoffExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(!overlay && warmth === 'hot');
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fields, setFields] = useState<FieldValues>(
    warmth === 'hot' ? WARM_FIELDS : COLD_FIELDS
  );

  // Multi-city state
  const [mcLegs, setMcLegs] = useState<{from: string; to: string; date: string}[]>([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' },
  ]);
  const mcEditRef = useRef<{legIdx: number; field: 'from' | 'to' | 'date'} | null>(null);

  // Sync collapsed when warmth changes externally
  useEffect(() => {
    if (!overlay) setCollapsed(warmth === 'hot');
  }, [warmth, overlay]);

  const updateField = (partial: Partial<FieldValues>) =>
    setFields(prev => ({ ...prev, ...partial }));

  // Open a multi-city field sheet, routing data to/from the correct leg
  const openMcField = (legIdx: number, field: 'from' | 'to' | 'date') => {
    const leg = mcLegs[legIdx];
    mcEditRef.current = { legIdx, field };
    if (field === 'from') {
      setFields(prev => ({ ...prev, origin: leg.from }));
      setOpenSheet('origin');
    } else if (field === 'to') {
      setFields(prev => ({ ...prev, where: leg.to }));
      setOpenSheet('where');
    } else {
      setFields(prev => ({ ...prev, when: leg.date }));
      setOpenSheet('when');
    }
  };

  const handleMcFieldChange = (partial: Partial<FieldValues>) => {
    updateField(partial);
    const mc = mcEditRef.current;
    if (mc !== null) {
      setMcLegs(legs => legs.map((l, i) => {
        if (i !== mc.legIdx) return l;
        const u = { ...l };
        if (mc.field === 'from' && partial.origin !== undefined) u.from = partial.origin;
        if (mc.field === 'to' && partial.where !== undefined) u.to = partial.where;
        if (mc.field === 'date' && partial.when !== undefined) u.date = partial.when;
        return u;
      }));
    }
  };

  const handleSheetClose = () => {
    mcEditRef.current = null;
    setOpenSheet(null);
  };

  // Notify global sticky bar of active LOB
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('bex-lob', { detail: { lob: activeLob, city: fields.where } }));
  }, [activeLob, fields.where]);

  // Show skeleton briefly when switching LOBs
  const handleLobChange = useCallback((lobId: LobId) => {
    if (lobId === activeLob) return;
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    setActiveLob(lobId);
    setIsLoading(true);
    loadingTimer.current = setTimeout(() => setIsLoading(false), 560);
  }, [activeLob]);

  useEffect(() => () => {
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
  }, []);

  // Reset bundle when switching LOBs or package type
  useEffect(() => { setBundleExpanded(false); }, [activeLob, packageType]);

  const travelerLabel = () => {
    const parts = [`${fields.adults} traveler${fields.adults !== 1 ? 's' : ''}`];
    if (fields.children > 0) parts.push(`${fields.children} child${fields.children !== 1 ? 'ren' : ''}`);
    if (activeLob === 'stays' || activeLob === 'packages') parts.push(`${fields.rooms} room${fields.rooms !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  // ── LOB sub-tabs — rendered OUTSIDE the fieldscard, between lobnav and bottom ─

  const renderLobTabs = () => {
    if (activeLob === 'flights') {
      return (
        <div className="bex-hero-pro__tabs" role="tablist">
          {(['roundtrip', 'oneway', 'multicity'] as FlightType[]).map(t => (
            <button key={t} type="button" role="tab"
              className={`bex-hero-pro__tab${flightType === t ? ' bex-hero-pro__tab--active' : ''}`}
              onClick={() => setFlightType(t)}>
              {t === 'roundtrip' ? 'Roundtrip' : t === 'oneway' ? 'One-way' : 'Multi-city'}
            </button>
          ))}
        </div>
      );
    }
    if (activeLob === 'packages') {
      return (
        <div className="bex-hero-pro__tabs bex-hero-pro__tabs--scroll" role="tablist">
          {([
            { id: 'stay+flight',     label: 'Stay + Flight'     },
            { id: 'flight+car',      label: 'Flight + Car'      },
            { id: 'stay+car',        label: 'Stay + Car'        },
            { id: 'stay+flight+car', label: 'Stay + Flight + Car' },
          ] as { id: PackageType; label: string }[]).map(t => (
            <button key={t.id} type="button" role="tab"
              className={`bex-hero-pro__tab${packageType === t.id ? ' bex-hero-pro__tab--active' : ''}`}
              onClick={() => setPackageType(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      );
    }
    return null;
  };

  // ── Chevron for bundle toggle ──────────────────────────────────────────────
  const ChevronDownIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );

  // ── Per-LOB render functions — identical structure to BexHeroPro ───────────

  const renderStaysForm = () => (
    <div className="bex-hero-pro__fieldscard">
      <InputRow icon={<IconLocation />} label="Where to?" value={fields.where} onClick={() => setOpenSheet('where')} />
      <hr className="bex-hero-pro__divider" />
      <InputRow icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
      <hr className="bex-hero-pro__divider" />
      <InputRow icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')}/>
      <div className="bex-hero__bundle" data-expanded={bundleExpanded}>
        <button type="button" className="bex-hero__bundle-row" onClick={() => setBundleExpanded(e => !e)}>
          <span className="bex-hero__bundle-chevron"><ChevronDownIcon /></span>
          <span className="bex-hero__bundle-label">Add a flight to Bundle &amp; Save*</span>
        </button>
        {bundleExpanded && (
          <button type="button" className="bex-hero__bundle-input" onClick={() => setOpenSheet('origin')}>
            <IconFlightTakeoff />
            <span className="bex-hero__bundle-input-label">{fields.origin || 'Leaving from'}</span>
          </button>
        )}
      </div>
    </div>
  );

  const flightTravelerCabinLabel = () => {
    const t = travelerLabel();
    const cabin = fields.cabinClass || 'Economy';
    return `${t} · ${cabin}`;
  };

  const renderMultiCityForm = () => (
    <div className="bex-mc__wrapper">
      {/* Travelers · Cabin — standalone card */}
      <div className="bex-hero-pro__fieldscard">
        <InputRow icon={<IconPerson />} label="Travelers · Cabin" value={flightTravelerCabinLabel()} onClick={() => setOpenSheet('who')} />
      </div>

      {/* One card per flight leg */}
      {mcLegs.map((leg, idx) => (
        <div key={idx} className="bex-mc__segment">
          {/* Label row — outside the card */}
          <div className="bex-mc__header">
            <span className="bex-mc__label">Flight {idx + 1}</span>
            {idx >= 2 && (
              <button
                type="button"
                className="bex-mc__dismiss"
                aria-label={`Remove flight ${idx + 1}`}
                onClick={() => setMcLegs(legs => legs.filter((_, i) => i !== idx))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>
          {/* Fields card */}
          <div className="bex-hero-pro__fieldscard">
            <div className="bex-hero-pro__origin-wrap">
              <InputRow icon={<IconFlightTakeoff />} label="Leaving from" value={leg.from} onClick={() => openMcField(idx, 'from')} />
              <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
              <hr className="bex-hero-pro__divider" />
              <InputRow icon={<IconFlightLanding />} label="Going to" value={leg.to} onClick={() => openMcField(idx, 'to')} />
              <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
                onClick={() => setMcLegs(legs => legs.map((l, i) => i === idx ? { ...l, from: l.to, to: l.from } : l))}>
                <IconSwap />
              </button>
            </div>
            <hr className="bex-hero-pro__divider" />
            <InputRow icon={<IconCalendar />} label="Select departure date" value={leg.date} onClick={() => openMcField(idx, 'date')} />
          </div>
        </div>
      ))}

      {/* Add another flight */}
      {mcLegs.length < 5 && (
        <div className="bex-mc__add-row">
          <button
            type="button"
            className="bex-mc__add-btn"
            onClick={() => setMcLegs(legs => [...legs, { from: '', to: '', date: '' }])}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add another flight
          </button>
        </div>
      )}
    </div>
  );

  const renderFlightsForm = () => {
    if (flightType === 'multicity') return renderMultiCityForm();
    return (
    <div className="bex-hero-pro__fieldscard">
      <div className="bex-hero-pro__origin-wrap">
        <InputRow icon={<IconFlightTakeoff />} label="Leaving from" value={fields.origin} onClick={() => setOpenSheet('origin')} />
        <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
        <hr className="bex-hero-pro__divider" />
        <InputRow icon={<IconFlightLanding />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
        <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
          onClick={() => updateField({ origin: fields.where, where: fields.origin })}>
          <IconSwap />
        </button>
      </div>
      <hr className="bex-hero-pro__divider" />
      <InputRow
        icon={<IconCalendar />}
        label={flightType === 'oneway' ? 'Select departure date' : 'Select dates'}
        value={fields.when}
        onClick={() => setOpenSheet('when')}
      />
      <hr className="bex-hero-pro__divider" />
      <InputRow icon={<IconPerson />} label="Travelers · Cabin" value={flightTravelerCabinLabel()} onClick={() => setOpenSheet('who')} />
      {flightType !== 'oneway' && (
      <div className="bex-hero__bundle" data-expanded={bundleExpanded}>
        <button type="button" className="bex-hero__bundle-row" onClick={() => setBundleExpanded(e => !e)}>
          <span className="bex-hero__bundle-chevron"><ChevronDownIcon /></span>
          <span className="bex-hero__bundle-label">Add a stay to Bundle &amp; Save*</span>
        </button>
        {bundleExpanded && (
          <button type="button" className="bex-hero__bundle-input" onClick={() => setOpenSheet('when')}>
            <IconCalendar />
            <span className="bex-hero__bundle-input-label">{fields.when || 'Select dates'}</span>
          </button>
        )}
      </div>
      )}
    </div>
    );
  };

  const renderCarsForm = () => (
    <div className="bex-hero-pro__fieldscard">
      {/* Pick-up location + connector + Drop-off location */}
      <div className="bex-hero-pro__location-pair">
        <InputRow icon={<IconLocation />} label="Add pick-up location" value={fields.where} onClick={() => setOpenSheet('where')} />
        <div className="bex-hero-pro__car-connector" aria-hidden="true" />
        <hr className="bex-hero-pro__divider bex-hero__lite-car-divider" />
        <InputRow icon={<IconLocation />} label="Drop-off same as pick-up" value={fields.carDropoff} onClick={() => setOpenSheet('where')} />
      </div>
      <hr className="bex-hero-pro__divider" />
      {/* Date range — single field */}
      <InputRow icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
      <hr className="bex-hero-pro__divider" />
      {/* Pick-up time | Drop-off time — side by side */}
      <div className="bex-hero-pro__car-times">
        <label className="bex-hero-pro__car-time">
          <IconClock />
          <div className="bex-hero-pro__car-time-body">
            <span className="bex-hero-pro__field-label">Pick-up</span>
            <select className="bex-hero-pro__car-time-select" value={fields.pickupTime}
              onChange={e => updateField({ pickupTime: e.target.value })}>
              {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </label>
        <div className="bex-hero-pro__car-time-sep" aria-hidden="true" />
        <label className="bex-hero-pro__car-time">
          <IconClock />
          <div className="bex-hero-pro__car-time-body">
            <span className="bex-hero-pro__field-label">Drop off</span>
            <select className="bex-hero-pro__car-time-select" value={fields.dropoffTime}
              onChange={e => updateField({ dropoffTime: e.target.value })}>
              {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </label>
      </div>
    </div>
  );

  const renderPackagesForm = () => {
    const hasFlights = packageType === 'stay+flight' || packageType === 'flight+car' || packageType === 'stay+flight+car';
    const hasStay    = packageType === 'stay+flight' || packageType === 'stay+car'   || packageType === 'stay+flight+car';
    const hasChangeDates = packageType === 'stay+flight' || packageType === 'stay+flight+car';

    return (
      <div className="bex-hero-pro__fieldscard">
        {/* Flight origin → destination (only when flights included) */}
        {hasFlights ? (
          <div className="bex-hero-pro__origin-wrap">
            <InputRow icon={<IconFlightTakeoff />} label="Leaving from" value={fields.origin} onClick={() => setOpenSheet('origin')} />
            <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
            <hr className="bex-hero-pro__divider" />
            <InputRow icon={<IconFlightLanding />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
            <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
              onClick={() => updateField({ origin: fields.where, where: fields.origin })}>
              <IconSwap />
            </button>
          </div>
        ) : (
          /* Stay + Car: just a destination field */
          <InputRow icon={<IconLocation />} label="Where to?" value={fields.where} onClick={() => setOpenSheet('where')} />
        )}
        <hr className="bex-hero-pro__divider" />
        <InputRow icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
        <hr className="bex-hero-pro__divider" />
        <InputRow icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')} />
        {/* Economy (only when flights included) */}
        {hasFlights && (
          <>
            <hr className="bex-hero-pro__divider" />
            <InputRow icon={<IconSeat />} label="Economy" value={fields.cabinClass || 'Economy'} onClick={() => {}} />
          </>
        )}
        {/* Change dates for stay accordion (only Stay + Flight variants) */}
        {hasChangeDates && (
          <div className="bex-hero__bundle" data-expanded={bundleExpanded}>
            <button type="button" className="bex-hero__bundle-row" onClick={() => setBundleExpanded(e => !e)}>
              <span className="bex-hero__bundle-chevron"><ChevronDownIcon /></span>
              <span className="bex-hero__bundle-label">Change dates for stay</span>
            </button>
            {bundleExpanded && (
              <button type="button" className="bex-hero__bundle-input" onClick={() => setOpenSheet('when')}>
                <IconCalendar />
                <span className="bex-hero__bundle-input-label">{fields.when || 'Stay dates'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderActivitiesForm = () => (
    <div className="bex-hero-pro__fieldscard">
      <InputRow icon={<IconLocation />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
      <hr className="bex-hero-pro__divider" />
      <InputRow icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
    </div>
  );

  const renderCruisesForm = () => (
    <div className="bex-hero-pro__fieldscard">
      <InputRow icon={<IconLocation />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
      <hr className="bex-hero-pro__divider" />
      <InputRow icon={<IconCalendar />} label="Departing between" value={fields.when} onClick={() => setOpenSheet('when')} />
      <hr className="bex-hero-pro__divider" />
      <button type="button" className="bex-hero-pro__field" onClick={() => {}}>
        <span className="bex-hero-pro__field-icon"><IconClock /></span>
        <span className="bex-hero-pro__field-text">
          <select
            className="bex-hero-pro__inline-select"
            value={fields.duration || '3-9 nights'}
            onChange={e => updateField({ duration: e.target.value })}
            onClick={e => e.stopPropagation()}
          >
            {DURATION_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </span>
      </button>
    </div>
  );

  const renderForm = () => {
    switch (activeLob) {
      case 'stays':      return renderStaysForm();
      case 'flights':    return renderFlightsForm();
      case 'cars':       return renderCarsForm();
      case 'packages':   return renderPackagesForm();
      case 'activities': return renderActivitiesForm();
      case 'cruises':    return renderCruisesForm();
    }
  };

  return (
    <>
      <div className={`bex-hero-pro${overlay ? ' bex-hero-pro--overlay' : ''}`}>

        {/* Status bar spacer — actual bar is fixed in App.tsx */}
        <div className="bex-status-spacer" aria-hidden="true" />

        {/* Toolbar */}
        {!overlay && (
          <div className="bex-hero-pro__toolbar">
            <ExpediaLogo className="bex-hero-pro__logo" />
            {warmth === 'hot' ? (
              /* Hot state: OneKeyCash + Gold tier + user avatar */
              <div className="bex-hero-pro__hot-profile">
                <div className="bex-hero-pro__hot-profile-text">
                  <span className="bex-hero-pro__okc">OneKeyCash: $10.00</span>
                  <span className="bex-hero-pro__tier">
                    <img src="https://www.figma.com/api/mcp/asset/6aafc84c-1497-4f11-ac54-cf3e08e04fad.svg" width="14" height="14" alt="" aria-hidden="true" />
                    Gold
                  </span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&auto=format"
                  alt="Mary's profile"
                  className="bex-hero-pro__avatar-photo"
                />
              </div>
            ) : (
              /* Cold state: Sign in */
              <button type="button" className="bex-hero-pro__profile">
                <span className="bex-hero-pro__signin">Sign in</span>
                <span className="bex-hero-pro__avatar" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 12C16.0554 12 19.4194 14.9752 19.9783 18.8604C20.1575 20.1064 19.1192 20.9997 18.0603 21H5.9402C4.88114 21 3.84202 20.1066 4.02126 18.8604C4.58018 14.9752 7.9442 12 11.9998 12ZM11.9998 14C8.99125 14 6.50253 16.1686 6.02321 19H17.9763C17.497 16.1686 15.0083 14 11.9998 14ZM11.9998 3C14.2089 3 15.9998 4.79086 15.9998 7C15.9998 9.20914 14.2089 11 11.9998 11C9.79064 11 7.99977 9.20913 7.99977 7C7.99977 4.79087 9.79064 3.00001 11.9998 3ZM11.9998 5C10.8952 5.00001 9.99977 5.89544 9.99977 7C9.99977 8.10456 10.8952 8.99999 11.9998 9C13.1043 9 13.9998 8.10457 13.9998 7C13.9998 5.89543 13.1043 5 11.9998 5Z" fill="currentColor"/>
                  </svg>
                </span>
              </button>
            )}
          </div>
        )}

        {/* LOB nav — always visible in hot & cold states */}
        <div className="bex-hero-pro__lobnav" role="tablist" aria-label="Line of business">
          {LOBS.map(lob => (
            <button
              key={lob.id}
              type="button"
              role="tab"
              className="bex-hero-pro__lobitem"
              aria-pressed={activeLob === lob.id}
              aria-selected={activeLob === lob.id}
              onClick={() => { handleLobChange(lob.id); if (collapsed) setCollapsed(false); }}
            >
              <img src={LOB_PICTOGRAMS[lob.id]} alt="" className="bex-hero-pro__lobpic" aria-hidden="true"
                onLoad={e => (e.currentTarget as HTMLImageElement).classList.add('bex-hero-pro__lobpic--loaded')} />
              <span className="bex-hero-pro__loblabel">{lob.label}</span>
            </button>
          ))}
        </div>

        {/* Sub-tabs (Flights / Packages) — only when form is expanded */}
        {!collapsed && renderLobTabs()}

        {/* Hot-state expand zone — pill overlays form so no layout shift on transition */}
        <div className="bex-hero__hot-zone" style={{ position: 'relative' }}>

          {/* Collapsed pill — position:absolute so it doesn't push content during exit */}
          <AnimatePresence initial={false}>
            {collapsed && (
              <motion.button
                key="lite-pill"
                type="button"
                className="bex-hero__pill-bar bex-hero__pill-bar--overlay"
                onClick={() => setCollapsed(false)}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                aria-label={`Expand ${LOB_PILL_LABELS[activeLob]}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <span className="bex-hero__pill-bar-text">
                  {warmth === 'hot' ? 'Keep exploring Phoenix' : LOB_PILL_LABELS[activeLob]}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Expanded form — opacity only, no y-movement to prevent layout shift */}
          <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="lite-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Bottom — identical structure to Pro */}
              <div className="bex-hero-pro__bottom">
                {/* Form holds its natural height; skeleton overlays during load */}
                <div className="bex-lite-skeleton__host">
                  {/* Form fades out smoothly — keeps layout height while hidden */}
                  <motion.div
                    animate={{ opacity: isLoading ? 0 : 1 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  >
                    {renderForm()}
                  </motion.div>

                  {/* Skeleton fades in/out over the form */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        key="skeleton"
                        className="bex-lite-skeleton__card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        aria-hidden="true"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Cruise advisory note */}
                {activeLob === 'cruises' && (
                  <p className="bex-hero-pro__note">
                    For expert cruise advice, call 1-866-403-9848.
                  </p>
                )}

                {/* Search button */}
                <button type="button" className="bex-hero-pro__submit">
                  Search
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>{/* end hot-zone */}
      </div>

      {/* Field sheets — bottom sheet slide-up */}
      <AnimatePresence>
        {openSheet && (
          <FieldSheet
            key={openSheet}
            type={openSheet}
            lob={activeLob}
            fieldValues={fields}
            onClose={handleSheetClose}
            onChange={mcEditRef.current ? handleMcFieldChange : updateField}
          />
        )}
      </AnimatePresence>
    </>
  );
};
