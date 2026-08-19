import React from 'react';

// ── Photo assets ──────────────────────────────────────────────────────────────
const IMG_PHOENIX   = 'https://images.unsplash.com/photo-1562978000-05cf94d38c4e?w=800&h=500&fit=crop&crop=top&auto=format&q=82';
const IMG_HOTEL_1   = 'https://www.figma.com/api/mcp/asset/5e8b21c7-9c34-4a27-b012-a6a75934c92a.png';
const IMG_HOTEL_2   = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=640&h=430&fit=crop&crop=center&auto=format&q=80';

// Recent activity thumbnails
const IMG_RECENT_1  = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop&crop=center&auto=format&q=80';
const IMG_RECENT_2  = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop&crop=center&auto=format&q=80';
const IMG_RECENT_3  = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center&auto=format&q=80';
const IMG_RECENT_4  = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop&crop=center&auto=format&q=80';

// Trending stay cards (16:9)
const IMG_STAY_1    = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=340&fit=crop&crop=center&auto=format&q=80';
const IMG_STAY_2    = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=340&fit=crop&crop=center&auto=format&q=80';

// Merchandising banners
const IMG_MERCH_1   = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop&crop=center&auto=format&q=80';
const IMG_MERCH_2   = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop&crop=center&auto=format&q=80';

// Collection / RTB
const IMG_COLL_BG   = 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
const IMG_RTB_1     = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=450&fit=crop&crop=top&auto=format&q=80';
const IMG_RTB_2     = 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=400&h=450&fit=crop&crop=center&auto=format&q=80';

// ── Inline icons ──────────────────────────────────────────────────────────────
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);
const IconFlightRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(90,12,12)"/>
  </svg>
);
const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="rgba(0,0,0,0.2)" strokeWidth="1" aria-hidden>
    <path d="M12.9663 3.73349C17.3889 1.04082 22.7022 4.2138 22.7505 9.18368C22.7804 12.2849 21.2614 15.0542 19.1939 17.1954C17.319 19.1371 14.9816 20.7203 12.9302 21.9933C12.3666 22.343 11.653 22.3433 11.0884 21.9952C9.01522 20.7163 6.69036 19.1444 4.82571 17.2091C2.76943 15.0747 1.2665 12.3147 1.25052 9.1954C1.22489 4.15182 6.71599 1.08501 11.0357 3.72079C11.3948 3.94 11.7178 4.19167 12.0034 4.44931C12.2903 4.19493 12.6135 3.94835 12.9663 3.73349Z"/>
  </svg>
);
const IconStay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#474b62" aria-hidden>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);
const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#474b62" aria-hidden>
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);
const IconOneKey = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);
const IconCheckmark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1976d2" aria-hidden>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

// ── Hotel card (horizontal scroll) ────────────────────────────────────────────
interface HotelCardProps {
  photo: string;
  name: string;
  rating: string;
  price: string;
  strikePrice: string;
  nightly: string;
  badge: string;
}
const HotelCard: React.FC<HotelCardProps> = ({ photo, name, rating, price, strikePrice, nightly, badge }) => (
  <div className="hot-hotel-card">
    <div className="hot-hotel-card__img-wrap">
      <img src={photo} alt={name} className="hot-hotel-card__img" />
      <button type="button" className="hot-hotel-card__fav" aria-label="Save">
        <IconHeart />
      </button>
      <div className="hot-hotel-card__dots">
        <span className="hot-hotel-card__dot hot-hotel-card__dot--active"/>
        <span className="hot-hotel-card__dot"/>
        <span className="hot-hotel-card__dot"/>
        <span className="hot-hotel-card__dot"/>
        <span className="hot-hotel-card__dot hot-hotel-card__dot--sm"/>
      </div>
    </div>
    <div className="hot-hotel-card__body">
      <div className="hot-hotel-card__name-row">
        <span className="hot-hotel-card__name">{name}</span>
        <span className="hot-hotel-card__rating">{rating}</span>
      </div>
      <div className="hot-hotel-card__price-row">
        <span className="hot-hotel-card__price">{price}</span>
        <span className="hot-hotel-card__strike">{strikePrice}</span>
        <span className="hot-hotel-card__dot-sep">·</span>
        <span className="hot-hotel-card__nightly">{nightly}</span>
      </div>
      <p className="hot-hotel-card__legal">Total includes taxes &amp; fees</p>
      <span className="hot-hotel-card__badge">{badge}</span>
    </div>
  </div>
);

// ── Recent activity card (small horizontal card) ────────────────────────────
interface RecentCardProps {
  photo: string;
  name: string;
  sub: string;
  price: string;
}
const RecentCard: React.FC<RecentCardProps> = ({ photo, name, sub, price }) => (
  <div className="hot-recent-card">
    <img src={photo} alt={name} className="hot-recent-card__img" />
    <div className="hot-recent-card__body">
      <div className="hot-recent-card__name">{name}</div>
      <div className="hot-recent-card__sub">{sub}</div>
      <div className="hot-recent-card__price">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#1976d2" aria-hidden>
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
        <span>{price}</span>
      </div>
    </div>
  </div>
);

// ── Trending LOB card (wider, 16:9 image) ─────────────────────────────────────
interface TrendCardProps {
  photo: string;
  name: string;
  location: string;
  rating: string;
  price: string;
  badge: string;
}
const TrendCard: React.FC<TrendCardProps> = ({ photo, name, location, rating, price, badge }) => (
  <div className="hot-trend-card">
    <div className="hot-trend-card__img-wrap">
      <img src={photo} alt={name} className="hot-trend-card__img" />
      <button type="button" className="hot-trend-card__fav" aria-label="Save">
        <IconHeart />
      </button>
    </div>
    <div className="hot-trend-card__body">
      <div className="hot-trend-card__top-row">
        <div>
          <div className="hot-trend-card__name">{name}</div>
          <div className="hot-trend-card__loc">{location}</div>
        </div>
        <div className="hot-trend-card__rating-badge">{rating}</div>
      </div>
      <div className="hot-trend-card__price-row">
        <span className="hot-trend-card__price">{price}</span>
      </div>
      <span className="hot-trend-card__badge">{badge}</span>
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
export const HotFeed: React.FC = () => (
  <div className="hot-feed">

    {/* ── Greeting ─────────────────────────────────────────────────────── */}
    <div className="hot-feed__greeting">
      <h2 className="hot-feed__greeting-title">Good morning, Mary.</h2>
      <p className="hot-feed__greeting-sub">
        Sunny skies ahead.<br />Your trip is starting soon.
      </p>
    </div>

    {/* ── Trip card ────────────────────────────────────────────────────── */}
    <div className="hot-feed__trip-card">
      <div className="hot-feed__trip-img-wrap">
        <img src={IMG_PHOENIX} alt="Phoenix" className="hot-feed__trip-bg-img" />
        <div className="hot-feed__trip-scrim" />
        <div className="hot-feed__trip-overlay-text">
          <div className="hot-feed__trip-city">Phoenix</div>
          <div className="hot-feed__trip-dates">July 15–25</div>
          <div className="hot-feed__trip-badge">In 3 months</div>
        </div>
        <button type="button" className="hot-feed__view-trip-btn">View trip</button>
      </div>

      <div className="hot-feed__trip-list">
        <div className="hot-feed__trip-row">
          <div className="hot-feed__trip-row-icon hot-feed__trip-row-icon--flight">
            <IconFlightRight />
          </div>
          <div className="hot-feed__trip-row-content">
            <div className="hot-feed__trip-row-primary">
              <span>AUS</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#474b62" aria-hidden>
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>PHX</span>
            </div>
            <div className="hot-feed__trip-row-secondary">Departs: 5:45pm</div>
          </div>
          <button type="button" className="hot-feed__trip-row-btn hot-feed__trip-row-btn--grey">
            <IconArrow />
          </button>
        </div>

        <div className="hot-feed__trip-list-divider" />

        <div className="hot-feed__trip-row">
          <div className="hot-feed__trip-row-icon hot-feed__trip-row-icon--placeholder">
            <IconStay />
          </div>
          <div className="hot-feed__trip-row-content">
            <div className="hot-feed__trip-row-primary" style={{ display: 'block' }}>Add a stay</div>
            <div className="hot-feed__trip-row-secondary">Up to 40% off</div>
          </div>
          <button type="button" className="hot-feed__trip-row-btn hot-feed__trip-row-btn--yellow">
            <IconPlus />
          </button>
        </div>

        <div className="hot-feed__trip-list-divider" />

        <div className="hot-feed__trip-row">
          <div className="hot-feed__trip-row-icon hot-feed__trip-row-icon--placeholder">
            <IconCar />
          </div>
          <div className="hot-feed__trip-row-content">
            <div className="hot-feed__trip-row-primary" style={{ display: 'block' }}>Add a car</div>
            <div className="hot-feed__trip-row-secondary">Up to 40% off</div>
          </div>
          <button type="button" className="hot-feed__trip-row-btn hot-feed__trip-row-btn--yellow">
            <IconPlus />
          </button>
        </div>
      </div>
    </div>

    {/* ── Your style of stay ───────────────────────────────────────────── */}
    <div className="hot-feed__section">
      <h3 className="hot-feed__section-title">Your style of stay in Phoenix</h3>
      <div className="hot-feed__hotel-scroll">
        <HotelCard
          photo={IMG_HOTEL_1}
          name="Sentral Sol Modern"
          rating="9.0"
          price="$772 total"
          strikePrice="$995"
          nightly="$257 nightly"
          badge="Bundle & save $40"
        />
        <HotelCard
          photo={IMG_HOTEL_2}
          name="Canopy by Hilton Phoenix"
          rating="8.8"
          price="$648 total"
          strikePrice="$820"
          nightly="$216 nightly"
          badge="Bundle & save $32"
        />
      </div>
      <button type="button" className="hot-feed__explore-btn">Explore more</button>
    </div>

    {/* ─────────────────────────────────────────────────────────────────────────
        ADDITIONAL SECTIONS FROM FIGMA node 6120:168946
    ───────────────────────────────────────────────────────────────────────── */}

    {/* ── Continue browsing (Recent Activity) ─────────────────────────── */}
    <div className="hot-feed__section">
      <h3 className="hot-feed__section-title">Continue browsing</h3>
      <div className="hot-feed__recent-scroll">
        <RecentCard
          photo={IMG_RECENT_1}
          name="Westin Phoenix"
          sub="Jul 15 – Jul 25 · 2 guests"
          price="From $189/night"
        />
        <RecentCard
          photo={IMG_RECENT_2}
          name="Andaz Scottsdale"
          sub="Jul 15 – Jul 25 · 2 guests"
          price="From $229/night"
        />
        <RecentCard
          photo={IMG_RECENT_3}
          name="Royal Palms Resort"
          sub="Jul 15 – Jul 25 · 2 guests"
          price="From $310/night"
        />
        <RecentCard
          photo={IMG_RECENT_4}
          name="JW Marriott Desert Ridge"
          sub="Jul 15 – Jul 25 · 2 guests"
          price="From $275/night"
        />
      </div>
    </div>

    {/* ── Merchandising banner (large featured card) ───────────────────── */}
    <div className="hot-feed__merch-card">
      <img src={IMG_MERCH_1} alt="Summer deals" className="hot-feed__merch-card__bg" />
      <div className="hot-feed__merch-card__scrim" />
      <div className="hot-feed__merch-card__content">
        <p className="hot-feed__merch-card__eyebrow">Limited time offer</p>
        <h3 className="hot-feed__merch-card__title">Big savings on Phoenix stays</h3>
        <p className="hot-feed__merch-card__sub">Save up to 40% on select hotels when you book today.</p>
        <button type="button" className="hot-feed__merch-card__cta">Shop deals</button>
      </div>
    </div>

    {/* ── Trending stays in Phoenix (16:9 card scroll) ─────────────────── */}
    <div className="hot-feed__section">
      <div className="hot-feed__section-header">
        <h3 className="hot-feed__section-title">Trending stays in Phoenix</h3>
        <p className="hot-feed__section-sub">Based on your travel style</p>
      </div>
      <div className="hot-feed__trend-scroll">
        <TrendCard
          photo={IMG_STAY_1}
          name="Arizona Grand Resort"
          location="Ahwatukee, Phoenix"
          rating="9.2"
          price="$204 /night"
          badge="Members price available"
        />
        <TrendCard
          photo={IMG_STAY_2}
          name="Omni Scottsdale Resort"
          location="Scottsdale, AZ"
          rating="8.6"
          price="$289 /night"
          badge="Free cancellation"
        />
      </div>
      <button type="button" className="hot-feed__explore-btn" style={{ marginTop: 12 }}>See all stays</button>
    </div>

    {/* ── OneKey merchandising collection ─────────────────────────────── */}
    <div className="hot-feed__onekey-card">
      <img src={IMG_COLL_BG} alt="OneKey rewards" className="hot-feed__onekey-card__bg" />
      <div className="hot-feed__onekey-card__overlay" />
      <div className="hot-feed__onekey-card__content">
        <div className="hot-feed__onekey-card__icon-wrap">
          <IconOneKey />
        </div>
        <h3 className="hot-feed__onekey-card__title">Earn with every booking</h3>
        <p className="hot-feed__onekey-card__sub">Use OneKey Cash on hotels, flights, and more across Expedia, Hotels.com, and Vrbo.</p>
        <button type="button" className="hot-feed__onekey-card__cta">Learn more</button>
      </div>
    </div>

    {/* ── Reason to Book (RTB) cards ───────────────────────────────────── */}
    <div className="hot-feed__section">
      <div className="hot-feed__section-header">
        <h3 className="hot-feed__section-title">Why book with Expedia?</h3>
        <p className="hot-feed__section-sub">More reasons to travel</p>
      </div>
      <div className="hot-feed__rtb-scroll">
        <div className="hot-feed__rtb-card">
          <img src={IMG_RTB_1} alt="Flexibility" className="hot-feed__rtb-card__img" />
          <div className="hot-feed__rtb-card__body">
            <div className="hot-feed__rtb-card__feature">
              <IconCheckmark />
              <span>Free cancellation on most stays</span>
            </div>
            <p className="hot-feed__rtb-card__title">Book with confidence</p>
            <p className="hot-feed__rtb-card__sub">Flexible options so you can change plans</p>
            <button type="button" className="hot-feed__rtb-card__cta">Explore stays</button>
          </div>
        </div>
        <div className="hot-feed__rtb-card">
          <img src={IMG_RTB_2} alt="Best prices" className="hot-feed__rtb-card__img" />
          <div className="hot-feed__rtb-card__body">
            <div className="hot-feed__rtb-card__feature">
              <IconCheckmark />
              <span>Price match guarantee</span>
            </div>
            <p className="hot-feed__rtb-card__title">Best price, always</p>
            <p className="hot-feed__rtb-card__sub">Find a lower price? We'll match it.</p>
            <button type="button" className="hot-feed__rtb-card__cta">Learn more</button>
          </div>
        </div>
      </div>
    </div>

    {/* ── Final merchandising card (OneKey partner hotel) ──────────────── */}
    <div className="hot-feed__merch-card hot-feed__merch-card--light" style={{ marginBottom: 32 }}>
      <img src={IMG_MERCH_2} alt="Exclusive deals" className="hot-feed__merch-card__bg" />
      <div className="hot-feed__merch-card__scrim hot-feed__merch-card__scrim--dark" />
      <div className="hot-feed__merch-card__content">
        <div className="hot-feed__merch-card__logo-row">
          <IconOneKey />
          <span className="hot-feed__merch-card__logo-text">Expedia</span>
        </div>
        <h3 className="hot-feed__merch-card__title">Your next adventure awaits</h3>
        <p className="hot-feed__merch-card__sub">Explore curated trips from Phoenix and beyond.</p>
        <button type="button" className="hot-feed__merch-card__cta hot-feed__merch-card__cta--outline">Book now</button>
      </div>
    </div>

  </div>
);
