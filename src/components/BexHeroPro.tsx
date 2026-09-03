import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// BexStatusBar is now rendered fixed in App.tsx
import { ExpediaLogo } from './ExpediaLogo';
import { LiteFieldSheet } from './BexHero';
import type { Warmth } from './VersionSwitcher';

// ─── Figma pictogram assets — refreshed from node 7051:374174 (Aug 2026)
const LOB_PICTOGRAMS: Record<string, string> = {
  stays:      '/images/figma/e81936d0-16c5-47cc-9f41-65db3fffb478.png',
  flights:    '/images/figma/11b9793f-e00f-4197-88d7-7f653826e726.png',
  cars:       '/images/figma/42f601d8-f33c-4d70-99be-f1c5f6af1e7b.png',
  packages:   '/images/figma/225e6cc3-bf29-4d88-9b3e-6ead5f288bb4.png',
  activities: '/images/figma/924d61a8-d175-4159-ac8b-58b9c8f9795c.png',
  cruises:    '/images/figma/a26c7685-9c65-4824-bab2-76f0748f05ed.png',
};

// ─── LOB config ───────────────────────────────────────────────────────────────

type LobId = 'stays' | 'flights' | 'cars' | 'packages' | 'activities' | 'cruises';

const LOBS: { id: LobId; label: string }[] = [
  { id: 'stays',      label: 'Stays' },
  { id: 'flights',    label: 'Flights' },
  { id: 'cars',       label: 'Cars' },
  { id: 'packages',   label: 'Packages' },
  { id: 'activities', label: 'Activities' },
  { id: 'cruises',    label: 'Cruises' },
];

const FLIGHT_TABS = ['Roundtrip', 'One-way', 'Multi-city'];
const PACKAGE_TABS = ['Stay + Flight', 'Flight + Car', 'Stay + Car', 'Stay + Flight + Car'];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconLocation = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C14.1197 2 15.9982 2.78564 17.4014 4.08008C18.9957 5.52717 20 7.61206 20 9.92969C19.9999 12.0631 19.0904 13.9385 18.0098 15.5195C16.7942 17.298 15.0091 19.2099 12.6562 21.2549C12.28 21.5819 11.72 21.5819 11.3438 21.2549C8.99091 19.2099 7.20581 17.298 5.99023 15.5195C4.9078 13.9358 4.00009 12.0704 4 9.92969C4 7.61206 5.00425 5.52717 6.59863 4.08008C8.00177 2.78562 9.88025 2 12 2ZM12 4C10.3884 4 8.99123 4.59201 7.95215 5.55176L7.94531 5.55859C6.74679 6.64512 6 8.2017 6 9.92969C6.00009 11.4926 6.66213 12.9576 7.6416 14.3906C8.62099 15.8235 10.0589 17.4161 12 19.165C13.9411 17.4161 15.379 15.8235 16.3584 14.3906C17.3356 12.9608 17.9999 11.4858 18 9.92969C18 8.20171 17.2532 6.64512 16.0547 5.55859L16.0469 5.55176C15.0078 4.59225 13.6114 4 12 4ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
  </svg>
);

const IconPlane = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
  </svg>
);

// Takeoff: plane rotated 45° CW so nose points NE (departing)
// EGDS 2 "Flight takeoff" glyph — plane body sweeping up-right, runway line at bottom
const IconFlightTakeoff = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M16.1254 15.0003C16.3325 15.0003 16.5004 15.1682 16.5004 15.3753V16.1253C16.5002 16.3323 16.3324 16.5003 16.1254 16.5003H1.87542C1.66858 16.5001 1.50059 16.3322 1.50042 16.1253V15.3753C1.50042 15.1683 1.66847 15.0005 1.87542 15.0003H16.1254ZM6.99358 1.93392C7.58178 1.76445 8.21435 1.96916 8.59124 2.4515L11.852 6.62435L13.5229 6.18588C15.0283 5.79011 16.5004 6.92522 16.5004 8.48178C16.5004 9.57125 15.7595 10.5212 14.7026 10.7855L4.91351 13.2328C4.02444 13.455 3.08906 13.1159 2.54925 12.3753L2.52776 12.3451C2.36295 12.1188 2.24159 11.8638 2.17034 11.5931L1.15374 7.73178C1.0499 7.33722 1.28101 6.93188 1.67327 6.81967L2.67522 6.53256C3.26145 6.36504 3.89054 6.56957 4.26702 7.04916L5.28851 8.35092L6.66839 7.98763L5.28069 3.20931C5.2252 3.01808 5.24804 2.81241 5.34417 2.63803C5.44035 2.4637 5.60207 2.33475 5.79339 2.27963L6.99358 1.93392ZM6.93108 3.51303L8.32366 8.30795C8.38007 8.50213 8.35594 8.7111 8.25628 8.88705C8.1566 9.06297 7.98991 9.19107 7.79437 9.24252L5.19378 9.92611C4.90467 10.0021 4.59819 9.89941 4.41351 9.66439L3.08733 7.97494L2.79144 8.0599L3.62151 11.2113C3.64528 11.3015 3.68568 11.3868 3.74065 11.4622L3.76116 11.4915C3.94099 11.7383 4.253 11.8515 4.54925 11.7777L14.3383 9.33041C14.7276 9.2331 15.0004 8.883 15.0004 8.48178C15.0004 7.90857 14.4581 7.49031 13.9037 7.63607L11.7563 8.2015C11.4665 8.27769 11.1586 8.17385 10.9741 7.93783L7.4096 3.37533L6.93108 3.51303Z" fill="#191E3B"/>
  </svg>
);

// EGDS 2 "Flight land" glyph — plane body sweeping down-right, runway line at bottom
const IconFlightLanding = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M16.125 15C16.3321 15 16.5 15.1679 16.5 15.375V16.125C16.5 16.3321 16.3321 16.5 16.125 16.5H1.875C1.66789 16.5 1.5 16.3321 1.5 16.125V15.375C1.50001 15.1679 1.6679 15 1.875 15H16.125ZM8.65039 2.05665C8.75594 1.66102 9.15938 1.42339 9.55664 1.52247L10.5801 1.77833C11.1593 1.92318 11.598 2.39746 11.6963 2.98634L12.5615 8.1797L14.6914 8.71193C15.7541 8.97759 16.5 9.93296 16.5 11.0283C16.4998 12.5811 15.0406 13.7202 13.5342 13.3438L3.2041 10.7617C2.20275 10.5112 1.50013 9.61134 1.5 8.57911V8.45118C1.5 8.2512 1.52648 8.05135 1.5791 7.85841L2.65137 3.92775C2.75868 3.53426 3.16096 3.29878 3.55664 3.39747L4.56738 3.6504C5.15908 3.79833 5.60226 4.28979 5.68848 4.89357L5.9209 6.51954L7.36426 6.8799L8.65039 2.05665ZM8.62305 7.98048C8.51738 8.3761 8.11409 8.61395 7.7168 8.51466L5.06836 7.85255C4.77251 7.77859 4.55092 7.53237 4.50781 7.23048L4.2041 5.10548L3.90527 5.03029L3.02637 8.25392C3.0089 8.31811 3 8.38466 3 8.45118V8.57911C3.00013 8.92315 3.23457 9.22321 3.56836 9.30665L13.8975 11.8887C14.4573 12.0286 14.9998 11.6053 15 11.0283C15 10.6213 14.723 10.2657 14.3281 10.167L11.7207 9.51564C11.431 9.44322 11.2112 9.20569 11.1621 8.91115L10.2158 3.23341L9.90918 3.15626L8.62305 7.98048Z" fill="#191E3B"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2C7.77614 2 8 2.22386 8 2.5V4H16V2.5C16 2.22386 16.2239 2 16.5 2H17.5C17.7761 2 18 2.22386 18 2.5V4H19C20.6569 4 22 5.34315 22 7V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V7C2 5.34315 3.34315 4 5 4H6V2.5C6 2.22386 6.22386 2 6.5 2H7.5ZM4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V10H4V19ZM8.5 16C8.77614 16 9 16.2239 9 16.5V17.5C9 17.7761 8.77614 18 8.5 18H7.5C7.22386 18 7 17.7761 7 17.5V16.5C7 16.2239 7.22386 16 7.5 16H8.5ZM12.5 16C12.7761 16 13 16.2239 13 16.5V17.5C13 17.7761 12.7761 18 12.5 18H11.5C11.2239 18 11 17.7761 11 17.5V16.5C11 16.2239 11.2239 16 11.5 16H12.5ZM16.5 16C16.7761 16 17 16.2239 17 16.5V17.5C17 17.7761 16.7761 18 16.5 18H15.5C15.2239 18 15 17.7761 15 17.5V16.5C15 16.2239 15.2239 16 15.5 16H16.5ZM8.5 12C8.77614 12 9 12.2239 9 12.5V13.5C9 13.7761 8.77614 14 8.5 14H7.5C7.22386 14 7 13.7761 7 13.5V12.5C7 12.2239 7.22386 12 7.5 12H8.5ZM12.5 12C12.7761 12 13 12.2239 13 12.5V13.5C13 13.7761 12.7761 14 12.5 14H11.5C11.2239 14 11 13.7761 11 13.5V12.5C11 12.2239 11.2239 12 11.5 12H12.5ZM16.5 12C16.7761 12 17 12.2239 17 12.5V13.5C17 13.7761 16.7761 14 16.5 14H15.5C15.2239 14 15 13.7761 15 13.5V12.5C15 12.2239 15.2239 12 15.5 12H16.5ZM5 6C4.44772 6 4 6.44772 4 7V8H20V7C20 6.44772 19.5523 6 19 6H5Z" fill="currentColor"/>
  </svg>
);

const IconPerson = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 12C16.0554 12 19.4194 14.9752 19.9783 18.8604C20.1575 20.1064 19.1192 20.9997 18.0603 21H5.9402C4.88114 21 3.84202 20.1066 4.02126 18.8604C4.58018 14.9752 7.9442 12 11.9998 12ZM11.9998 14C8.99125 14 6.50253 16.1686 6.02321 19H17.9763C17.497 16.1686 15.0083 14 11.9998 14ZM11.9998 3C14.2089 3 15.9998 4.79086 15.9998 7C15.9998 9.20914 14.2089 11 11.9998 11C9.79064 11 7.99977 9.20913 7.99977 7C7.99977 4.79087 9.79064 3.00001 11.9998 3ZM11.9998 5C10.8952 5.00001 9.99977 5.89544 9.99977 7C9.99977 8.10456 10.8952 8.99999 11.9998 9C13.1043 9 13.9998 8.10457 13.9998 7C13.9998 5.89543 13.1043 5 11.9998 5Z" fill="currentColor"/>
  </svg>
);

const IconSeat = () => (
  <svg width="24" height="24" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <path d="M12.9707 1.51193L13.0859 1.52854L13.8242 1.65939C14.6394 1.80363 15.1844 2.58141 15.041 3.3967L13.4775 12.261C13.351 12.9776 12.7277 13.5001 12 13.5002V14.2502L11.9893 14.4709C11.9675 14.6905 11.9138 14.907 11.8291 15.1115C11.7161 15.3842 11.5495 15.6323 11.3408 15.841C11.1321 16.0496 10.8839 16.2154 10.6113 16.3283C10.4069 16.413 10.1912 16.4677 9.97168 16.4895L9.75 16.5002H5.25V15.7502C5.2501 15.3362 5.58606 15.0005 6 15.0002H9.75C9.84826 15.0002 9.94631 14.9802 10.0371 14.9426C10.1278 14.905 10.2108 14.8498 10.2803 14.7805C10.3497 14.711 10.4057 14.628 10.4434 14.5373C10.4716 14.4692 10.4898 14.3966 10.4971 14.3235L10.5 14.2502V13.5002H4.5C3.67172 13.5001 3.00004 12.8285 3 12.0002V11.2502C3.00006 10.0074 4.00832 9.00072 5.25 9.00021H9.48242L9.61523 8.25021H5.625L5.5498 8.2424C5.37896 8.20748 5.25012 8.05635 5.25 7.87521V7.50021C5.25 7.22275 5.40102 6.98053 5.625 6.8508C5.73531 6.78692 5.86336 6.75026 6 6.75021H9.87891L10.4785 3.35373L10.502 3.24045C10.7594 2.11763 11.828 1.36976 12.9707 1.51193ZM12.8252 3.00607C12.4174 2.93417 12.0282 3.20678 11.9561 3.61447L10.7412 10.5002H5.25C4.83604 10.5005 4.50006 10.8362 4.5 11.2502V12.0002H12L13.5635 3.13596L12.8252 3.00607Z" />
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM11 7V12.4142L14.2929 15.7071L15.7071 14.2929L13 11.5858V7H11Z" fill="currentColor"/>
  </svg>
);

const IconSwap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M7.5 17L7.5 7M7.5 7L4 10.5M7.5 7L11 10.5M16.5 7L16.5 17M16.5 17L20 13.5M16.5 17L13 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.4392 9.14652C16.6345 8.95127 16.951 8.9513 17.1462 9.14652L17.8533 9.85355C18.0485 10.0488 18.0485 10.3653 17.8533 10.5606L12.7068 15.7071C12.3163 16.0975 11.6832 16.0975 11.2927 15.7071L6.14625 10.5606C5.95114 10.3653 5.95112 10.0488 6.14625 9.85355L6.85328 9.14652C7.04736 8.95244 7.36185 8.95088 7.55738 9.14261L11.9998 13.586L16.4392 9.14652Z" fill="currentColor"/>
  </svg>
);

/* ── Trip-type icons (EGDS-style) ─────────────────────────────────────────── */
const IconRoundtrip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.1025 13.8994C20.3593 13.8996 20.5495 14.1393 20.4775 14.3857C19.4427 17.9124 16.1856 20.488 12.3242 20.4883C12.2816 20.4883 12.2387 20.487 12.1963 20.4863V20.4971L13.6982 21.999C13.7516 22.0535 13.782 22.1278 13.7822 22.2041C13.782 22.3656 13.6498 22.497 13.4883 22.4971H11.5752C11.4429 22.497 11.3153 22.444 11.2217 22.3506L9.07422 20.2041C8.88051 20.0101 8.78335 19.7551 8.78223 19.501V19.4932C8.7834 19.2389 8.88034 18.9831 9.07422 18.7891L11.2217 16.6436C11.3153 16.5501 11.4429 16.4971 11.5752 16.4971H13.4883C13.6496 16.4971 13.7816 16.6279 13.7822 16.7891C13.7822 16.8665 13.751 16.9422 13.6963 16.9971L12.208 18.4863C12.2466 18.487 12.2855 18.4883 12.3242 18.4883C15.1055 18.488 17.4776 16.7408 18.4053 14.2842C18.4907 14.0585 18.702 13.8995 18.9434 13.8994H20.1025Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.51172 11.6006C6.3064 11.6007 7.7615 13.0559 7.76172 14.8506C7.76145 16.6452 6.30637 18.1005 4.51172 18.1006C2.71696 18.1006 1.26198 16.6453 1.26172 14.8506C1.26193 13.0558 2.71693 11.6006 4.51172 11.6006ZM4.51172 13.6006C3.82149 13.6006 3.26193 14.1604 3.26172 14.8506C3.26198 15.5407 3.82153 16.1006 4.51172 16.1006C5.2018 16.1005 5.76145 15.5406 5.76172 14.8506C5.7615 14.1605 5.20183 13.6007 4.51172 13.6006Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.4883 5.90039C21.283 5.90062 22.7383 7.35561 22.7383 9.15039C22.7379 10.9448 21.2827 12.4002 19.4883 12.4004C17.6936 12.4004 16.2387 10.945 16.2383 9.15039C16.2383 7.35546 17.6934 5.90039 19.4883 5.90039ZM19.4883 7.90039C18.7979 7.90039 18.2383 8.46003 18.2383 9.15039C18.2387 9.84038 18.7982 10.4004 19.4883 10.4004C20.1782 10.4002 20.7379 9.84024 20.7383 9.15039C20.7383 8.46018 20.1784 7.90062 19.4883 7.90039Z" fill="currentColor"/>
    <path d="M12.4248 1.5C12.5571 1.50007 12.6847 1.55306 12.7783 1.64648L14.9258 3.79297C15.1196 3.98704 15.2166 4.24185 15.2178 4.49609V4.50391C15.2167 4.75831 15.1198 5.01384 14.9258 5.20801L12.7783 7.35352C12.6846 7.44709 12.5572 7.49993 12.4248 7.5H10.5117C10.3503 7.49993 10.2182 7.36939 10.2178 7.20801C10.2178 7.13041 10.2489 7.05489 10.3037 7L11.792 5.51074C11.7534 5.51004 11.7145 5.50879 11.6758 5.50879C8.8945 5.50904 6.52237 7.25629 5.59473 9.71289C5.50941 9.93882 5.29812 10.0976 5.05664 10.0977H3.89746C3.64051 10.0975 3.45014 9.85791 3.52246 9.61133C4.55729 6.08465 7.81436 3.50906 11.6758 3.50879C11.7184 3.50879 11.7613 3.51004 11.8037 3.51074V3.5L10.3018 1.99805C10.2483 1.94341 10.2178 1.86947 10.2178 1.79297C10.218 1.63147 10.3502 1.50007 10.5117 1.5H12.4248Z" fill="currentColor"/>
  </svg>
);
const IconOneWay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.75 14.4775C6.54493 14.4775 8 15.9326 8 17.7275C7.99984 19.5223 6.54482 20.9775 4.75 20.9775C2.95518 20.9775 1.50017 19.5223 1.5 17.7275C1.5 15.9326 2.95507 14.4775 4.75 14.4775ZM4.75 16.4775C4.05964 16.4775 3.5 17.0372 3.5 17.7275C3.50016 18.4178 4.05975 18.9775 4.75 18.9775C5.44025 18.9775 5.99984 18.4178 6 17.7275C6 17.0372 5.44036 16.4775 4.75 16.4775Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.25 14.4775C21.0449 14.4775 22.5 15.9326 22.5 17.7275C22.4998 19.5223 21.0448 20.9775 19.25 20.9775C17.4552 20.9775 16.0002 19.5223 16 17.7275C16 15.9326 17.4551 14.4775 19.25 14.4775ZM19.25 16.4775C18.5596 16.4775 18 17.0372 18 17.7275C18.0002 18.4178 18.5597 18.9775 19.25 18.9775C19.9403 18.9775 20.4998 18.4178 20.5 17.7275C20.5 17.0372 19.9404 16.4775 19.25 16.4775Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.0107 3.2207C13.7377 3.22077 15.1495 4.56784 15.2539 6.26855C16.7435 6.99189 17.9581 8.19273 18.6973 9.67383L19.3975 7.66602C19.4234 7.59405 19.477 7.53425 19.5459 7.50098C19.6914 7.43125 19.8672 7.49308 19.9375 7.63867L20.7705 9.36523C20.8281 9.48473 20.8355 9.62284 20.792 9.74805L19.793 12.6182C19.7025 12.8773 19.5156 13.076 19.2871 13.1875L19.2803 13.1904C19.0506 13.3001 18.778 13.3232 18.5186 13.2324L15.6523 12.2275C15.5273 12.1837 15.424 12.0921 15.3662 11.9727L14.5332 10.2451C14.4633 10.0994 14.5238 9.92387 14.6689 9.85352C14.7387 9.82007 14.8204 9.81524 14.8936 9.84082L16.8975 10.543C16.4132 9.58364 15.656 8.78615 14.7285 8.25098C14.1478 9.1357 13.148 9.72066 12.0107 9.7207C10.8642 9.7207 9.85685 9.12638 9.27832 8.22949C7.75133 9.09492 6.6793 10.6697 6.50977 12.5059C6.48439 12.7803 6.26288 13.0038 5.9873 13.0039H4.9873C4.71086 13.0039 4.48522 12.7788 4.50391 12.5029C4.69172 9.73334 6.38324 7.37684 8.76855 6.24219C8.88582 4.55389 10.2926 3.2207 12.0107 3.2207ZM12.0107 5.2207C11.3204 5.2207 10.7607 5.78035 10.7607 6.4707C10.7609 7.16092 11.3205 7.7207 12.0107 7.7207C12.7009 7.72064 13.2606 7.16088 13.2607 6.4707C13.2607 5.78039 12.701 5.22077 12.0107 5.2207Z" fill="currentColor"/>
  </svg>
);
const IconMultiCity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.75 12.9775C6.54493 12.9775 8 14.4326 8 16.2275C7.99984 18.0223 6.54482 19.4775 4.75 19.4775C2.95518 19.4775 1.50016 18.0223 1.5 16.2275C1.5 14.4326 2.95507 12.9775 4.75 12.9775ZM4.75 14.9775C4.05964 14.9775 3.5 15.5372 3.5 16.2275C3.50016 16.9178 4.05975 17.4775 4.75 17.4775C5.44025 17.4775 5.99984 16.9178 6 16.2275C6 15.5372 5.44036 14.9775 4.75 14.9775Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.25 12.9775C21.0449 12.9775 22.5 14.4326 22.5 16.2275C22.4998 18.0223 21.0448 19.4775 19.25 19.4775C17.4552 19.4775 16.0002 18.0223 16 16.2275C16 14.4326 17.4551 12.9775 19.25 12.9775ZM19.25 14.9775C18.5596 14.9775 18 15.5372 18 16.2275C18.0002 16.9178 18.5597 17.4775 19.25 17.4775C19.9403 17.4775 20.4998 16.9178 20.5 16.2275C20.5 15.5372 19.9404 14.9775 19.25 14.9775Z" fill="currentColor"/>
    <path d="M11.9531 5.50977C14.1956 5.50977 16.2027 6.44017 17.7041 7.94238L17.8652 5.82715C17.872 5.75108 17.9088 5.67969 17.9668 5.62988C18.0894 5.52533 18.2747 5.54006 18.3799 5.66211L19.626 7.11426C19.7122 7.21466 19.7549 7.34561 19.7451 7.47754L19.5156 10.5059C19.4946 10.7793 19.364 11.0181 19.1719 11.1846L19.166 11.1904C18.9723 11.3553 18.7151 11.4475 18.4414 11.4268L15.415 11.1953C15.2829 11.1852 15.1596 11.123 15.0732 11.0225L13.8271 9.57031C13.7222 9.44773 13.7352 9.26257 13.8574 9.15723C13.9163 9.10673 13.9939 9.08106 14.0713 9.08691L16.1758 9.24707C15.0278 8.15896 13.5444 7.50882 11.9531 7.50879C9.70744 7.50893 7.67312 8.79969 6.5 10.7969C6.40652 10.956 6.23733 11.0586 6.05273 11.0586H4.89648C4.54262 11.0586 4.30155 10.7012 4.45801 10.3838C5.87613 7.50727 8.66357 5.50988 11.9531 5.50977Z" fill="currentColor"/>
  </svg>
);

/* ── Cabin-class icons ────────────────────────────────────────────────────── */
const IconCabinEconomy = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <path d="M12.9707 1.51193L13.0859 1.52854L13.8242 1.65939C14.6394 1.80363 15.1844 2.58141 15.041 3.3967L13.4775 12.261C13.351 12.9776 12.7277 13.5001 12 13.5002V14.2502L11.9893 14.4709C11.9675 14.6905 11.9138 14.907 11.8291 15.1115C11.7161 15.3842 11.5495 15.6323 11.3408 15.841C11.1321 16.0496 10.8839 16.2154 10.6113 16.3283C10.4069 16.413 10.1912 16.4677 9.97168 16.4895L9.75 16.5002H5.25V15.7502C5.2501 15.3362 5.58606 15.0005 6 15.0002H9.75C9.84826 15.0002 9.94631 14.9802 10.0371 14.9426C10.1278 14.905 10.2108 14.8498 10.2803 14.7805C10.3497 14.711 10.4057 14.628 10.4434 14.5373C10.4716 14.4692 10.4898 14.3966 10.4971 14.3235L10.5 14.2502V13.5002H4.5C3.67172 13.5001 3.00004 12.8285 3 12.0002V11.2502C3.00006 10.0074 4.00832 9.00072 5.25 9.00021H9.48242L9.61523 8.25021H5.625L5.5498 8.2424C5.37896 8.20748 5.25012 8.05635 5.25 7.87521V7.50021C5.25 7.22275 5.40102 6.98053 5.625 6.8508C5.73531 6.78692 5.86336 6.75026 6 6.75021H9.87891L10.4785 3.35373L10.502 3.24045C10.7594 2.11763 11.828 1.36976 12.9707 1.51193ZM12.8252 3.00607C12.4174 2.93417 12.0282 3.20678 11.9561 3.61447L10.7412 10.5002H5.25C4.83604 10.5005 4.50006 10.8362 4.5 11.2502V12.0002H12L13.5635 3.13596L12.8252 3.00607Z"/>
  </svg>
);
const IconCabinPremium = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.294 2.01561L18.4473 2.03807L19.4317 2.2119C20.5189 2.40407 21.2452 3.44199 21.0538 4.52928L18.9698 16.3467C18.8011 17.3021 17.9703 17.9988 17.0001 17.999V19L16.9854 19.2939C16.9565 19.5868 16.8845 19.8756 16.7715 20.1484C16.6209 20.5118 16.3993 20.8429 16.1212 21.1211C15.8429 21.3992 15.5119 21.6208 15.1485 21.7715C14.8759 21.8843 14.5876 21.9564 14.295 21.9853L14.0001 22H8.00006V21C8.00027 20.4481 8.44819 20.0003 9.00006 20H14.0001C14.131 19.9999 14.2619 19.9738 14.3829 19.9238C14.5037 19.8737 14.6145 19.7994 14.7071 19.707C14.7996 19.6144 14.8737 19.5036 14.9239 19.3828C14.9615 19.292 14.9855 19.1951 14.9952 19.0976L15.0001 19V17.999H7.00006C5.89568 17.9988 5.00009 17.1034 5.00006 15.999V14.998C5.00102 13.3426 6.3435 11.9999 7.99908 11.999H13.6436L13.8194 11H8.50006C8.22425 10.9998 8.00033 10.7758 8.00006 10.5V9.99998C8.00019 9.63032 8.2017 9.30771 8.50006 9.13475C8.6471 9.04964 8.81796 9.00005 9.00006 8.99998H14.1719L14.9708 4.47166L15.002 4.32029C15.3455 2.82351 16.7707 1.82624 18.294 2.01561ZM18.0997 4.00779C17.5561 3.91214 17.0366 4.27586 16.9405 4.81932L15.3223 13.999H8.00006C7.44832 13.9993 7.00049 14.4473 7.00006 14.999V15.999H17.0001L19.084 4.18162L18.0997 4.00779ZM6.7149 1.99998C6.87664 2.00001 7.0084 2.13062 7.00885 2.29197C7.00885 2.36956 6.97781 2.44507 6.92291 2.49998L5.41998 3.99998H11.5089C11.7848 4.0001 12.0087 4.22407 12.0089 4.49998V5.49998C12.0086 5.77586 11.7848 5.99987 11.5089 5.99998H5.41998L6.92487 7.50194C6.97841 7.55656 7.00876 7.63051 7.00885 7.70701C7.00867 7.8686 6.8768 7.99995 6.7149 7.99998H4.79791C4.66512 7.99998 4.53734 7.94721 4.44342 7.8535L2.29303 5.70701C2.09866 5.51287 2.00116 5.25829 2.00006 5.00389V4.99608C2.00114 4.74158 2.09852 4.48615 2.29303 4.29197L4.44342 2.14647C4.53733 2.05282 4.66517 1.99998 4.79791 1.99998H6.7149Z" fill="currentColor"/>
  </svg>
);
const IconCabinBusiness = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M20.5 2C21.0939 2 21.6571 2.26427 22.0371 2.7207C22.417 3.17718 22.5745 3.77926 22.4668 4.36328L19.5127 20.3633C19.3344 21.3286 18.4898 22.0014 17.5391 21.9971C17.5261 21.9973 17.5131 22 17.5 22H4C2.89543 22 2 21.1046 2 20V17C2.00001 15.3432 3.34315 14 5 14H5.6748C6.08727 12.8356 7.19508 12.0003 8.5 12H13.0898C13.5686 11.9999 13.9801 11.6604 14.0713 11.1904L15.3799 4.42871L15.4424 4.16895C15.8087 2.89547 16.9781 2 18.3252 2H20.5ZM5 16C4.44772 16 4.00001 16.4477 4 17V20H5.5V16H5ZM18.3252 4C17.8464 4 17.435 4.3396 17.3438 4.80957L16.0352 11.5703L15.9727 11.8301C15.6066 13.1044 14.4369 13.9999 13.0898 14H8.5C7.94794 14.0001 7.50018 14.448 7.5 15V20H17.5V19.9922L17.5459 20L20.5 4H18.3252ZM14 16C14.2761 16 14.5 16.2239 14.5 16.5V17.5C14.5 17.7761 14.2761 18 14 18H10C9.72397 17.9999 9.5 17.7761 9.5 17.5V16.5C9.50001 16.2239 9.72398 16.0001 10 16H14Z" fill="currentColor"/>
  </svg>
);
const IconCabinFirst = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.5226 4.42285C17.4318 3.11979 19.2101 2.75027 20.5685 3.59766L20.5695 3.59668L21.4181 4.12598C21.8681 4.40675 22.1881 4.85535 22.3078 5.37207C22.4273 5.88894 22.3369 6.43287 22.0558 6.88281L15.6965 17.0596C15.3538 17.6079 14.7682 17.955 14.1281 17.9961L14.0002 18V19.001L13.9855 19.2949C13.9566 19.5879 13.8847 19.8766 13.7717 20.1494C13.6209 20.5129 13.3995 20.8438 13.1213 21.1221C12.8429 21.4003 12.5121 21.6218 12.1486 21.7725C11.8759 21.8853 11.5878 21.9574 11.2951 21.9863L11.0002 22.001H5.00017V21.001C5.00017 20.4488 5.44809 20.0012 6.00017 20.001H11.0002C11.1312 20.0009 11.2619 19.9749 11.383 19.9248C11.504 19.8746 11.6145 19.8006 11.7072 19.708C11.7998 19.6154 11.8737 19.5047 11.924 19.3838C11.9616 19.2929 11.9856 19.1962 11.9953 19.0986L12.0002 19.001V18H5.00017C3.89573 17.9999 3.00023 17.1044 3.00017 16V15C3.00043 13.3436 4.34339 12.0008 5.99919 12H11.7834L12.4084 11H6.50017C6.22412 10.9999 6.00017 10.7761 6.00017 10.5V10C6.00021 9.63014 6.20162 9.30774 6.50017 9.13477C6.64726 9.04961 6.81798 9.00004 7.00017 9H13.5002C13.5499 9.00001 13.5974 9.0099 13.6427 9.02344L16.4367 4.55176L16.5226 4.42285ZM19.5109 5.29395C19.0426 5.00154 18.4256 5.14314 18.133 5.61133L12.8918 14H6.00017C5.44815 14.0002 5.00026 14.4479 5.00017 15V16H14.0002L20.3595 5.82324L19.5109 5.29395ZM10.2023 1C10.3349 1.00006 10.462 1.05295 10.5558 1.14648L12.7062 3.29297C12.9008 3.48723 12.9992 3.74148 13.0002 3.99609V4.00391C12.9992 4.25852 12.9008 4.51277 12.7062 4.70703L10.5558 6.85352C10.462 6.94705 10.3349 6.99994 10.2023 7H8.28435C8.1225 6.99978 7.99138 6.86865 7.99138 6.70703C7.9914 6.62943 8.02238 6.5549 8.07732 6.5L9.57927 5H7.99138C5.9478 5.0001 4.26084 6.52741 4.01482 8.50098C3.98064 8.77493 3.76009 8.99991 3.48357 9H2.48161C2.20512 8.99986 1.97843 8.77511 2.00114 8.5C2.25564 5.42029 4.84071 3.0001 7.99138 3H9.57927L8.07536 1.49805C8.02165 1.44335 7.9914 1.36964 7.99138 1.29297C7.99138 1.13135 8.1225 1.00022 8.28435 1H10.2023Z" fill="currentColor"/>
  </svg>
);

// ─── Field values ─────────────────────────────────────────────────────────────

interface FieldValues {
  where: string;
  when: string;
  adults: number;
  children: number;
  infants: number;
  infantsInSeat: number;
  infantsOnLap: number;
  rooms: number;
  // Flights / Packages
  origin: string;
  cabinClass: string;
  // Cars
  carDropoff: string;
  pickupTime: string;
  dropoffTime: string;
  // Cruises
  duration: string;
}

const LOB_PILL_LABELS: Record<string, string> = {
  stays: 'Search for stays', flights: 'Search for flights',
  cars: 'Search for cars', packages: 'Search for packages',
  activities: 'Search for activities', cruises: 'Search for cruises',
};

const WARM_FIELDS: FieldValues = {
  where: 'New York (and vicinity), NY, United States',
  when: 'Wed, Jul 29 – Fri, Jul 31',
  adults: 2,
  children: 0,
  infants: 0,
  infantsInSeat: 0,
  infantsOnLap: 0,
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
  infantsInSeat: 0,
  infantsOnLap: 0,
  rooms: 1,
  origin: '',
  cabinClass: 'Economy',
  carDropoff: '',
  pickupTime: '10:00am',
  dropoffTime: '10:00am',
  duration: '',
};

const SUGGESTIONS = [
  'New York, NY, United States',
  'London, United Kingdom',
  'Paris, France',
  'Tokyo, Japan',
  'Dubai, United Arab Emirates',
  'Los Angeles, CA, United States',
  'Barcelona, Spain',
  'Alaska',
];

const ORIGIN_SUGGESTIONS = [
  'Austin, TX (AUS-Austin-Bergstrom-Intl.)',
  'New York, JFK (JFK-John F. Kennedy Intl.)',
  'Los Angeles, CA (LAX-Los Angeles Intl.)',
  'Chicago, IL (ORD-O\'Hare Intl.)',
  'Miami, FL (MIA-Miami Intl.)',
];

const TIME_OPTIONS = [
  '6:00am', '6:30am', '7:00am', '7:30am', '8:00am', '8:30am',
  '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
  '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm',
  '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '5:30pm',
  '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm',
];

const DURATION_OPTIONS = [
  '1-3 nights', '3-5 nights', '3-9 nights', '5-7 nights',
  '7-10 nights', '10-14 nights', '14+ nights',
];

// ─── Field sheet (shared interaction layer) ───────────────────────────────────

type CloseReason = 'dismiss' | 'commit';

// ── ProTravelersSheet — proper component so hooks work correctly ───────────
interface ProTravelersSheetProps {
  lob: LobId;
  fieldValues: FieldValues;
  sheetSpring: object;
  closing?: boolean;
  closeTransition?: object;
  onClose: (reason?: CloseReason) => void;
  onChange: (v: Partial<FieldValues>) => void;
  onCloseComplete?: () => void;
}

const ProTravelersSheet: React.FC<ProTravelersSheetProps> = ({
  lob, fieldValues, sheetSpring, closing = false, closeTransition, onClose, onChange, onCloseComplete,
}) => {
  // Stays / Packages → room-based; everything else → flat people list
  const isRoomBased = lob === 'stays' || lob === 'packages';

  // Room-based state (stays/packages)
  const [rooms, setRooms] = useState<{adults: number; children: number}[]>(
    [{ adults: fieldValues.adults ?? 2, children: fieldValues.children ?? 0 }]
  );
  const updateRoom = (idx: number, key: 'adults' | 'children', val: number) =>
    setRooms(r => r.map((room, i) => i === idx ? { ...room, [key]: val } : room));
  const addRoom    = () => setRooms(r => [...r, { adults: 2, children: 0 }]);
  const removeRoom = (idx: number) => setRooms(r => r.filter((_, i) => i !== idx));

  // Flat people state (flights/cars/etc.)
  const [adults,      setAdults]      = useState(fieldValues.adults ?? 1);
  const [children,    setChildren]    = useState(fieldValues.children ?? 0);
  const [infantsSeat, setInfantsSeat] = useState(0);
  const [infantsLap,  setInfantsLap]  = useState(fieldValues.infants ?? 0);
  const [childAges,   setChildAges]   = useState<number[]>([]);
  const [openChildAge, setOpenChildAge] = useState<number | null>(null);

  // Keep childAges array length in sync with children count
  useEffect(() => {
    setChildAges(prev => {
      if (prev.length === children) return prev;
      if (prev.length < children) return [...prev, ...Array(children - prev.length).fill(0)];
      return prev.slice(0, children);
    });
  }, [children]);

  const totalAdults   = isRoomBased ? rooms.reduce((s, r) => s + r.adults, 0)   : adults;
  const totalChildren = isRoomBased ? rooms.reduce((s, r) => s + r.children, 0) : children;

  const StepRow = ({ label, sub, value, min, max, onCh }: {
    label: string; sub?: string; value: number; min: number; max: number; onCh: (v: number) => void;
  }) => (
    <div className="bex-si">
      <div className="bex-si__labels">
        <span className="bex-si__label">{label}</span>
        {sub && <span className="bex-si__sub">{sub}</span>}
      </div>
      <div className="bex-si__controls">
        <button type="button" onClick={() => onCh(Math.max(min, value - 1))} disabled={value <= min}
          className={`bex-si__btn${value <= min ? ' bex-si__btn--dim' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>
        </button>
        <span className="bex-si__value">{value}</span>
        <button type="button" onClick={() => onCh(Math.min(max, value + 1))} disabled={value >= max}
          className={`bex-si__btn${value >= max ? ' bex-si__btn--dim' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      className="bex-fs bex-pro-trav"
      initial={{ y: '100%' }}
      animate={{ y: closing ? '100%' : 0 }}
      exit={{ y: '100%' }}
      transition={(closing ? closeTransition : sheetSpring) as any}
      onAnimationComplete={() => {
        if (closing) onCloseComplete?.();
      }}
    >
      <button type="button" className="bex-pro-trav__close" onClick={() => onClose('dismiss')} aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <div className="bex-pro-trav__body">
        {isRoomBased ? (
          /* Stays / Packages — room-based */
          <>
            {rooms.map((room, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <div className="bex-pro-trav__room-divider" />}
              <div className="bex-pro-trav__room">
                <p className="bex-pro-trav__room-label">Room {idx + 1}</p>
                <StepRow label="Adults" value={room.adults} min={1} max={14}
                  onCh={v => updateRoom(idx, 'adults', v)} />
                <StepRow label="Children" sub="Ages 0 to 17" value={room.children} min={0} max={6}
                  onCh={v => updateRoom(idx, 'children', v)} />
                {rooms.length > 1 && (
                  <div className="bex-pro-trav__remove-row">
                    <button type="button" className="bex-pro-trav__remove" onClick={() => removeRoom(idx)}>
                      Remove room
                    </button>
                  </div>
                )}
              </div>
              </React.Fragment>
            ))}
            {rooms.length < 8 && (
              <div className="bex-pro-trav__add-row">
                <button type="button" className="bex-pro-trav__add" onClick={addRoom}>
                  Add another room
                </button>
              </div>
            )}
          </>
        ) : (
          /* Flights / Cars / others — flat people list, no rooms, no cabin class */
          <div className="bex-pro-trav__room">
            <StepRow label="Adults" value={adults} min={1} max={9}
              onCh={setAdults} />
            <StepRow label="Children" sub="Ages 2 to 17" value={children} min={0} max={8}
              onCh={v => { setChildren(v); setOpenChildAge(null); }} />
            {/* Per-child age selectors */}
            {children > 0 && (
              <div className="bex-pro-trav__child-ages">
                {Array.from({ length: children }, (_, i) => (
                  <div key={i} className="bex-pro-trav__child-age-row">
                    <span className="bex-pro-trav__child-age-label">Child {i + 1} age</span>
                    <div className="bex-pro-trav__child-age-wrap">
                      <button
                        type="button"
                        className={`bex-pro-trav__child-age-btn${openChildAge === i ? ' bex-pro-trav__child-age-btn--open' : ''}`}
                        onClick={() => setOpenChildAge(openChildAge === i ? null : i)}
                      >
                        <span className="bex-pro-trav__child-age-val">{childAges[i] ?? 0}</span>
                        <span className="bex-pro-trav__child-age-chevron">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.4392 9.14652C16.6345 8.95127 16.951 8.9513 17.1462 9.14652L17.8533 9.85355C18.0485 10.0488 18.0485 10.3653 17.8533 10.5606L12.7068 15.7071C12.3163 16.0975 11.6832 16.0975 11.2927 15.7071L6.14625 10.5606C5.95114 10.3653 5.95112 10.0488 6.14625 9.85355L6.85328 9.14652C7.04736 8.95244 7.36185 8.95088 7.55738 9.14261L11.9998 13.586L16.4392 9.14652Z" fill="currentColor"/>
                          </svg>
                        </span>
                      </button>
                      {openChildAge === i && (
                        <div className="bex-pro-trav__child-age-menu">
                          {Array.from({ length: 18 }, (_, age) => (
                            <button key={age} type="button"
                              className={`bex-pro-trav__child-age-opt${(childAges[i] ?? 0) === age ? ' bex-pro-trav__child-age-opt--sel' : ''}`}
                              onClick={() => {
                                setChildAges(prev => prev.map((a, idx) => idx === i ? age : a));
                                setOpenChildAge(null);
                              }}>
                              {age}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <StepRow label="Infants in seat" sub="Younger than 2" value={infantsSeat} min={0} max={adults}
              onCh={setInfantsSeat} />
            <StepRow label="Infants on lap" sub="Younger than 2" value={infantsLap} min={0} max={adults}
              onCh={setInfantsLap} />
          </div>
        )}
      </div>

      <div className="bex-pro-trav__footer">
        <button type="button" className="bex-pro-trav__done"
          onClick={() => {
            onChange({
              adults: totalAdults,
              children: totalChildren,
              infants: isRoomBased ? 0 : infantsSeat + infantsLap,
              rooms: isRoomBased ? rooms.length : 1,
            });
            onClose('commit');
          }}>
          Done
        </button>
      </div>
    </motion.div>
  );
};

type HandoffBox = {
  left: number; top: number; width: number; height: number; text: string;
  textLeft: number; textTop: number; textWidth: number; textHeight: number;
};
type LayoutBox = { left: number; top: number; width: number; height: number };
type HandoffAnim = {
  from: LayoutBox;
  to: LayoutBox;
  surfaceTo: LayoutBox;
  fromText: LayoutBox;
  toText: LayoutBox;
};

/** Viewport pixels → overlay layout pixels (handles iPhone-frame zoom). */
function viewportToOverlayBox(box: LayoutBox, overlay: HTMLElement): LayoutBox {
  const o = overlay.getBoundingClientRect();
  const sx = o.width / overlay.clientWidth || 1;
  const sy = o.height / overlay.clientHeight || 1;
  return {
    left: (box.left - o.left) / sx,
    top: (box.top - o.top) / sy,
    width: box.width / sx,
    height: box.height / sy,
  };
}

/** Resting box of `el` inside the overlay, ignoring the sheet's slide transform. */
function restBoxInOverlay(el: HTMLElement, overlay: HTMLElement, card: HTMLElement): LayoutBox {
  const cardTop = overlay.clientHeight - card.offsetHeight;
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== card) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return {
    left,
    top: cardTop + top,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

interface SheetProps {
  type: FieldType;
  lob: LobId;
  fieldValues: FieldValues;
  onClose: (reason?: CloseReason) => void;
  onChange: (v: Partial<FieldValues>) => void;
  handoff?: HandoffBox | null;
}

// ─── Destination suggestions ──────────────────────────────────────────────────
// Kinds match EGDS2 typeahead icon spec (Figma: ObKdPkKTCJTynraxUq5Qww/6047:34)

type SuggestionKind = 'allAirports' | 'airport' | 'city' | 'neighborhood' | 'poi' | 'hotel' | 'activity' | 'busStation';
interface SuggestionPro { kind: SuggestionKind; primary: string; secondary: string; }

const ALL_SUGGESTIONS_PRO: SuggestionPro[] = [
  // New York
  { kind: 'city',         primary: 'New York (and vicinity)',          secondary: 'New York, United States' },
  { kind: 'allAirports',  primary: 'New York (JFK, LGA, EWR)',         secondary: 'New York, United States' },
  { kind: 'airport',      primary: 'New York (JFK – John F. Kennedy)', secondary: '15 mi from city center' },
  { kind: 'airport',      primary: 'New York (LGA – LaGuardia)',       secondary: '8 mi from city center' },
  { kind: 'neighborhood', primary: 'Manhattan, New York',              secondary: 'New York, United States' },
  { kind: 'neighborhood', primary: 'Brooklyn, New York',               secondary: 'New York, United States' },
  { kind: 'hotel',        primary: 'The Plaza Hotel',                  secondary: 'Midtown Manhattan, New York' },
  { kind: 'poi',          primary: 'Times Square',                     secondary: 'Manhattan, New York' },
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
  { kind: 'poi',          primary: 'Griffith Observatory',             secondary: 'Los Feliz, Los Angeles' },
  // Barcelona / Rome / Seoul / Sydney / Cancún
  { kind: 'city',         primary: 'Barcelona',                        secondary: 'Spain' },
  { kind: 'poi',          primary: 'Sagrada Família',                  secondary: 'Barcelona, Spain' },
  { kind: 'city',         primary: 'Rome',                             secondary: 'Italy' },
  { kind: 'poi',          primary: 'Colosseum',                        secondary: 'Rome, Italy' },
  { kind: 'city',         primary: 'Seoul',                            secondary: 'South Korea' },
  { kind: 'allAirports',  primary: 'Seoul (SEL – All Airports)',       secondary: 'South Korea' },
  { kind: 'airport',      primary: 'Seoul (ICN – Incheon Intl.)',      secondary: '30 mi from city center' },
  { kind: 'city',         primary: 'Sydney',                           secondary: 'Australia' },
  { kind: 'poi',          primary: 'Sydney Opera House',               secondary: 'Sydney, Australia' },
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

const INITIAL_RECENT_SEARCHES_PRO: SuggestionPro[] = [
  { kind: 'city', primary: 'New York (and vicinity)', secondary: 'New York, United States' },
  { kind: 'city', primary: 'London', secondary: 'United Kingdom' },
  { kind: 'city', primary: 'Paris', secondary: 'France' },
];

const SUGGESTED_DESTINATIONS_PRO: SuggestionPro[] = [
  { kind: 'city', primary: 'Tokyo, Japan', secondary: 'Inspired by your past trips to Japan' },
  { kind: 'city', primary: 'Dubai, United Arab Emirates', secondary: 'Great flight and hotel deals for your dates' },
  { kind: 'city', primary: 'Los Angeles, California', secondary: 'Popular with travelers near you' },
  { kind: 'city', primary: 'Barcelona, Spain', secondary: 'Great-value stays available now' },
  { kind: 'city', primary: 'Sydney, Australia', secondary: 'Inspired by your past beach trips' },
  { kind: 'city', primary: 'Cancún, Mexico', secondary: 'Member prices on beachfront stays' },
];

// ── EGDS2 typeahead icons (per Figma spec ObKdPkKTCJTynraxUq5Qww/6047:34) ───

// lob_flights — airplane (airport / all airports / metrocode)
const IconSuggestAirportPro = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#191e3b"/>
  </svg>
);

// location_city — city skyline (city / multicity / neighborhood)
const IconSuggestCityPro = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5v-2h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="#191e3b"/>
  </svg>
);

// place — map pin (POI)
const IconSuggestPoiPro = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#191e3b"/>
  </svg>
);

// bed — hotel bed (hotel)
const IconSuggestHotelPro = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#191e3b"/>
  </svg>
);

// lob_activities — star ticket (activity)
const IconSuggestActivityPro = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 12c0-1.1.9-2 2-2v-2c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v2c1.1 0 2 .9 2 2s-.9 2-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c-1.1 0-2-.9-2-2zm-4.42 3.8L12 13.67l-3.58 2.13 1-4.03-3.08-2.61 4.03-.35L12 5.08l1.63 3.73 4.03.35-3.08 2.61 1 4.03z" fill="#191e3b"/>
  </svg>
);

// directions_bus — front-view bus (bus station)
const IconSuggestBusPro = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" fill="#191e3b"/>
  </svg>
);

const IconSuggestHistoryPro = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9 1.66699C13.1421 1.66699 16.5 5.39763 16.5 10C16.5 14.6024 13.1421 18.333 9 18.333C5.25273 18.333 2.14688 15.2799 1.58887 11.29C1.55482 11.0466 1.72942 10.833 1.95117 10.833H2.71484C2.90401 10.833 3.06293 10.9905 3.09668 11.1973C3.60433 14.3078 6.05415 16.667 9 16.667C12.3137 16.667 15 13.6819 15 10C15 6.3181 12.3137 3.33301 9 3.33301C7.10539 3.33301 5.416 4.30914 4.31641 5.83301H6.48438C6.71781 5.83301 6.83306 6.15685 6.67188 6.33594L5.73438 7.37793C5.66408 7.45593 5.56908 7.49998 5.46973 7.5H2.25C1.83588 7.5 1.50015 7.12709 1.5 6.66699V3.08887C1.5001 2.97869 1.53935 2.87293 1.60938 2.79492L2.54688 1.75293C2.70798 1.57393 2.99972 1.70182 3 1.96094V4.99902C4.36835 2.97547 6.54665 1.66699 9 1.66699ZM9.375 5.83301C9.5821 5.83301 9.75 6.01989 9.75 6.25V9.65527L11.7354 11.8604C11.8815 12.023 11.8815 12.2865 11.7354 12.4492L11.2051 13.0391C11.0587 13.2016 10.8213 13.2014 10.6748 13.0391L8.25 10.3447V6.25C8.25 6.01989 8.4179 5.83301 8.625 5.83301H9.375Z" fill="#191E3B"/>
  </svg>
);

function SuggestionIconPro({ kind }: { kind: SuggestionKind }) {
  if (kind === 'allAirports' || kind === 'airport') return <IconSuggestAirportPro />;
  if (kind === 'hotel')                             return <IconSuggestHotelPro />;
  if (kind === 'poi')                               return <IconSuggestPoiPro />;
  if (kind === 'activity')                          return <IconSuggestActivityPro />;
  if (kind === 'busStation')                        return <IconSuggestBusPro />;
  return <IconSuggestCityPro />; // city, neighborhood
}

// ── Calendar helpers ──────────────────────────────────────────────────────────
const CAL_DAYS_PRO = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const _MOCK_PRICE_MAP_PRO = [370,407,408,370,370,300,300,300,300,300,300,300,268,265,268,265,265,265,268,265,265,265,265,281,265,268,268,265,265,265,265];
function getMockPricePro(date: Date): { price: string; isGood: boolean } {
  const price = _MOCK_PRICE_MAP_PRO[(date.getDate() - 1) % _MOCK_PRICE_MAP_PRO.length];
  return { price: `$${price}`, isGood: price <= 268 };
}
const CAL_MONTH_NAMES_PRO = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const SHORT_MONTH_NAMES_PRO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getCalDaysPro(year: number, month: number): (Date | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
function sameDayPro(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatRangeLabelPro(start: Date | null, end: Date | null): string {
  if (!start) return '';
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

const FieldSheet: React.FC<SheetProps> = ({ type, lob, fieldValues, onClose, onChange, handoff }) => {
  const initialQuery = type === 'origin' ? fieldValues.origin : fieldValues.where;
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES_PRO);
  const [handoffDone, setHandoffDone] = useState(!handoff);
  const [handoffPhase, setHandoffPhase] = useState<'in' | 'out'>('in');
  const [handoffAnim, setHandoffAnim] = useState<HandoffAnim | null>(null);
  const [closeLabel, setCloseLabel] = useState(handoff?.text ?? '');
  const handoffStartedAt = useRef(0);
  const closeReasonRef = useRef<CloseReason>('dismiss');
  const closingLockRef = useRef(false);
  const closeMeasuredRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Travelers state
  const [adults,   setAdults]   = useState(fieldValues.adults);
  const [children, setChildren] = useState(fieldValues.children);
  const [infants,  setInfants]  = useState(fieldValues.infants ?? 0);
  const [pets,     setPets]     = useState(false);

  // Calendar state
  const today = new Date();
  const [calTab,       setCalTab]       = useState<'exact' | 'flexible'>('exact');
  const [displayMonth, setDisplayMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rangeStart,   setRangeStart]   = useState<Date | null>(null);
  const [rangeEnd,     setRangeEnd]     = useState<Date | null>(null);
  const [hoverDate,    setHoverDate]    = useState<Date | null>(null);
  const [flexibility,  setFlexibility]  = useState('Exact dates');
  const [flexDur,      setFlexDur]      = useState('');
  const [mustWeekend,  setMustWeekend]  = useState(false);
  const [flexMonths,   setFlexMonths]   = useState<string[]>([]);

  useLayoutEffect(() => {
    if ((type !== 'where' && type !== 'origin')) return;
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const pill = pillRef.current;
    if (!overlay || !card || !pill) return;

    const fieldValueEl = document.querySelector('.bex-hero-pro__field-value--handoff') as HTMLElement | null;
    const fieldBtn = fieldValueEl?.closest('.bex-hero-pro__field') as HTMLElement | null;

    if (handoffPhase === 'out') {
      // On commit, the field label may have grown; retarget the landing box
      // before paint so the reverse morph doesn't start at the old size.
      if (closeReasonRef.current !== 'commit' || closeMeasuredRef.current) return;
      if (!fieldBtn || !fieldValueEl) return;
      const fieldBox = viewportToOverlayBox(fieldBtn.getBoundingClientRect(), overlay);
      const fieldTextBox = viewportToOverlayBox(fieldValueEl.getBoundingClientRect(), overlay);
      closeMeasuredRef.current = true;
      setHandoffAnim(prev => prev ? {
        ...prev,
        from: fieldBox,
        fromText: {
          left: fieldTextBox.left - fieldBox.left,
          top: fieldTextBox.top - fieldBox.top,
          width: fieldTextBox.width,
          height: fieldTextBox.height,
        },
      } : prev);
      return;
    }

    const fieldBox = fieldBtn
      ? viewportToOverlayBox(fieldBtn.getBoundingClientRect(), overlay)
      : handoff
        ? viewportToOverlayBox(handoff, overlay)
        : null;
    const fieldTextBox = fieldValueEl
      ? viewportToOverlayBox(fieldValueEl.getBoundingClientRect(), overlay)
      : handoff
        ? viewportToOverlayBox({
            left: handoff.textLeft,
            top: handoff.textTop,
            width: handoff.textWidth,
            height: handoff.textHeight,
          }, overlay)
        : null;

    const livePill = viewportToOverlayBox(pill.getBoundingClientRect(), overlay);
    const liveInput = inputRef.current
      ? viewportToOverlayBox(inputRef.current.getBoundingClientRect(), overlay)
      : {
          left: livePill.left + 20,
          top: livePill.top + (livePill.height - 18) / 2,
          width: Math.max(livePill.width - 40, 80),
          height: 18,
        };

    const restPill = restBoxInOverlay(pill, overlay, card);
    const to = restPill.width >= 80 ? restPill : livePill;
    const restInput = inputRef.current
      ? restBoxInOverlay(inputRef.current, overlay, card)
      : liveInput;
    const surfaceTo = {
      left: card.offsetLeft,
      top: overlay.clientHeight - card.offsetHeight,
      width: card.offsetWidth,
      height: card.offsetHeight,
    };

    if (!handoff || !fieldBox || !fieldTextBox) return;
    const src = viewportToOverlayBox(handoff, overlay);
    const srcText = viewportToOverlayBox({
      left: handoff.textLeft,
      top: handoff.textTop,
      width: handoff.textWidth,
      height: handoff.textHeight,
    }, overlay);
    setHandoffAnim({
      from: src,
      to,
      surfaceTo,
      fromText: {
        left: srcText.left - src.left,
        top: srcText.top - src.top,
        width: srcText.width,
        height: srcText.height,
      },
      toText: {
        left: restInput.left - to.left,
        top: restInput.top - to.top,
        width: restInput.width,
        height: restInput.height,
      },
    });
    handoffStartedAt.current = performance.now();
  }, [handoff, type, handoffPhase, fieldValues.where, fieldValues.origin]);

  useEffect(() => {
    if (type !== 'where' && type !== 'origin') return;
    if (handoffPhase === 'out') return;
    if (handoff && !handoffDone) return;
    const timer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 40);
    return () => clearTimeout(timer);
  }, [type, handoff, handoffDone, handoffPhase]);

  useEffect(() => {
    if (handoffPhase === 'out') {
      const fallback = setTimeout(() => finishClose(), 480);
      return () => clearTimeout(fallback);
    }
    if (!handoff || handoffDone) return;
    const fallback = setTimeout(() => setHandoffDone(true), 720);
    return () => clearTimeout(fallback);
  }, [handoff, handoffDone, handoffPhase]);

  const finishClose = () => {
    if (closingLockRef.current) return;
    closingLockRef.current = true;
    onClose(closeReasonRef.current);
  };

  const requestClose = (reason: CloseReason = 'dismiss', label?: string) => {
    if (closingLockRef.current || handoffPhase === 'out') return;
    closeReasonRef.current = reason;
    inputRef.current?.blur();
    const fallbackLabel = type === 'origin' ? 'Leaving from' : 'Where to?';
    setCloseLabel(
      reason === 'commit'
        ? (label ?? query)
        : (handoff?.text || fallbackLabel)
    );
    closeMeasuredRef.current = false;
    handoffStartedAt.current = performance.now();
    setHandoffPhase('out');
  };

  const commitDestination = (value: string) => {
    if (type === 'origin') onChange({ origin: value });
    else onChange({ where: value });
    setQuery(value);
    requestClose('commit', value);
  };

  const filtered = ALL_SUGGESTIONS_PRO.filter(s =>
    query.trim()
      ? s.primary.toLowerCase().includes(query.toLowerCase()) ||
        s.secondary.toLowerCase().includes(query.toLowerCase())
      : true
  ).slice(0, 7);
  const selectedPlace = initialQuery.split(/[,(]/)[0].trim().toLowerCase();
  const isReopenedWithValue = initialQuery.trim().length > 0 && query === initialQuery;
  const nearbySuggestions = selectedPlace
    ? ALL_SUGGESTIONS_PRO.filter(s => {
        const searchable = `${s.primary} ${s.secondary}`.toLowerCase();
        const isCurrentSelection = initialQuery.toLowerCase().startsWith(s.primary.toLowerCase());
        return searchable.includes(selectedPlace) && !isCurrentSelection;
      }).slice(0, 7)
    : [];

  // ── StepInput ────────────────────────────────────────────────────────────
  const StepInput = ({ label, sub, value, min, max, onCh }: {
    label: string; sub?: string; value: number; min: number; max: number; onCh: (v: number) => void;
  }) => (
    <div className="bex-si">
      <div className="bex-si__labels">
        <span className="bex-si__label">{label}</span>
        {sub && <span className="bex-si__sub">{sub}</span>}
      </div>
      <div className="bex-si__controls">
        <button type="button" onClick={() => onCh(Math.max(min, value - 1))} disabled={value <= min}
          className={`bex-si__btn${value <= min ? ' bex-si__btn--dim' : ''}`} aria-label={`Decrease ${label}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>
        </button>
        <span className="bex-si__value">{value}</span>
        <button type="button" onClick={() => onCh(Math.min(max, value + 1))} disabled={value >= max}
          className={`bex-si__btn${value >= max ? ' bex-si__btn--dim' : ''}`} aria-label={`Increase ${label}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  );

  // ── CalMonth ──────────────────────────────────────────────────────────────
  const CalMonth = ({ year, month }: { year: number; month: number }) => {
    const cells  = getCalDaysPro(year, month);
    const todayD = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return (
      <div className="bex-cal__month">
        <div className="bex-cal__month-header">{CAL_MONTH_NAMES_PRO[month]} {year}</div>
        {/* DOW row rendered per-month in Pro (Square Calendar variant) */}
        <div className="bex-cal__dow-row bex-cal__dow-row--pro">
          {CAL_DAYS_PRO.map((d, i) => <span key={i} className="bex-cal__dow">{d}</span>)}
        </div>
        <div className="bex-cal__grid">
          {cells.map((date, i) => {
            if (!date) return <span key={i} className="bex-cal__cell bex-cal__cell--empty" />;
            const isPast  = date < todayD;
            const isToday = sameDayPro(date, todayD);
            const isStart = rangeStart && sameDayPro(date, rangeStart);
            const isEnd   = rangeEnd   && sameDayPro(date, rangeEnd);
            const preview = rangeStart && !rangeEnd && hoverDate;
            const low  = rangeStart && (rangeEnd ?? (preview && hoverDate! >= rangeStart ? hoverDate : null));
            const high = low === rangeEnd ? rangeEnd : (low === hoverDate ? hoverDate : null);
            const inRange = low && high && date > (rangeStart ?? low) && date < high;
            const cx = ['bex-cal__cell',
              isPast  ? 'bex-cal__cell--past'  : '',
              isStart ? 'bex-cal__cell--sel bex-cal__cell--start' : '',
              isEnd   ? 'bex-cal__cell--sel bex-cal__cell--end'   : '',
              inRange ? 'bex-cal__cell--range' : '',
            ].filter(Boolean).join(' ');
            const mock = !isPast ? getMockPricePro(date) : null;
            return (
              <button key={i} type="button" className={cx} disabled={isPast}
                onClick={() => {
                  if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(date); setRangeEnd(null); }
                  else if (date < rangeStart) { setRangeStart(date); setRangeEnd(null); }
                  else { setRangeEnd(date); }
                }}
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}>
                <span className="bex-cal__cell-day">{date.getDate()}</span>
                {mock && (
                  <span className={`bex-cal__cell-price${(isStart || isEnd) ? ' bex-cal__cell-price--on-sel' : mock.isGood ? ' bex-cal__cell-price--good' : ''}`}>
                    {mock.price}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const destIsPlaceholder = handoffPhase === 'out'
    ? !closeLabel.trim() || closeLabel === (type === 'origin' ? 'Leaving from' : 'Where to?')
    : !initialQuery.trim();
  const handoffLabel = handoffPhase === 'out' ? closeLabel : (handoff?.text ?? '');
  const ghostSettled = handoffDone && handoffPhase === 'in';
  const showHandoffGhost = (type === 'where' || type === 'origin') && !!handoffAnim;
  const typeTween = { duration: 0.36, ease: [0.22, 1, 0.36, 1] } as const;
  const closeEase = { type: 'tween' as const, duration: 0.42, ease: [0.32, 0.72, 0, 1] };
  const nextMonth   = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1);
  const sheetSpring = { type: 'spring', stiffness: 420, damping: 42, mass: 0.8 } as const;
  const handoffMove = handoffPhase === 'out' ? closeEase : sheetSpring;
  const handoffType = handoffPhase === 'out' ? closeEase : typeTween;
  const destPillBox = handoffAnim && (handoffPhase === 'out' ? handoffAnim.from : handoffAnim.to);
  const destTextBox = handoffAnim && (handoffPhase === 'out' ? handoffAnim.fromText : handoffAnim.toText);

  return (
    <div className="bex-fs-overlay" ref={overlayRef}>
      {/* Scrim */}
      <motion.div className="bex-fs-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: handoffPhase === 'out' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={handoffPhase === 'out' ? closeEase : { duration: 0.28 }}
        onClick={() => requestClose('dismiss')} />

      {/* ── WHERE / ORIGIN — full-screen dark modal (Figma 7051:495637) ─────── */}
      {(type === 'where' || type === 'origin') && (
        <>
          {handoff && handoffAnim && (
            <motion.div
              className="bex-pro-dest__morph-surface"
              initial={{
                x: handoffAnim.from.left,
                y: handoffAnim.from.top,
                width: handoffAnim.from.width,
                height: handoffAnim.from.height,
                borderRadius: 12,
              }}
              animate={{
                x: handoffPhase === 'out' ? handoffAnim.from.left : handoffAnim.surfaceTo.left,
                y: handoffPhase === 'out' ? handoffAnim.from.top : handoffAnim.surfaceTo.top,
                width: handoffPhase === 'out' ? handoffAnim.from.width : handoffAnim.surfaceTo.width,
                height: handoffPhase === 'out' ? handoffAnim.from.height : handoffAnim.surfaceTo.height,
                borderRadius: handoffPhase === 'out' ? 12 : '32px 32px 0 0',
              }}
              transition={handoffMove}
              onAnimationComplete={() => {
                if (handoffPhase !== 'out') return;
                if (performance.now() - handoffStartedAt.current < 280) return;
                finishClose();
              }}
              aria-hidden="true"
            />
          )}
          <motion.div
            ref={cardRef}
            className={`bex-pro-dest__card${handoffPhase === 'out' ? ' bex-pro-dest__card--closing' : ''}`}
            initial={handoff ? { opacity: 0 } : { y: '100%' }}
            animate={handoff
              ? { opacity: handoffPhase === 'out' ? 0 : 1 }
              : { y: handoffPhase === 'out' ? '100%' : 0 }}
            exit={handoff ? { opacity: 0 } : { y: '100%' }}
            transition={handoff
              ? (handoffPhase === 'out'
                  ? { duration: 0.14, ease: [0.32, 0.72, 0, 1] }
                  : { duration: 0.22, delay: 0.14, ease: [0.22, 1, 0.36, 1] })
              : (handoffPhase === 'out' ? closeEase : sheetSpring)}
            onAnimationComplete={() => {
              if (!handoff && handoffPhase === 'out') {
                if (performance.now() - handoffStartedAt.current < 280) return;
                finishClose();
              }
            }}
          >
            {/* Top-left close button */}
            <div className="bex-pro-dest__top-bar">
              <button type="button" className="bex-pro-dest__top-close" onClick={() => requestClose('dismiss')} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {/* Pill search input — no arrow inside */}
            <div className="bex-pro-dest__search-wrap">
              <div
                ref={pillRef}
                className={`bex-pro-dest__pill${showHandoffGhost && !ghostSettled ? ' bex-pro-dest__pill--awaiting-handoff' : ''}`}
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={type === 'origin' ? 'Leaving from' : 'Where to?'}
                  className={`bex-pro-dest__input${showHandoffGhost && !ghostSettled ? ' bex-pro-dest__input--handoff' : ''}`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {query.length > 0 && (
                  <button type="button" className="bex-pro-dest__clear" aria-label="Clear"
                    onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                )}
              </div>
            </div>

            {/* Results body */}
            <div className="bex-pro-dest__body">
              {query.trim().length === 0 ? (
                /* Empty state: recent searches followed by destination inspiration */
                <>
                  {recentSearches.length > 0 && (
                    <>
                      <p className="bex-pro-dest__section-title">Recent searches</p>
                      <div className="bex-pro-dest__list">
                        {recentSearches.map(s => (
                          <div key={s.primary} className="bex-pro-dest__item">
                            <button type="button" className="bex-pro-dest__item-main"
                              onClick={() => commitDestination(s.primary)}>
                              <span className="bex-pro-dest__item-icon">
                                <IconSuggestHistoryPro />
                              </span>
                              <span className="bex-pro-dest__item-text">
                                <span className="bex-pro-dest__item-primary">{s.primary}</span>
                                <span className="bex-pro-dest__item-secondary">{s.secondary}</span>
                              </span>
                            </button>
                            <button type="button" className="bex-pro-dest__item-dismiss"
                              aria-label={`Remove ${s.primary} from recent searches`}
                              onClick={() => setRecentSearches(items => items.filter(item => item.primary !== s.primary))}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <p className={`bex-pro-dest__section-title${recentSearches.length > 0 ? ' bex-pro-dest__section-title--following' : ''}`}>
                    Suggested destinations
                  </p>
                  <div className="bex-pro-dest__list">
                    {SUGGESTED_DESTINATIONS_PRO.map(s => (
                      <button key={s.primary} type="button" className="bex-pro-dest__item"
                        onClick={() => commitDestination(s.primary)}>
                        <span className="bex-pro-dest__item-icon">
                          <SuggestionIconPro kind={s.kind} />
                        </span>
                        <span className="bex-pro-dest__item-text">
                          <span className="bex-pro-dest__item-primary">{s.primary}</span>
                          <span className="bex-pro-dest__item-secondary">{s.secondary}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : isReopenedWithValue ? (
                /* Reopening a populated field: offer useful places around the selection */
                <>
                  <p className="bex-pro-dest__section-title">
                    {nearbySuggestions.length > 0 ? 'Nearby locations' : 'Suggested destinations'}
                  </p>
                  <div className="bex-pro-dest__list">
                    {(nearbySuggestions.length > 0 ? nearbySuggestions : SUGGESTED_DESTINATIONS_PRO).map(s => (
                      <button key={`${s.kind}-${s.primary}`} type="button" className="bex-pro-dest__item"
                        onClick={() => commitDestination(s.primary)}>
                        <span className="bex-pro-dest__item-icon">
                          <SuggestionIconPro kind={s.kind} />
                        </span>
                        <span className="bex-pro-dest__item-text">
                          <span className="bex-pro-dest__item-primary">{s.primary}</span>
                          <span className="bex-pro-dest__item-secondary">{s.secondary}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                /* Typing state: filtered suggestions */
                <div className="bex-pro-dest__list">
                  {filtered.map((s, i) => (
                    <button key={i} type="button" className="bex-pro-dest__item"
                      onMouseDown={() => commitDestination(s.primary)}>
                      <span className="bex-pro-dest__item-icon">
                        <SuggestionIconPro kind={s.kind} />
                      </span>
                      <span className="bex-pro-dest__item-text">
                        <span className="bex-pro-dest__item-primary">{s.primary}</span>
                        {s.secondary && <span className="bex-pro-dest__item-secondary">{s.secondary}</span>}
                      </span>
                    </button>
                  ))}
                  <button type="button" className="bex-pro-dest__item bex-pro-dest__item--search-for"
                    onMouseDown={() => commitDestination(query.trim())}>
                    <span className="bex-pro-dest__item-icon bex-pro-dest__item-icon--search">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                    </span>
                    <span className="bex-pro-dest__item-text">
                      <span className="bex-pro-dest__item-primary">Search for "{query.trim()}"</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {showHandoffGhost && handoffAnim && destPillBox && destTextBox && (
        <motion.div
          className={`bex-pro-dest__handoff-pill${ghostSettled ? ' bex-pro-dest__handoff-pill--settled' : ''}`}
          initial={{
            x: handoffAnim.from.left,
            y: handoffAnim.from.top,
            width: handoffAnim.from.width,
            height: handoffAnim.from.height,
            borderRadius: 12,
            boxShadow: '0px 0px 36px rgba(16,16,16,0.12)',
          }}
          animate={{
            x: destPillBox.left,
            y: destPillBox.top,
            width: destPillBox.width,
            height: destPillBox.height,
            borderRadius: handoffPhase === 'out' ? 12 : 999,
            boxShadow: handoffPhase === 'out'
              ? '0px 0px 0px rgba(16,16,16,0)'
              : '0px 0px 36px rgba(16,16,16,0.12)',
          }}
          transition={handoffMove}
          onAnimationComplete={() => {
            if (handoffPhase === 'out') return;
            if (performance.now() - handoffStartedAt.current < 320) return;
            window.setTimeout(() => setHandoffDone(true), 50);
          }}
          aria-hidden="true"
        >
          <motion.span
            className="bex-pro-dest__handoff-label"
            initial={{
              x: handoffAnim.fromText.left,
              y: handoffAnim.fromText.top,
              width: handoffAnim.fromText.width,
              height: handoffAnim.fromText.height,
            }}
            animate={{
              x: destTextBox.left,
              y: destTextBox.top,
              width: destTextBox.width,
              height: destTextBox.height,
            }}
            transition={handoffType}
          >
            {destIsPlaceholder ? (
              <>
                <motion.span
                  className="bex-pro-dest__handoff-pill-text bex-pro-dest__handoff-pill-text--from"
                  style={{ color: '#7c7891' }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: handoffPhase === 'out' ? 1 : 0 }}
                  transition={handoffType}
                >
                  {handoffLabel}
                </motion.span>
                <motion.span
                  className="bex-pro-dest__handoff-pill-text bex-pro-dest__handoff-pill-text--to"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: handoffPhase === 'out' ? 0 : 1 }}
                  transition={handoffType}
                >
                  {handoffLabel}
                </motion.span>
              </>
            ) : (
              <span className="bex-pro-dest__handoff-pill-text bex-pro-dest__handoff-pill-text--filled">
                {handoffLabel}
              </span>
            )}
          </motion.span>
        </motion.div>
      )}

      {/* ── WHO sheet — Travelers (Figma 7051:495577) ────────────────────────── */}
      {type === 'who' && (
        <ProTravelersSheet
          lob={lob}
          fieldValues={fieldValues}
          sheetSpring={sheetSpring}
          closing={handoffPhase === 'out'}
          closeTransition={closeEase}
          onClose={requestClose}
          onCloseComplete={finishClose}
          onChange={onChange}
        />
      )}

      {/* ── WHEN sheet — Calendar (Figma 12010:66501) ─────────────────────── */}
      {type === 'when' && (
        <motion.div
          className="bex-fs bex-cal bex-cal--pro"
          initial={{ y: '100%' }}
          animate={{ y: handoffPhase === 'out' ? '100%' : 0 }}
          exit={{ y: '100%' }}
          transition={handoffPhase === 'out' ? closeEase : sheetSpring}
          onAnimationComplete={() => {
            if (handoffPhase !== 'out') return;
            if (performance.now() - handoffStartedAt.current < 280) return;
            finishClose();
          }}
        >

          {/* Header: X close button only */}
          <div className="bex-cal__pro-toolbar">
            <button type="button" className="bex-cal__pro-close" onClick={() => requestClose('dismiss')} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Segmented control: Dates | Flexible — only for Stays */}
          {lob === 'stays' && (
            <div className="bex-cal__seg" role="tablist">
              <button role="tab" aria-selected={calTab === 'exact'}
                className={`bex-cal__seg-btn${calTab === 'exact' ? ' bex-cal__seg-btn--active' : ''}`}
                onClick={() => setCalTab('exact')}>Dates</button>
              <button role="tab" aria-selected={calTab === 'flexible'}
                className={`bex-cal__seg-btn${calTab === 'flexible' ? ' bex-cal__seg-btn--active' : ''}`}
                onClick={() => setCalTab('flexible')}>Flexible</button>
            </div>
          )}

          {(calTab === 'exact' || lob !== 'stays') ? (
            <>
              {/* Scrollable months — DOW row lives inside each CalMonth for Pro */}
              <div className="bex-cal__body bex-cal__body--pro">
                <CalMonth year={displayMonth.getFullYear()} month={displayMonth.getMonth()} />
                <CalMonth year={nextMonth.getFullYear()} month={nextMonth.getMonth()} />
                <CalMonth
                  year={new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 2, 1).getFullYear()}
                  month={new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 2, 1).getMonth()}
                />
              </div>

              {/* Footer: divider + scrollable chips + Done */}
              <div className={`bex-cal__footer bex-cal__footer--pro-exact${lob === 'flights' || lob === 'packages' || lob === 'cars' || lob === 'activities' ? ' bex-cal__footer--no-flex' : ''}`}>
                {lob !== 'flights' && lob !== 'packages' && lob !== 'cars' && lob !== 'activities' && (
                  <div className="bex-cal__flex-footer bex-cal__flex-footer--pro">
                    {['Exact dates', '±1 day', '±2 days', '±3 days', '±7 days'].map(f => (
                      <button key={f} type="button"
                        className={`bex-cal__flex-footer-pill bex-cal__flex-footer-pill--pro${flexibility === f ? ' bex-cal__flex-footer-pill--sel' : ''}`}
                        onClick={() => setFlexibility(f)}>{f}</button>
                    ))}
                  </div>
                )}
                <button type="button" className="bex-cal__save bex-cal__save--pro"
                  onClick={() => { if (rangeStart) onChange({ when: formatRangeLabelPro(rangeStart, rangeEnd) }); requestClose('commit'); }}>
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Flexible dates body */}
              <div className="bex-cal__body bex-cal__body--pro">
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
                          <span className="bex-cal__flex-month-name">{CAL_MONTH_NAMES_PRO[d.getMonth()]}</span>
                          <span className="bex-cal__flex-month-year">{d.getFullYear()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="bex-cal__footer bex-cal__footer--pro-exact">
                <button type="button" className="bex-cal__save bex-cal__save--pro"
                  onClick={() => {
                    const months = flexMonths.map(k => { const [, m] = k.split('-').map(Number); return SHORT_MONTH_NAMES_PRO[m]; });
                    onChange({ when: [flexDur, months.join(', ')].filter(Boolean).join(' · ') });
                    requestClose('commit');
                  }}>Done</button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ─── Pro Travelers bottom-card popover ────────────────────────────────────────
// Design: Figma Popover/Travelers-Stays — white card, 32px top radius,
// EGDS filled xS icon buttons, multi-room support, "Done" navy pill.

interface RoomData { adults: number; children: number; }

interface ProTravProps {
  lob: LobId;
  fieldValues: FieldValues;
  onClose: (reason?: CloseReason) => void;
  onChange: (v: Partial<FieldValues>) => void;
}

const ProTravelersCard: React.FC<ProTravProps> = ({ lob, fieldValues, onClose, onChange }) => {
  const [rooms, setRooms] = useState<RoomData[]>([
    { adults: fieldValues.adults, children: fieldValues.children },
  ]);

  const updateRoom = (i: number, patch: Partial<RoomData>) =>
    setRooms(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const addRoom = () => setRooms(prev => [...prev, { adults: 1, children: 0 }]);
  const removeRoom = (i: number) => setRooms(prev => prev.filter((_, idx) => idx !== i));

  const handleDone = () => {
    const totAdults = rooms.reduce((s, r) => s + r.adults, 0);
    const totChildren = rooms.reduce((s, r) => s + r.children, 0);
    onChange({ adults: totAdults, children: totChildren, rooms: rooms.length });
    onClose('commit');
  };

  // EGDS filled circular stepper button
  const StepBtn = ({ dir, disabled, onClick }: { dir: '−' | '+'; disabled: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bex-pro-trav__step-btn${disabled ? ' bex-pro-trav__step-btn--disabled' : ''}`}
      aria-label={dir === '−' ? 'Decrease' : 'Increase'}
    >
      {dir}
    </button>
  );

  const TravRow = ({ label, sub, value, min, max, onChange: onCh }: {
    label: string; sub?: string; value: number; min: number; max: number; onChange: (v: number) => void;
  }) => (
    <div className="bex-pro-trav__row">
      <div className="bex-pro-trav__row-text">
        <span className="bex-pro-trav__row-label">{label}</span>
        {sub && <span className="bex-pro-trav__row-sub">{sub}</span>}
      </div>
      <div className="bex-pro-trav__steppers">
        <StepBtn dir="−" disabled={value <= min} onClick={() => onCh(Math.max(min, value - 1))} />
        <span className="bex-pro-trav__count">{value}</span>
        <StepBtn dir="+" disabled={value >= max} onClick={() => onCh(Math.min(max, value + 1))} />
      </div>
    </div>
  );

  const showRooms = lob === 'stays' || lob === 'packages';

  return (
    <>
      <div className="bex-pro-trav-backdrop" onClick={onClose} />
      <motion.div
        className="bex-pro-trav"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      >
        <div className="bex-pro-trav__handle" />

        <div className="bex-pro-trav__scroll">
          {rooms.map((room, roomIdx) => (
            <React.Fragment key={roomIdx}>
              {roomIdx > 0 && <div className="bex-pro-trav__divider" />}
              <div className="bex-pro-trav__room">
                {showRooms && (
                  <div className="bex-pro-trav__room-heading">
                    Room {roomIdx + 1}
                  </div>
                )}
                <div className="bex-pro-trav__list">
                  <TravRow
                    label="Adults"
                    value={room.adults}
                    min={1}
                    max={14}
                    onChange={v => updateRoom(roomIdx, { adults: v })}
                  />
                  <TravRow
                    label="Children"
                    sub="Ages 0 to 17"
                    value={room.children}
                    min={0}
                    max={6}
                    onChange={v => updateRoom(roomIdx, { children: v })}
                  />
                </div>
                {showRooms && rooms.length > 1 && (
                  <div className="bex-pro-trav__ctas">
                    <button type="button" className="bex-pro-trav__link" onClick={() => removeRoom(roomIdx)}>
                      Remove room
                    </button>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}

          {showRooms && rooms.length < 9 && (
            <div className="bex-pro-trav__add-room-row">
              <button type="button" className="bex-pro-trav__link" onClick={addRoom}>
                Add another room
              </button>
            </div>
          )}
        </div>

        <div className="bex-pro-trav__divider" />
        <div className="bex-pro-trav__footer">
          <span className="bex-pro-trav__group-link">
            Need to book 9 or more rooms?
          </span>
          <button type="button" className="bex-pro-trav__done" onClick={handleDone}>
            Done
          </button>
        </div>
      </motion.div>
    </>
  );
};

// ─── Stagger variant system ────────────────────────────────────────────────────
// Outer form wrapper: no own animation, just propagates hidden/visible/exit state
// Wrapper fades + scales very slightly for a gentle bloom feel
const FORM_WRAPPER_VARIANTS = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.985, transition: { duration: 0.18, ease: 'easeIn' } },
} as const;

// ── Package mode-switch variants ──────────────────────────────────────────────

// Stagger container for multi-mode — children use PKG_SECTION_ITEM_VARIANTS
const PKG_MULTI_CONTAINER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  // Faster reverse-stagger so the blank gap before single mode appears is minimal
  exit:   { transition: { staggerChildren: 0.03, staggerDirection: -1 as const } },
} as const;

// Each section block (label + card) springs in / out
const PKG_SECTION_ITEM_VARIANTS = {
  hidden:   { opacity: 0, y: 22, scale: 0.95 },
  visible:  { opacity: 1, y: 0,  scale: 1,
              transition: { type: 'spring' as const, stiffness: 440, damping: 26, mass: 0.62 } },
  exit:     { opacity: 0, y: -8, scale: 0.97,
              transition: { duration: 0.12, ease: [0.32, 0, 0.67, 0] as any } },
} as const;

// Each field / divider item staggers in from slightly below
const FIELD_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.22, delay: i * 0.06, ease: 'easeOut' },
      y: { type: 'spring', stiffness: 320, damping: 36, mass: 0.7, delay: i * 0.06 },
    },
  }),
  exit: { opacity: 0, y: -4, transition: { duration: 0.14, ease: 'easeIn' } },
} as const;

// ─── Reusable sub-components ──────────────────────────────────────────────────

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
  si?: number; // stagger index
  onHandoff?: (box: HandoffBox) => void;
  valueHidden?: boolean;
}

// Single-line field: staggers in based on si (stagger index) via parent variant propagation.
const FieldRow: React.FC<FieldRowProps> = ({ icon, label, value, onClick, si = 0, onHandoff, valueHidden = false }) => (
  <motion.button
    type="button"
    className={`bex-hero-pro__field${!value ? ' bex-hero-pro__field--empty' : ''}`}
    onClick={e => {
      if (onHandoff) {
        const valueEl = e.currentTarget.querySelector('.bex-hero-pro__field-value') as HTMLElement | null;
        const field = e.currentTarget.getBoundingClientRect();
        const text = (valueEl ?? e.currentTarget).getBoundingClientRect();
        onHandoff({
          left: field.left,
          top: field.top,
          width: field.width,
          height: field.height,
          textLeft: text.left,
          textTop: text.top,
          textWidth: text.width,
          textHeight: text.height,
          text: valueEl?.textContent?.trim() || label,
        });
      }
      onClick();
    }}
    variants={FIELD_ITEM_VARIANTS as any}
    custom={si}
  >
    <span className="bex-hero-pro__field-icon">{icon}</span>
    <span className="bex-hero-pro__field-text">
      <span className={`bex-hero-pro__field-value${valueHidden ? ' bex-hero-pro__field-value--handoff' : ''}`}>
        {value || label}
      </span>
    </span>
  </motion.button>
);

// Animated divider — same stagger system as FieldRow
const D: React.FC<{ si?: number }> = ({ si = 0 }) => (
  <motion.hr
    className="bex-hero-pro__divider"
    variants={FIELD_ITEM_VARIANTS as any}
    custom={si}
  />
);

interface LobTabsProps {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
  scrollable?: boolean;
}

const LobTabs: React.FC<LobTabsProps & { layoutPrefix?: string }> = ({ tabs, active, onChange, scrollable, layoutPrefix = 'tab' }) => (
  <div className={`bex-hero-pro__tabs${scrollable ? ' bex-hero-pro__tabs--scroll' : ''}`} role="tablist">
    {tabs.map((tab, i) => (
      <button
        key={tab}
        type="button"
        role="tab"
        aria-selected={active === i}
        className={`bex-hero-pro__tab${active === i ? ' bex-hero-pro__tab--active' : ''}`}
        onClick={() => onChange(i)}
      >
        {tab}
        {active === i && (
          <motion.span
            layoutId={`${layoutPrefix}-indicator`}
            className="bex-hero-pro__tab-indicator"
            transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
          />
        )}
      </button>
    ))}
  </div>
);

// ─── BexHeroPro ──────────────────────────────────────────────────────────────

interface Props {
  warmth: Warmth;
  /** When true: no status bar/toolbar, always expanded. Used in scroll-expand overlay. */
  overlay?: boolean;
  /** MSF keeps the Pro shell but uses Lite field sheets and interaction behavior. */
  fieldSheets?: 'pro' | 'lite';
}

export const BexHeroPro: React.FC<Props> = ({ warmth, overlay = false, fieldSheets = 'pro' }) => {
  const [activeLob, setActiveLob] = useState<LobId>('stays');
  const [openSheet, setOpenSheet] = useState<FieldType>(null);
  const [handoff, setHandoff] = useState<HandoffBox | null>(null);
  const [collapsed, setCollapsed] = useState(!overlay && warmth === 'hot');
  const [fields, setFields] = useState<FieldValues>(
    warmth === 'hot' ? WARM_FIELDS : COLD_FIELDS
  );
  const [flightTab, setFlightTab] = useState(0);
  const [packageTab, setPackageTab] = useState(0);
  const [packageCabinClass, setPackageCabinClass] = useState('Economy');
  const [bundleExpanded, setBundleExpanded] = useState(false);
  const [pkgMultiMode, setPkgMultiMode] = useState(false);
  const [carDropoffExpanded, setCarDropoffExpanded] = useState(false);
  // Which pill popover menu is open: 'flightType' | 'cabin' | 'pkgType' | 'pkgCabin'
  const [activePillMenu, setActivePillMenu] = useState<string | null>(null);
  const [pillMenuPos, setPillMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const pillBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pillMenuWrapperRef = useRef<HTMLDivElement>(null);

  const openPillMenu = (key: string) => {
    const btn = pillBtnRefs.current[key];
    const wrapper = pillMenuWrapperRef.current;
    if (!btn || !wrapper) return;
    const bRect = btn.getBoundingClientRect();
    const wRect = wrapper.getBoundingClientRect();
    const MENU_W = 224;
    const top = bRect.bottom - wRect.top + 6;
    // Left-align to button, but flip left if it would overflow the wrapper's right edge
    const rawLeft = bRect.left - wRect.left;
    const left = rawLeft + MENU_W > wRect.width
      ? Math.max(0, bRect.right - wRect.left - MENU_W)
      : rawLeft;
    setPillMenuPos({ top, left });
    setActivePillMenu(key);
  };

  // Multi-city state (Pro)
  const [mcLegs, setMcLegs] = useState<{from: string; to: string; date: string}[]>([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' },
  ]);
  const mcEditRef = useRef<{legIdx: number; field: 'from' | 'to' | 'date'} | null>(null);

  const lobNavRef = useRef<HTMLDivElement>(null);
  const lobItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pillRowOuterRef = useRef<HTMLDivElement>(null);

  // Always-current fields ref for progressive disclosure timers
  const fieldsRef = useRef(fields);
  useEffect(() => { fieldsRef.current = fields; }, [fields]);
  const nextSheetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expandSheetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateField = (partial: Partial<FieldValues>) =>
    setFields(prev => ({ ...prev, ...partial }));

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

  // Determine the next empty field to auto-open after `closed` sheet
  const getNextSheet = (closed: FieldType, f: FieldValues): FieldType => {
    switch (activeLob) {
      case 'stays':
        if (closed === 'where'  && f.where  && !f.when) return 'when';
        if (closed === 'when'   && f.when   && f.adults <= 1 && !f.where) return null;
        break;
      case 'flights':
        if (flightTab === 2) return null; // multi-city has its own flow
        if (closed === 'origin' && f.origin && !f.where) return 'where';
        if (closed === 'where'  && f.where  && !f.when)  return 'when';
        break;
      case 'cars':
        if (closed === 'where' && f.where && !f.when) return 'when';
        break;
      case 'packages':
        if (packageTab === 2) { // Stay + Car: no origin field
          if (closed === 'where' && f.where && !f.when) return 'when';
        } else {
          if (closed === 'origin' && f.origin && !f.where) return 'where';
          if (closed === 'where'  && f.where  && !f.when)  return 'when';
        }
        break;
      case 'activities':
      case 'cruises':
        if (closed === 'where' && f.where && !f.when) return 'when';
        break;
    }
    return null;
  };

  const handleSheetClose = (reason: CloseReason = 'dismiss') => {
    const closedSheet = openSheet;
    const isMc = mcEditRef.current !== null;
    mcEditRef.current = null;
    setOpenSheet(null);
    setHandoff(null);

    // Progressive disclosure only after a committed value, not a close-button dismiss.
    if (reason === 'commit' && fieldSheets === 'pro' && closedSheet && !isMc) {
      if (nextSheetTimerRef.current) clearTimeout(nextSheetTimerRef.current);
      nextSheetTimerRef.current = setTimeout(() => {
        const next = getNextSheet(closedSheet, fieldsRef.current);
        if (next) setOpenSheet(next);
      }, 380);
    }
  };

  // Sync collapsed when warmth changes externally
  useEffect(() => {
    if (!overlay) setCollapsed(warmth === 'hot');
  }, [warmth, overlay]);

  // Reset bundle when switching LOBs or package tabs
  useEffect(() => { setBundleExpanded(false); setPkgMultiMode(false); }, [activeLob, packageTab]);

  // Scroll so the pill row ("Stay + Flight") is visible when multi-mode expands.
  // block:'nearest' scrolls only if the row is out of view, and never scrolls past it.
  useEffect(() => {
    if (!pkgMultiMode) return;
    requestAnimationFrame(() => {
      pillRowOuterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, [pkgMultiMode]);

  // Cancel any pending progressive disclosure when LOB changes
  useEffect(() => {
    if (nextSheetTimerRef.current) clearTimeout(nextSheetTimerRef.current);
  }, [activeLob]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (nextSheetTimerRef.current) clearTimeout(nextSheetTimerRef.current);
    if (expandSheetTimerRef.current) clearTimeout(expandSheetTimerRef.current);
  }, []);

  // Notify global sticky bar of active LOB
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('bex-lob', { detail: { lob: activeLob, city: fields.where } }));
  }, [activeLob, fields.where]);

  // Scroll selected LOB item into view within the nav strip.
  // Use offsetLeft (element-space) so CSS zoom on parent frames doesn't break calculations.
  useEffect(() => {
    const nav = lobNavRef.current;
    const btn = lobItemRefs.current[activeLob];
    if (!nav || !btn) return;

    const GAP = 16; // breathing room on each side
    const navWidth   = nav.clientWidth;
    const btnLeft    = btn.offsetLeft;
    const btnRight   = btnLeft + btn.offsetWidth;
    const scrollLeft = nav.scrollLeft;
    const scrollRight = scrollLeft + navWidth;

    if (btnLeft - GAP < scrollLeft) {
      nav.scrollTo({ left: btnLeft - GAP, behavior: 'smooth' });
    } else if (btnRight + GAP > scrollRight) {
      nav.scrollTo({ left: btnRight + GAP - navWidth, behavior: 'smooth' });
    }
  }, [activeLob]);

  const travelerLabel = () => {
    const parts = [`${fields.adults} traveler${fields.adults !== 1 ? 's' : ''}`];
    if (fields.children > 0) parts.push(`${fields.children} child${fields.children !== 1 ? 'ren' : ''}`);
    if (activeLob === 'stays' || activeLob === 'packages') parts.push(`${fields.rooms} room${fields.rooms !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const captureHandoff = fieldSheets === 'pro'
    ? (box: HandoffBox) => setHandoff(box)
    : undefined;
  const whereHandoff = {
    onHandoff: captureHandoff,
    valueHidden: fieldSheets === 'pro' && openSheet === 'where',
  };
  const originHandoff = {
    onHandoff: captureHandoff,
    valueHidden: fieldSheets === 'pro' && openSheet === 'origin',
  };

  // ── Per-LOB form content ───────────────────────────────────────────────────

  const renderStaysForm = () => (
    <div className="bex-hero-pro__fieldscard">
      <FieldRow {...whereHandoff} si={0} icon={<IconLocation />} label="Where to?" value={fields.where} onClick={() => setOpenSheet('where')} />
      <D si={1} />
      <FieldRow si={2} icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
      <D si={3} />
      <FieldRow si={4} icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')}/>
      <motion.div className="bex-hero-pro__bundle" data-expanded={bundleExpanded} variants={FIELD_ITEM_VARIANTS as any} custom={5}>
        <button type="button" className="bex-hero-pro__bundle-btn" onClick={() => setBundleExpanded(e => !e)}>
          <motion.span
            animate={{ rotate: bundleExpanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <IconChevronDown />
          </motion.span>
          <span className="bex-hero-pro__bundle-label">Add a flight to Bundle &amp; Save*</span>
        </button>
        <AnimatePresence initial={false}>
          {bundleExpanded && (
            <motion.div
              key="bundle-stays"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingBottom: '10px' }}
            >
              <button type="button" className="bex-hero__bundle-input" onClick={() => setOpenSheet('origin')}>
                <IconFlightTakeoff />
                <span className="bex-hero__bundle-input-label">
                  {fields.origin || 'Leaving from'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  const renderMultiCityFormPro = () => (
    <div className="bex-mc__wrapper">
      {/* Travelers — standalone card */}
      <div className="bex-hero-pro__fieldscard">
        <FieldRow si={0} icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')} />
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
              <FieldRow si={0} icon={<IconFlightTakeoff />} label="Leaving from" value={leg.from} onClick={() => openMcField(idx, 'from')} />
              <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
              <D si={1} />
              <FieldRow si={2} icon={<IconFlightLanding />} label="Going to" value={leg.to} onClick={() => openMcField(idx, 'to')} />
              <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
                onClick={() => setMcLegs(legs => legs.map((l, i) => i === idx ? { ...l, from: l.to, to: l.from } : l))}>
                <IconSwap />
              </button>
            </div>
            <D si={3} />
            <FieldRow si={4} icon={<IconCalendar />} label="Select departure date" value={leg.date} onClick={() => openMcField(idx, 'date')} />
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
    if (flightTab === 2) return renderMultiCityFormPro();
    return (
    <div className="bex-hero-pro__fieldscard">
      <div className="bex-hero-pro__origin-wrap">
        <FieldRow {...originHandoff} si={0} icon={<IconFlightTakeoff />} label="Leaving from" value={fields.origin} onClick={() => setOpenSheet('origin')} />
        <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
        <D si={1} />
        <FieldRow {...whereHandoff} si={2} icon={<IconFlightLanding />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
        <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
          onClick={() => updateField({ origin: fields.where, where: fields.origin })}>
          <IconSwap />
        </button>
      </div>
      <D si={3} />
      <FieldRow si={4} icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
      <D si={5} />
      <FieldRow si={6} icon={<IconPerson />} label="Travelers"
        value={travelerLabel()}
        onClick={() => setOpenSheet('who')}/>
      <motion.div className="bex-hero-pro__bundle" data-expanded={bundleExpanded} variants={FIELD_ITEM_VARIANTS as any} custom={7}>
        <button type="button" className="bex-hero-pro__bundle-btn" onClick={() => setBundleExpanded(e => !e)}>
          <motion.span
            animate={{ rotate: bundleExpanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <IconChevronDown />
          </motion.span>
          <span className="bex-hero-pro__bundle-label">Add a stay to Bundle &amp; Save*</span>
        </button>
        <AnimatePresence initial={false}>
          {bundleExpanded && (
            <motion.div
              key="bundle-flights"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingBottom: '10px' }}
            >
              <button type="button" className="bex-hero__bundle-input" onClick={() => setOpenSheet('when')}>
                <IconCalendar />
                <span className="bex-hero__bundle-input-label">
                  {fields.when || 'Select dates'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    );
  };

  const renderCarsForm = () => {
    // Split "Wed, Jul 29 – Fri, Jul 31" → ["Wed, Jul 29", "Fri, Jul 31"]
    const [pickupDate, dropoffDate] = fields.when
      ? fields.when.split(' – ')
      : ['', ''];

    return (
    <div className="bex-hero-pro__fieldscard">
      {/* Row 1: Location — label changes when separate drop-off is expanded */}
      <FieldRow {...whereHandoff} si={0} icon={<IconLocation />}
        label={carDropoffExpanded ? 'Pick-up location' : 'Pick-up and drop-off location'}
        value={fields.where}
        onClick={() => setOpenSheet('where')} />

      <D si={1} />

      {/* Row 2: Pick-up date (left) + Pick-up time (right) */}
      <motion.div className="bex-hero-pro__car-date-row" variants={FIELD_ITEM_VARIANTS as any} custom={2}>
        <button type="button" className="bex-hero-pro__car-date-half" onClick={() => setOpenSheet('when')}>
          <IconCalendar />
          <span className={pickupDate ? 'bex-hero-pro__car-date-val' : 'bex-hero-pro__car-date-ph'}>
            {pickupDate || 'Pick-up date'}
          </span>
          {/* Vertical connector line to drop-off date row */}
          <span className="bex-hero-pro__car-date-connector" aria-hidden="true" />
        </button>
        <div className="bex-hero-pro__car-time-half">
          <IconClock />
          <select className="bex-hero-pro__car-time-select" value={fields.pickupTime}
            onChange={e => updateField({ pickupTime: e.target.value })}>
            {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </motion.div>

      <D si={3} />

      {/* Row 3: Drop-off date (left) + Drop-off time (right) */}
      <motion.div className="bex-hero-pro__car-date-row" variants={FIELD_ITEM_VARIANTS as any} custom={4}>
        <button type="button" className="bex-hero-pro__car-date-half" onClick={() => setOpenSheet('when')}>
          <IconCalendar />
          <span className={dropoffDate ? 'bex-hero-pro__car-date-val' : 'bex-hero-pro__car-date-ph'}>
            {dropoffDate || 'Drop-off date'}
          </span>
        </button>
        <div className="bex-hero-pro__car-time-half">
          <IconClock />
          <select className="bex-hero-pro__car-time-select" value={fields.dropoffTime}
            onChange={e => updateField({ dropoffTime: e.target.value })}>
            {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Bottom: "Choose a different drop-off location" expando */}
      <motion.div className="bex-hero-pro__bundle" data-expanded={carDropoffExpanded} variants={FIELD_ITEM_VARIANTS as any} custom={5}>
        <button type="button" className="bex-hero-pro__bundle-btn" onClick={() => setCarDropoffExpanded(e => !e)}>
          <motion.span
            animate={{ rotate: carDropoffExpanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <IconChevronDown />
          </motion.span>
          <span className="bex-hero-pro__bundle-label">Choose a different drop-off location</span>
        </button>
        <AnimatePresence initial={false}>
          {carDropoffExpanded && (
            <motion.div
              key="bundle-car-dropoff"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingBottom: '10px' }}
            >
              <button type="button" className="bex-hero__bundle-input" onClick={() => setOpenSheet('where')}>
                <IconLocation />
                <span className="bex-hero__bundle-input-label">
                  {fields.carDropoff || 'Drop-off location'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    );
  };

  const renderPackagesForm = () => {
    // 0=Stay+Flight, 1=Flight+Car, 2=Stay+Car, 3=Stay+Flight+Car
    const hasFlights = packageTab !== 2;
    const hasStay    = packageTab === 0 || packageTab === 2 || packageTab === 3;
    const hasCar     = packageTab === 1 || packageTab === 2 || packageTab === 3;

    return (
      /* Layout shell: contains both mode views */
      <div className="bex-hero-pro__pkg-layout-shell">
        <AnimatePresence mode="wait" initial={false}>

          {/* ══ FLEX / MULTI-MODE ═══════════════════════════════════════════ */}
          {pkgMultiMode ? (
            <motion.div
              key="pkg-multi"
              className="bex-hero-pro__pkg-multi"
              variants={PKG_MULTI_CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* ── Flight section ─────────────────────────────── */}
              {hasFlights && (
                <motion.div variants={PKG_SECTION_ITEM_VARIANTS} className="bex-hero-pro__pkg-section-block">
                  <div className="bex-hero-pro__pkg-section-header">
                    <span className="bex-hero-pro__pkg-section-label">Flight</span>
                    <div className="bex-hero-pro__pkg-section-pills">
                      <button type="button" className="bex-hero-pro__pill bex-hero-pro__pill--sm">
                        <span className="bex-hero-pro__pill-label">Roundtrip</span>
                        <IconChevronDown />
                      </button>
                      <button type="button" className="bex-hero-pro__pill bex-hero-pro__pill--sm">
                        <span className="bex-hero-pro__pill-label">{fields.cabinClass || 'Economy'}</span>
                        <IconChevronDown />
                      </button>
                    </div>
                  </div>
                  <div className="bex-hero-pro__fieldscard bex-hero-pro__fieldscard--inset">
                    <div className="bex-hero-pro__origin-wrap">
                      <FieldRow {...originHandoff} si={0} icon={<IconFlightTakeoff />} label="Leaving from" value={fields.origin} onClick={() => setOpenSheet('origin')} />
                      <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
                      <D si={1} />
                      <FieldRow {...whereHandoff} si={2} icon={<IconFlightLanding />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
                      <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
                        onClick={() => updateField({ origin: fields.where, where: fields.origin })}>
                        <IconSwap />
                      </button>
                    </div>
                    <D si={3} />
                    <FieldRow si={4} icon={<IconCalendar />} label="Select flight dates" value={fields.when} onClick={() => setOpenSheet('when')} />
                  </div>
                </motion.div>
              )}

              {/* ── Stay section ───────────────────────────────── */}
              {hasStay && (
                <motion.div variants={PKG_SECTION_ITEM_VARIANTS} className="bex-hero-pro__pkg-section-block">
                  <div className="bex-hero-pro__pkg-section-header">
                    <span className="bex-hero-pro__pkg-section-label">Stay</span>
                  </div>
                  <div className="bex-hero-pro__fieldscard bex-hero-pro__fieldscard--inset">
                    <FieldRow {...whereHandoff} si={0} icon={<IconLocation />} label="Destination" value={fields.where} onClick={() => setOpenSheet('where')} />
                    <D si={1} />
                    <FieldRow si={2} icon={<IconCalendar />} label="Select stay dates" value={fields.when} onClick={() => setOpenSheet('when')} />
                  </div>
                </motion.div>
              )}

              {/* ── Car section ────────────────────────────────── */}
              {hasCar && (
                <motion.div variants={PKG_SECTION_ITEM_VARIANTS} className="bex-hero-pro__pkg-section-block">
                  <div className="bex-hero-pro__pkg-section-header bex-hero-pro__pkg-section-header--car">
                    <span className="bex-hero-pro__pkg-section-label">Car</span>
                  </div>
                  <div className="bex-hero-pro__fieldscard bex-hero-pro__fieldscard--inset">
                    <FieldRow si={0} icon={<IconLocation />} label="Pick-up location" value={fields.where} onClick={() => setOpenSheet('where')} />
                    <D si={1} />
                    <FieldRow si={2} icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
                  </div>
                </motion.div>
              )}

              {/* ── Travelers ──────────────────────────────────── */}
              <motion.div variants={PKG_SECTION_ITEM_VARIANTS}
                className="bex-hero-pro__fieldscard bex-hero-pro__fieldscard--inset bex-hero-pro__fieldscard--travelers">
                <FieldRow si={0} icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')} />
              </motion.div>

              {/* Back button is now in the pill row — no bottom collapse button needed */}
            </motion.div>

          ) : (

            /* ══ STANDARD / SINGLE MODE ═══════════════════════════════════ */
            <motion.div
              key="pkg-single"
              className="bex-hero-pro__fieldscard"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1,    y: 0,
                         transition: { type: 'spring', stiffness: 500, damping: 32, mass: 0.6 } }}
              exit={{    opacity: 0, scale: 0.97, y: -8,
                         transition: { duration: 0.16, ease: [0.32, 0, 0.67, 0] as any } }}
            >
              {hasFlights ? (
                <div className="bex-hero-pro__origin-wrap">
                  <FieldRow {...originHandoff} si={0} icon={<IconFlightTakeoff />} label="Leaving from" value={fields.origin} onClick={() => setOpenSheet('origin')} />
                  <div className="bex-hero-pro__flight-connector" aria-hidden="true" />
                  <D si={1} />
                  <FieldRow {...whereHandoff} si={2} icon={<IconFlightLanding />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
                  <button type="button" className="bex-hero-pro__swap-btn" aria-label="Swap"
                    onClick={() => updateField({ origin: fields.where, where: fields.origin })}>
                    <IconSwap />
                  </button>
                </div>
              ) : (
                <FieldRow {...whereHandoff} si={0} icon={<IconLocation />} label="Where to?" value={fields.where} onClick={() => setOpenSheet('where')} />
              )}
              <D si={3} />
              <FieldRow si={4} icon={<IconCalendar />} label={hasFlights ? 'Select flight dates' : 'Select dates'} value={fields.when} onClick={() => setOpenSheet('when')} />
              <D si={5} />
              <FieldRow si={6} icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')} />

              {/* ── Add multiple dates / destinations footer ─── */}
              <motion.button
                type="button"
                className="bex-hero-pro__pkg-add-multi-btn"
                variants={FIELD_ITEM_VARIANTS as any}
                custom={7}
                onClick={() => setPkgMultiMode(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
                Add multiple dates or destinations
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    );
  };

  const renderActivitiesForm = () => (
    <div className="bex-hero-pro__fieldscard">
      <FieldRow {...whereHandoff} si={0} icon={<IconLocation />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
      <D si={1} />
      <FieldRow si={2} icon={<IconCalendar />} label="Select dates" value={fields.when} onClick={() => setOpenSheet('when')} />
      <D si={3} />
      <FieldRow si={4} icon={<IconPerson />} label="Travelers" value={travelerLabel()} onClick={() => setOpenSheet('who')} />
    </div>
  );

  const renderCruisesForm = () => (
    <div className="bex-hero-pro__fieldscard">
      <FieldRow {...whereHandoff} si={0} icon={<IconLocation />} label="Going to" value={fields.where} onClick={() => setOpenSheet('where')} />
      <D si={1} />
      <FieldRow si={2} icon={<IconCalendar />} label="Departing between" value={fields.when} onClick={() => setOpenSheet('when')} />
      <D si={3} />
      <motion.button
        type="button"
        className="bex-hero-pro__field"
        onClick={() => {}}
        variants={FIELD_ITEM_VARIANTS as any}
        custom={4}
      >
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
      </motion.button>
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
                    <img src="/images/figma/6aafc84c-1497-4f11-ac54-cf3e08e04fad.svg" width="14" height="14" alt="" aria-hidden="true" />
                    Gold
                  </span>
                </div>
                <img
                  src="/images/mary-avatar.jpg"
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

        {/* LOB nav — always visible; only the form fields below collapse */}
        <div ref={lobNavRef} className="bex-hero-pro__lobnav" role="tablist" aria-label="Line of business">
          {LOBS.map(lob => (
            <motion.button
              key={lob.id}
              ref={(el) => { lobItemRefs.current[lob.id] = el; }}
              type="button"
              role="tab"
              className="bex-hero-pro__lobitem"
              aria-pressed={activeLob === lob.id}
              aria-selected={activeLob === lob.id}
              onClick={() => { setActiveLob(lob.id); if (collapsed) setCollapsed(false); }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            >
              {activeLob === lob.id && (
                <motion.span
                  layoutId="lob-selection"
                  className="bex-hero-pro__lobitem-glow"
                  transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
                />
              )}
              <motion.img
                src={LOB_PICTOGRAMS[lob.id]}
                alt=""
                className="bex-hero-pro__lobpic"
                aria-hidden="true"
                animate={{ y: activeLob === lob.id ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                onLoad={e => (e.currentTarget as HTMLImageElement).classList.add('bex-hero-pro__lobpic--loaded')}
              />
              <span className="bex-hero-pro__loblabel">{lob.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Hot-state expand zone — pill overlays so no layout shift */}
        <div className="bex-hero__hot-zone" style={{ position: 'relative' }}>

        {/* Collapsed pill — position:absolute overlay, no layout contribution */}
        <AnimatePresence initial={false}>
          {collapsed && (
            <motion.button
              key="pro-pill"
              type="button"
              className="bex-hero__pill-bar bex-hero__pill-bar--pro bex-hero__pill-bar--overlay"
              onClick={() => {
                setCollapsed(false);
                if (expandSheetTimerRef.current) clearTimeout(expandSheetTimerRef.current);
                expandSheetTimerRef.current = setTimeout(() => setOpenSheet('where'), 520);
              }}
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

        {/* Pill row — CSS grid expand/collapse avoids layout spring conflicts */}
        <div ref={pillMenuWrapperRef} className="bex-hero-pro__pill-menu-wrapper">
        <div ref={pillRowOuterRef} className="bex-hero-pro__pill-row-outer" data-visible={!collapsed && (activeLob === 'flights' || activeLob === 'packages')}
          style={{ display: collapsed ? 'none' : undefined }}>
          <div className="bex-hero-pro__pill-row-inner">
            <AnimatePresence initial={false}>
            {(activeLob === 'flights' || activeLob === 'packages') && (
            <motion.div
              key={`pills-${activeLob}`}
              className="bex-hero-pro__pill-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {activeLob === 'flights' && (<>
                <button type="button" className="bex-hero-pro__pill"
                  ref={el => { pillBtnRefs.current['flightType'] = el; }}
                  onClick={() => openPillMenu('flightType')}>
                  <span className="bex-hero-pro__pill-label">{FLIGHT_TABS[flightTab]}</span>
                  <IconChevronDown />
                </button>
                <button type="button" className="bex-hero-pro__pill"
                  ref={el => { pillBtnRefs.current['cabin'] = el; }}
                  onClick={() => openPillMenu('cabin')}>
                  <span className="bex-hero-pro__pill-label">{fields.cabinClass || 'Economy'}</span>
                  <IconChevronDown />
                </button>
              </>)}
              {activeLob === 'packages' && (<>
                {/* Back button — only in flex/multi mode, sits left of the type pill */}
                <AnimatePresence initial={false}>
                  {pkgMultiMode && (
                    <motion.button
                      key="pkg-back"
                      type="button"
                      className="bex-hero-pro__pkg-back-btn"
                      aria-label="Back to single dates"
                      onClick={() => setPkgMultiMode(false)}
                      initial={{ opacity: 0, x: -10, scale: 0.85 }}
                      animate={{ opacity: 1, x: 0,   scale: 1,
                                 transition: { type: 'spring', stiffness: 500, damping: 28 } }}
                      exit={{    opacity: 0, x: -10, scale: 0.85,
                                 transition: { duration: 0.14, ease: 'easeIn' } }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
                <button type="button" className="bex-hero-pro__pill"
                  ref={el => { pillBtnRefs.current['pkgType'] = el; }}
                  onClick={() => openPillMenu('pkgType')}>
                  <span className="bex-hero-pro__pill-label">{PACKAGE_TABS[packageTab]}</span>
                  <IconChevronDown />
                </button>
                {!pkgMultiMode && (
                  <button type="button" className="bex-hero-pro__pill"
                    ref={el => { pillBtnRefs.current['pkgCabin'] = el; }}
                    onClick={() => openPillMenu('pkgCabin')}>
                    <span className="bex-hero-pro__pill-label">{packageCabinClass}</span>
                    <IconChevronDown />
                  </button>
                )}
              </>)}
            </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
        {/* Floating popover menu — positioned absolute within pillMenuWrapperRef */}
        <AnimatePresence>
        {activePillMenu && (() => {
          const TRIP_OPTIONS = [
            { label: 'Roundtrip',   icon: <IconRoundtrip /> },
            { label: 'One-way',     icon: <IconMultiCity /> },
            { label: 'Multi-city',  icon: <IconOneWay /> },
          ];
          const CABIN_OPTIONS = [
            { label: 'Economy',          icon: <IconCabinEconomy /> },
            { label: 'Premium Economy',  icon: <IconCabinPremium /> },
            { label: 'Business class',   icon: <IconCabinBusiness /> },
            { label: 'First class',      icon: <IconCabinFirst /> },
          ];
          const PKG_OPTIONS = PACKAGE_TABS.map(t => ({ label: t, icon: null }));
          const menuCfg: Record<string, { options: {label:string;icon:React.ReactNode}[]; value: string; onSelect: (v: string) => void }> = {
            flightType: { options: TRIP_OPTIONS,   value: FLIGHT_TABS[flightTab],         onSelect: v => setFlightTab(FLIGHT_TABS.indexOf(v)) },
            cabin:      { options: CABIN_OPTIONS,  value: fields.cabinClass || 'Economy', onSelect: v => updateField({ cabinClass: v }) }, // 'Business class' / 'First class' stored as-is
            pkgType:    { options: PKG_OPTIONS,    value: PACKAGE_TABS[packageTab],       onSelect: v => setPackageTab(PACKAGE_TABS.indexOf(v)) },
            pkgCabin:   { options: CABIN_OPTIONS,  value: packageCabinClass,              onSelect: v => setPackageCabinClass(v) },
          };
          const cfg = menuCfg[activePillMenu];
          if (!cfg) return null;
          return (
            <>
              <div className="bex-pill-menu-backdrop" onClick={() => setActivePillMenu(null)} />
              <motion.div
                className="bex-pill-menu"
                style={{ top: pillMenuPos.top, left: pillMenuPos.left }}
                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ type: 'spring', stiffness: 500, damping: 36, mass: 0.6 }}
              >
                {cfg.options.map((opt, i) => (
                  <button key={opt.label} type="button"
                    className={`bex-pill-menu__item${cfg.value === opt.label ? ' bex-pill-menu__item--sel' : ''}${i < cfg.options.length - 1 ? ' bex-pill-menu__item--border' : ''}`}
                    onClick={() => { cfg.onSelect(opt.label); setActivePillMenu(null); }}>
                    {opt.icon && <span className="bex-pill-menu__icon">{opt.icon}</span>}
                    <span className="bex-pill-menu__text">{opt.label}</span>
                    {cfg.value === opt.label && (
                      <svg className="bex-pill-menu__check" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          );
        })()}
        </AnimatePresence>
        </div>

        {/* LOB-specific search form — opacity only, no y-movement to avoid layout shift */}
        <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="pro-form-wrapper"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.34, ease: 'easeOut' }}
          >
          <div className="bex-hero-pro__bottom">
            {/* Form bloom: exit retreats/blurs, new blooms up from within */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeLob}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={FORM_WRAPPER_VARIANTS}
                style={{ isolation: 'isolate' }}
              >
                {renderForm()}
              </motion.div>
            </AnimatePresence>

            {/* Cruise advisory note — flex sibling so gap:16px gives equal top/bottom spacing */}
            <AnimatePresence initial={false}>
              {activeLob === 'cruises' && (
                <motion.p
                  key="cruise-note"
                  className="bex-hero-pro__note"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  For expert cruise advice, call 1-866-403-9848.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Search button — spring press feedback */}
            <motion.button
              type="button"
              className="bex-hero-pro__submit"
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            >
              Search
            </motion.button>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
        </div>{/* end hot-zone */}
      </div>

      {/* MSF uses Lite sheets while retaining the complete Pro shell and pills. */}
      <AnimatePresence>
        {openSheet && (
          fieldSheets === 'lite' ? (
            <LiteFieldSheet
              key={`lite-${openSheet}`}
              type={openSheet}
              lob={activeLob}
              fieldValues={fields}
              includeCabinClass={false}
              onClose={handleSheetClose}
              onChange={mcEditRef.current ? handleMcFieldChange : updateField}
            />
          ) : (
            <FieldSheet
              key={`pro-${openSheet}`}
              type={openSheet}
              lob={activeLob}
              fieldValues={fields}
              handoff={openSheet === 'where' || openSheet === 'origin' ? handoff : null}
              onClose={handleSheetClose}
              onChange={mcEditRef.current ? handleMcFieldChange : updateField}
            />
          )
        )}
      </AnimatePresence>

    </>
  );
};
