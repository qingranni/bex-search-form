import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  // Sticky bar state
  const [scrolledPast, setScrolledPast] = useState(false);
  const [lastLob, setLastLob] = useState<LobId>('stays');
  const [recentCity, setRecentCity] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);

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

  // Sync recent city with warmth — hot state always defaults to Phoenix
  useEffect(() => {
    if (warmth === 'hot') setRecentCity('Phoenix');
    else setRecentCity(null);
  }, [warmth]);

  // Scroll detection on the .bex-app container
  const handleScroll = useCallback(() => {
    const el = appRef.current;
    if (!el) return;
    setScrolledPast(el.scrollTop > 100);
  }, []);

  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Scroll back to top when sticky bar close is triggered
  const handleStickyClose = useCallback(() => {
    appRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bex-shell">
      <IPhoneFrame>
        <div className="bex-app" id="root-app" ref={appRef}>
          <div className="bex-screen bex-home bex-home--evo bex-still">

            {/* Hero — remount on version/warmth change to reset field state */}
            {version === 'lite' ? (
              <BexHero key={`lite-${warmth}`} warmth={warmth} />
            ) : (
              <BexHeroPro key={`pro-${warmth}`} warmth={warmth} />
            )}

            {/* Scrollable feed — hot state shows personalized trip content */}
            {warmth === 'hot' ? <HotFeed /> : <EvoFeed />}

            {/* Global nav — floating pill with home indicator */}
            <BexClassicBar version={version} />
          </div>

          {/* Sticky bar — fixed within the iPhone screen, appears on scroll */}
          <StickySearchBar
            visible={scrolledPast}
            lastLob={lastLob}
            recentCity={recentCity}
            version={version}
            warmth={warmth}
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
        warmth={warmth}
        onVersion={setVersion}
        onWarmth={setWarmth}
      />
    </div>
  );
};

export default App;
