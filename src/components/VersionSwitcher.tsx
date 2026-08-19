import React from 'react';

export type Version = 'lite' | 'pro';
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
    <div className="bex-vsw__group" role="group" aria-label="Form version">
      <button
        type="button"
        className="bex-vsw__pill"
        data-active={version === 'lite' ? 'true' : undefined}
        aria-pressed={version === 'lite'}
        onClick={() => onVersion('lite')}
      >
        Lite
      </button>
      <button
        type="button"
        className="bex-vsw__pill"
        data-active={version === 'pro' ? 'true' : undefined}
        aria-pressed={version === 'pro'}
        onClick={() => onVersion('pro')}
      >
        Pro ✦
      </button>
    </div>
    <div className="bex-vsw__sep" aria-hidden="true" />
    <div className="bex-vsw__group" role="group" aria-label="Search state">
      <button
        type="button"
        className="bex-vsw__pill"
        data-active={warmth === 'cold' ? 'true' : undefined}
        aria-pressed={warmth === 'cold'}
        onClick={() => onWarmth('cold')}
      >
        ❄ Cold
      </button>
      <button
        type="button"
        className="bex-vsw__pill"
        data-active={warmth === 'hot' ? 'true' : undefined}
        aria-pressed={warmth === 'hot'}
        onClick={() => onWarmth('hot')}
      >
        🔥 Hot
      </button>
    </div>
  </div>
);
