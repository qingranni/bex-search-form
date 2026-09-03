import React, { useState, useRef, useEffect, useCallback } from 'react'; // useCallback kept for handleStickyClose
import './bex.css';
import { BexHero } from './components/BexHero';
import { BexHeroPro } from './components/BexHeroPro';
import { BexClassicBar } from './components/BexClassicBar';
import { BexStatusBar } from './components/BexStatusBar';
import { EvoFeed } from './components/EvoFeed';
import { HotFeed } from './components/HotFeed';
import { IPhoneFrame } from './components/IPhoneFrame';
import { VersionSwitcher } from './components/VersionSwitcher';
import { StickySearchBar } from './components/StickySearchBar';
import type { Version, Warmth } from './components/VersionSwitcher';
import type { LobId } from './components/BexHero';

const App: React.FC = () => {
  const [version, setVersion] = useState<Version>('lite');
  const [warmth, setWarmth] = useState<Warmth>('cold'); // 'cold' | 'hot'
  const activeWarmth: Warmth = version === 'pro' ? warmth : 'cold';

  // Sticky bar state
  const [scrolledPast, setScrolledPast] = useState(false);
  const [lastLob, setLastLob] = useState<LobId>('stays');
  const [recentCity, setRecentCity] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Listen for LOB changes dispatched by hero components
  useEffect(() => {
    const handler = (e: Event) => {
      const { lob, city } = (e as CustomEvent<{ lob: LobId; city: string }>).detail;
      setLastLob(lob);
      if (city) setRecentCity(city);
    };
    document.addEventListener('bex-lob', handler);
    return () => document.removeEventListener('bex-lob', handler);
  }, []);

  // Sync recent city with the active state — Hot is available only in Pro.
  useEffect(() => {
    if (activeWarmth === 'hot') setRecentCity('Phoenix');
    else setRecentCity(null);
  }, [activeWarmth]);

  // Show sticky bar only after the entire hero form has scrolled out of view.
  // IntersectionObserver fires as soon as the hero's last pixel leaves the viewport,
  // so it automatically adapts to every LOB's height.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      // Use the nearest scrolling ancestor (.bex-app) as the root so the
      // observation is scoped to the iPhone screen, not the browser viewport.
      { root: appRef.current, threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // Re-observe when version/warmth changes (hero remounts → different height)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, activeWarmth]);

  // Scroll back to top when sticky bar close is triggered
  const handleStickyClose = useCallback(() => {
    appRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bex-shell">
      <IPhoneFrame>
        <div className="bex-app" id="root-app" ref={appRef}>
          <div className="bex-screen bex-home bex-home--evo bex-still">

            {/* Hero — remount on version/warmth change to reset field state.
                heroRef tracks the bottom edge so the sticky bar fires only
                after the entire form has scrolled out of view. */}
            <div ref={heroRef}>
              {version === 'lite' ? (
                <BexHero key={`lite-${activeWarmth}`} warmth={activeWarmth} />
              ) : (
                <BexHeroPro
                  key={`${version}-${activeWarmth}`}
                  warmth={activeWarmth}
                  fieldSheets={version === 'msf' ? 'lite' : 'pro'}
                />
              )}
            </div>

            {/* Scrollable feed — hot state shows personalized trip content */}
            {activeWarmth === 'hot' ? <HotFeed /> : <EvoFeed />}

            {/* Global nav — floating pill with home indicator */}
            <BexClassicBar version={version} />
          </div>

          {/* Sticky bar — fixed within the iPhone screen, appears on scroll */}
          <StickySearchBar
            visible={scrolledPast}
            lastLob={lastLob}
            recentCity={recentCity}
            version={version}
            warmth={activeWarmth}
            onClose={handleStickyClose}
          />

          {/* Fixed status bar — always visible above scrolled content */}
          <div className="bex-status-bar-fixed">
            <BexStatusBar theme="light" />
          </div>
        </div>
      </IPhoneFrame>

      {/* Version / warmth pill switcher */}
      <VersionSwitcher
        version={version}
        warmth={activeWarmth}
        onVersion={setVersion}
        onWarmth={setWarmth}
      />
    </div>
  );
};

export default App;
