import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Version } from './VersionSwitcher';

// ── EGDS icons (exact paths from Figma Work_Medium, Comment_Medium, etc.) ────

const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M13 12.5C14.1046 12.5 15 13.3954 15 14.5V18H19V9.07037L12.5547 4.7735C12.2188 4.54957 11.7812 4.54957 11.4453 4.7735L5 9.07037V18H9V14.5C9 13.3954 9.89543 12.5 11 12.5H13ZM3 8L10.3359 3.1094C11.3436 2.4376 12.6564 2.4376 13.6641 3.1094L21 8V18C21 19.1046 20.1046 20 19 20H13V14.5H11V20H5C3.89543 20 3 19.1046 3 18V8Z" />
  </svg>
);

const IconSearch = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M15.1921 16.6064C14.0236 17.4816 12.5723 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.5724 17.4816 14.0236 16.6064 15.1922L20.3536 18.9394C20.5488 19.1347 20.5488 19.4513 20.3536 19.6465L19.6465 20.3536C19.4512 20.5489 19.1346 20.5489 18.9394 20.3536L15.1921 16.6064ZM16 11C16 13.7614 13.7614 16 11 16C8.23858 16 6 13.7614 6 11C6 8.23858 8.23858 6 11 6C13.7614 6 16 8.23858 16 11Z" />
  </svg>
);

const IconTrips = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {/* Work_Medium — EGDS briefcase icon */}
    <path d="M12.7071 14.9498C12.3166 14.5593 12.3166 13.9261 12.7071 13.5356L15.5355 10.7071C15.9261 10.3166 16.5592 10.3166 16.9497 10.7071L17.6569 11.4142C18.0474 11.8048 18.0474 12.4379 17.6569 12.8285L14.8284 15.6569C14.4379 16.0474 13.8047 16.0474 13.4142 15.6569L12.7071 14.9498Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8 4V6H5C3.34315 6 2 7.34315 2 9V18C2 19.6569 3.34315 21 5 21H19C20.6569 21 22 19.6569 22 18V9C22 7.34315 20.6569 6 19 6H16V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4ZM14 4H10V6H14V4ZM19 8C19.5523 8 20 8.44771 20 9V18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18V9C4 8.44772 4.44772 8 5 8H19Z" />
  </svg>
);

const IconInbox = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {/* Comment_Medium — EGDS chat bubble with lines */}
    <path fillRule="evenodd" clipRule="evenodd" d="M5 5C4.44772 5 4 5.44772 4 6V16C4 16.5523 4.44772 17 5 17H9.94078C10.531 17 11.0035 17.5319 10.9338 18.118C10.8684 18.668 10.755 19.2108 10.5949 19.7403C11.7558 19.35 12.7268 18.545 13.3317 17.4993C13.5104 17.1903 13.8403 17 14.1973 17H19C19.5523 17 20 16.5523 20 16V6C20 5.44772 19.5523 5 19 5H5ZM2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V16C22 17.6569 20.6569 19 19 19H14.7452C13.4814 20.8118 11.38 22 9 22C8.65342 22 8.33156 21.8205 8.14935 21.5257C7.96714 21.2309 7.95058 20.8628 8.10557 20.5528C8.35617 20.0516 8.57696 19.5414 8.72737 19H5C3.34315 19 2 17.6569 2 16V6Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M17 9.5C17 9.77614 16.7761 10 16.5 10H7.5C7.22386 10 7 9.77614 7 9.5V8.5C7 8.22386 7.22386 8 7.5 8H16.5C16.7761 8 17 8.22386 17 8.5V9.5Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M17 13.5C17 13.7761 16.7761 14 16.5 14H7.5C7.22386 14 7 13.7761 7 13.5V12.5C7 12.2239 7.22386 12 7.5 12H16.5C16.7761 12 17 12.2239 17 12.5V13.5Z" />
  </svg>
);

const IconAccount = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {/* Person_Medium — EGDS person outline */}
    <path fillRule="evenodd" clipRule="evenodd" d="M12 9C13.1046 9 14 8.10457 14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M18.7107 19C17.8506 16.108 15.1693 14 12 14C8.8307 14 6.14944 16.108 5.28932 19H18.7107ZM5 21C3.89543 21 2.97699 20.0932 3.21949 19.0156C4.12318 14.9998 7.71127 12 12 12C16.2887 12 19.8768 14.9998 20.7805 19.0156C21.023 20.0932 20.1046 21 19 21H5Z" />
  </svg>
);

// ── Spring ────────────────────────────────────────────────────────────────────
const PILL_SPRING = { type: 'spring', stiffness: 400, damping: 34, mass: 0.6 } as const;
const FADE = { duration: 0.12, ease: 'easeOut' } as const;

const NAV_ITEMS = [
  { id: 'home',    label: 'Home',    Icon: IconHome,    badge: false },
  { id: 'search',  label: 'Search',  Icon: IconSearch,  badge: false },
  { id: 'trips',   label: 'Trips',   Icon: IconTrips,   badge: false },
  { id: 'inbox',   label: 'Inbox',   Icon: IconInbox,   badge: true  },
  { id: 'account', label: 'Account', Icon: IconAccount, badge: false },
];

interface Props {
  version: Version;
}

export const BexClassicBar: React.FC<Props> = ({ version }) => {
  const [selected, setSelected] = useState('home');
  const isLite = version === 'lite';

  return (
    <nav className={`bex-globalnav bex-globalnav--${version}`} aria-label="Main">

      {isLite ? (
        /* ── LITE: EGDS anchored global nav ─────────────────────────────────── */
        <div className="bex-globalnav__bar">
          {NAV_ITEMS.map(item => {
            const isActive = selected === item.id;
            const color = isActive ? '#191e3b' : '#676a7d';
            return (
              <button
                key={item.id}
                type="button"
                className="bex-globalnav__item bex-globalnav__item--lite"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setSelected(item.id)}
              >
                {/* 4px indicator bar slot — always reserves top space */}
                <span className="bex-globalnav__lite-indicator-wrap">
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        className="bex-globalnav__lite-indicator"
                        layoutId="lite-indicator"
                        transition={PILL_SPRING}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: FADE }}
                        aria-hidden="true"
                      />
                    )}
                  </AnimatePresence>
                </span>

                {/* Icon + label — vertically centered in remaining height */}
                <span className="bex-globalnav__lite-iconlabel" style={{ color }}>
                  <span className="bex-globalnav__icon" style={{ position: 'relative' }}>
                    <item.Icon />
                    {item.badge && !isActive && (
                      <span className="bex-globalnav__badge" aria-label="New notifications" />
                    )}
                  </span>
                  <span className="bex-globalnav__label">{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* ── PRO: dark glass floating pill ─────────────────────────────────── */
        <div className="bex-globalnav__pill">
          {NAV_ITEMS.map(item => {
            const isActive = selected === item.id;
            const color = isActive ? '#191e3b' : 'rgba(255,255,255,0.90)';
            return (
              <button
                key={item.id}
                type="button"
                className="bex-globalnav__item"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setSelected(item.id)}
                style={{ color, position: 'relative' }}
              >
                {isActive && (
                  <motion.span
                    className="bex-globalnav__bubble bex-globalnav__bubble--pro"
                    layoutId="globalnav-bubble"
                    transition={PILL_SPRING}
                    aria-hidden="true"
                  />
                )}
                <motion.span
                  className="bex-globalnav__icon"
                  animate={{ y: isActive ? -1 : 0 }}
                  transition={PILL_SPRING}
                  style={{ position: 'relative' }}
                >
                  <item.Icon />
                </motion.span>
                <span className="bex-globalnav__label">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* iPhone home indicator */}
      <div className="bex-globalnav__indicator" aria-hidden="true">
        <div className="bex-globalnav__indicator-bar" />
      </div>
    </nav>
  );
};
