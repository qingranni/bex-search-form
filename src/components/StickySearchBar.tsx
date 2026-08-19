import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LobId } from './BexHero';
import type { Version, Warmth } from './VersionSwitcher';
import { BexHero } from './BexHero';
import { BexHeroPro } from './BexHeroPro';

const LOB_PICTOGRAMS: Record<string, string> = {
  stays:      'https://www.figma.com/api/mcp/asset/7ddeaffe-5255-495e-8884-df63ea8c7631.png',
  flights:    'https://www.figma.com/api/mcp/asset/9bafe27c-f567-4aaa-ac8a-942202531e11.png',
  cars:       'https://www.figma.com/api/mcp/asset/26459eb8-01e3-41e7-9ede-ebf24b33753a.png',
  packages:   'https://www.figma.com/api/mcp/asset/4ec77f99-6308-4ab9-9e31-5b5b18559ba9.png',
  activities: 'https://www.figma.com/api/mcp/asset/92107ca5-817c-483c-956d-9a16e86d86bb.png',
  cruises:    'https://www.figma.com/api/mcp/asset/8b4c9ef2-b888-4e14-b07d-f90710d13a52.png',
};

const LOB_LABELS: Record<string, string> = {
  stays: 'stays', flights: 'flights', cars: 'cars',
  packages: 'packages', activities: 'activities', cruises: 'cruises',
};

function extractCity(where: string): string {
  return where.replace(/\s*\(.*?\).*/, '').replace(/,.*/, '').trim();
}

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
);

interface Props {
  visible: boolean;
  lastLob: LobId;
  recentCity: string | null;
  version: Version;
  warmth: Warmth;
  onClose: () => void;
}

export const StickySearchBar: React.FC<Props> = ({
  visible, lastLob, recentCity, version, warmth,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!visible) setExpanded(false);
  }, [visible]);

  const pillText = recentCity
    ? `Keep exploring ${extractCity(recentCity)}`
    : `Search for ${LOB_LABELS[lastLob]}`;

  return (
    <>
      {/* ── Compact collapsed hero card — slides down from top on scroll ── */}
      <AnimatePresence>
        {visible && !expanded && (
          <motion.div
            key="sticky-card"
            className="bex-sticky-bar"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.8 }}
          >
            {/* Hero-card shell — same elevation token as the main hero */}
            <div className="bex-sticky-bar__hero-card">
              {/* Search pill */}
              <button
                type="button"
                className="bex-sticky-bar__pill"
                onClick={() => setExpanded(true)}
                aria-label={`Expand search: ${pillText}`}
              >
                {/* LOB bubble — absolute, left-anchored */}
                <span className="bex-sticky-bar__lob-bubble">
                  <img
                    src={LOB_PICTOGRAMS[lastLob]}
                    alt=""
                    className="bex-sticky-bar__lob-img"
                    aria-hidden="true"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <IconChevronDown />
                </span>

                {/* Centered search text */}
                <span className="bex-sticky-bar__pill-text">{pillText}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top sheet — slides down when pill is tapped ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="sticky-sheet-wrap"
            className="bex-sticky-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Scrim — tap to close, no scroll-to-top */}
            <div
              className="bex-sticky-overlay__scrim"
              role="button"
              aria-label="Close search"
              tabIndex={0}
              onClick={() => setExpanded(false)}
              onKeyDown={e => e.key === 'Enter' && setExpanded(false)}
            />

            {/* Sheet — slides down from top */}
            <motion.div
              className="bex-sticky-overlay__sheet"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.85 }}
            >

              {/* Hero form — overlay=true hides toolbar */}
              {version === 'lite'
                ? <BexHero warmth={warmth} overlay />
                : <BexHeroPro warmth={warmth} overlay />
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
