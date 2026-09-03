// BEX design tokens — verbatim from the BEX reference app CSS custom properties.
// CSS vars are set globally in index.css; these constants mirror them for
// inline styles in components that can't use CSS classes.

export const color = {
  // BEX foreground
  fgMax:            'var(--bex-fg-max, #191e3b)',
  fgMedium:         'var(--bex-fg-medium, #191e3bcc)',
  fgMin:            'var(--bex-fg-min, #191e3b99)',
  textMin:          'var(--bex-text-min, #191e3b61)',
  fgOnBrand:        'var(--bex-fg-on-brand, #0c0e1c)',

  // BEX backgrounds
  bgSecondary:      'var(--bex-bg-secondary, #f7f4f3)',
  bgNeutral:        'var(--bex-bg-neutral, #f5f4f2)',
  bgBrand:          'var(--bex-bg-brand, #fddb32)',
  bgLightBrand:     'var(--bex-bg-light-brand, #fef7e1)',
  bgLightBlue:      'var(--bex-bg-light-blue, #d7edfb)',

  // BEX strokes
  strokeMin:        'var(--bex-stroke-min, #24141417)',
  strokeMax:        'var(--bex-stroke-max, #191e3b)',

  // BEX scrims
  scrimMin:         'var(--bex-scrim-min, #0c0e1c33)',
  scrimMax:         'var(--bex-scrim-max, #0c0e1c99)',

  // BEX buttons
  btnPrimary:       'var(--bex-btn-primary, #fddb32)',
  btnSecondary:     'var(--bex-btn-secondary, #191e3b)',
  btnTertiary:      'var(--bex-btn-tertiary, #f7f4f3)',

  // EGDS semantic
  primary:          'var(--color-primary, #191e3b)',
  onSurface:        'var(--color-on-surface, #191e3b)',
  onSurfaceVariant: 'var(--color-on-surface-variant, #676a7d)',
  outline:          'var(--color-outline, #818494)',
  outlineVariant:   'var(--color-outline-variant, #dfe0e4)',
  outlineFocus:     'var(--color-outline-focus, #191e3b)',
  positive:         'var(--color-positive, #227950)',
  critical:         'var(--color-critical, #a7183c)',

  // Raw values (for places where var() can't be used)
  raw: {
    fgMax:          '#191e3b',
    bgSecondary:    '#f7f4f3',
    bgBrand:        '#fddb32',
    bgLightBlue:    '#d7edfb',
    strokeMin:      '#24141417',
    outlineVariant: '#dfe0e4',
    primary:        '#191e3b',
    white:          '#ffffff',
  },
} as const;

export const radius = {
  // EGDS
  s:     'var(--corner-radius-s, 2px)',
  m:     'var(--corner-radius-m, 4px)',
  l:     'var(--corner-radius-l, 8px)',
  xl:    'var(--corner-radius-xl, 16px)',
  xxl:   'var(--corner-radius-xxl, 24px)',
  max:   'var(--corner-radius-max, 40000px)',
  // BEX
  bexM:        'var(--bex-radius-m, 12px)',
  bexCard:     'var(--bex-radius-card, 32px)',
  bexCardMedia:'var(--bex-radius-card-media, 24px)',
  bexHero:     'var(--bex-radius-hero, 44px)',
  bexSection:  'var(--bex-radius-section, 48px)',
  // raw numbers for style calculations
  raw: {
    l: 8,
    xl: 16,
    xxl: 24,
    bexM: 12,
  },
} as const;

export const shadow = {
  high:   `var(--shadow-high-elevation-offset-x, 0px) var(--shadow-high-elevation-offset-y, 6px) var(--shadow-high-elevation-blur, 36px) var(--shadow-high-elevation-spread, 0px) var(--shadow-high-elevation-color, #0c0e1c1f)`,
  medium: `var(--shadow-medium-elevation-offset-x, 0px) var(--shadow-medium-elevation-offset-y, 2px) var(--shadow-medium-elevation-blur, 12px) var(--shadow-medium-elevation-spread, 0px) var(--shadow-medium-elevation-color, #0c0e1c14)`,
} as const;

export const spacing = {
  xs:  'var(--spacing-xs, 4px)',
  s:   'var(--spacing-s, 8px)',
  m:   'var(--spacing-m, 16px)',
  l:   'var(--spacing-l, 24px)',
  xl:  'var(--spacing-xl, 32px)',
  raw: {
    xs: 4,
    s:  8,
    m:  16,
    l:  24,
    xl: 32,
  },
} as const;

export const font = {
  family: 'var(--bex-font, "Centra No2", "Inter", "Helvetica Neue", -apple-system, "DM Sans", sans-serif)',
  size: {
    s:  '12px',
    m:  '14px',
    l:  '16px',
    xl: '20px',
  },
  weight: {
    regular:  400,
    medium:   500,
    bold:     700,
  },
  lineHeight: {
    s:  '16px',
    m:  '18px',
    l:  '20px',
  },
} as const;
