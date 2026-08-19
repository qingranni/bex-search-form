import React from 'react';

interface Props {
  children: React.ReactNode;
}

/**
 * iPhone 16 Pro–style hardware frame (titanium black).
 * Inner screen is exactly 402 × 874 px, matching the Figma artboard.
 * Dynamic Island is overlaid as a hardware element on top of the status bar.
 */
export const IPhoneFrame: React.FC<Props> = ({ children }) => (
  <div className="iphone-frame">
    {/* Left-side buttons: action, volume up, volume down */}
    <div className="iphone-frame__btn iphone-frame__btn--action"  aria-hidden="true" />
    <div className="iphone-frame__btn iphone-frame__btn--vol-up"  aria-hidden="true" />
    <div className="iphone-frame__btn iphone-frame__btn--vol-dn"  aria-hidden="true" />
    {/* Right-side: power/side button */}
    <div className="iphone-frame__btn iphone-frame__btn--power"   aria-hidden="true" />

    {/* Screen — clips content to 402 × 874 */}
    <div className="iphone-frame__screen">
      {/* Dynamic Island — hardware overlay */}
      <div className="iphone-frame__island" aria-hidden="true" />
      {children}
    </div>

    {/* Subtle speaker grille line at bottom */}
    <div className="iphone-frame__speaker" aria-hidden="true" />
  </div>
);
