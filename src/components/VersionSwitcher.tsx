import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type Version = 'lite' | 'msf' | 'pro';
export type Warmth = 'cold' | 'hot';

interface Props {
  version: Version;
  warmth: Warmth;
  onVersion: (v: Version) => void;
  onWarmth: (w: Warmth) => void;
}

export const VersionSwitcher: React.FC<Props> = ({
  version,
  warmth,
  onVersion,
  onWarmth,
}) => (
  <div className="bex-vsw" role="toolbar" aria-label="Prototype controls">
    <motion.div
      className="bex-vsw__surface"
      layout
      transition={{ layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="bex-vsw__group" role="group" aria-label="Form version">
        {([
          ['lite', 'Lite'],
          ['msf', 'MSF'],
          ['pro', 'Pro ✦'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="bex-vsw__pill"
            data-active={version === id ? 'true' : undefined}
            aria-pressed={version === id}
            onClick={() => onVersion(id)}
          >
            {version === id && (
              <motion.span
                className="bex-vsw__active-indicator"
                layoutId="bex-version-active"
                transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.72 }}
              />
            )}
            <span className="bex-vsw__pill-label">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {version === 'pro' && (
          <motion.div
            key="pro-state-controls"
            className="bex-vsw__state-wrap"
            initial={{ width: 0, opacity: 0, scale: 0.96 }}
            animate={{ width: 'auto', opacity: 1, scale: 1 }}
            exit={{ width: 0, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bex-vsw__sep" aria-hidden="true" />
            <div className="bex-vsw__group" role="group" aria-label="Search state">
              {([
                ['cold', '❄ Cold'],
                ['hot', '🔥 Hot'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="bex-vsw__pill"
                  data-active={warmth === id ? 'true' : undefined}
                  aria-pressed={warmth === id}
                  onClick={() => onWarmth(id)}
                >
                  {warmth === id && (
                    <motion.span
                      className="bex-vsw__active-indicator"
                      layoutId="bex-warmth-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.72 }}
                    />
                  )}
                  <span className="bex-vsw__pill-label">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
);
