import React from 'react';

// ── Vendored Figma image assets ────────────────────────────────────────────────
const IMG_HOTEL      = '/images/figma/ad641617-d02a-4fd4-9fb3-b0c91f498ca8.png';
const IMG_MERCH_1    = '/images/figma/9b32d48a-d174-40b1-baf9-4070de6a6df9.png';
const IMG_MERCH_2    = '/images/figma/79db9b9b-2b44-497e-87bd-e6d022fbb2e6.png';
const IMG_DEST       = '/images/figma/79db9b9b-2b44-497e-87bd-e6d022fbb2e6.png';
const IMG_CAT_HOME   = '/images/figma/304f7449-704f-4f59-a231-ee465adfd2e6.png';
const IMG_CAT_CONDO  = '/images/figma/aa25da95-79d3-4c20-8c8f-447e48224902.png';
const IMG_CAT_CABIN  = '/images/figma/b08be23a-46e1-431a-adcf-9b15726c4884.png';
const IMG_CAT_VILLA  = '/images/figma/530e72ef-c492-4281-896a-8877fe7cb32f.png';

// ── Icons ────────────────────────────────────────────────────────────────────
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M13.207 5C13.3396 5 13.4668 5.05274 13.5605 5.14648L19.707 11.293C20.0976 11.6835 20.0976 12.3165 19.707 12.707L13.5605 18.8535C13.4668 18.9473 13.3396 19 13.207 19H11.293C11.0383 19 10.9094 18.6847 11.0811 18.5049L16.5859 13H4.5C4.22386 13 4 12.7761 4 12.5V11.5C4 11.2239 4.22386 11 4.5 11H16.5859L11.0859 5.5C10.9079 5.32197 11.0351 5 11.293 5H13.207Z" fill="currentColor"/>
  </svg>
);

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.9663 3.73349C17.3889 1.04082 22.7022 4.2138 22.7505 9.18368C22.7804 12.2849 21.2614 15.0542 19.1939 17.1954C17.319 19.1371 14.9816 20.7203 12.9302 21.9933C12.3666 22.343 11.653 22.3433 11.0884 21.9952C9.01522 20.7163 6.69036 19.1444 4.82571 17.2091C2.76943 15.0747 1.2665 12.3147 1.25052 9.1954C1.22489 4.15182 6.71599 1.08501 11.0357 3.72079C11.3948 3.94 11.7178 4.19167 12.0034 4.44931C12.2903 4.19493 12.6135 3.94835 12.9663 3.73349ZM21.2505 9.19833C21.2132 5.34768 17.1374 2.95041 13.7466 5.01474C13.2877 5.29423 12.8783 5.65566 12.5533 6.00986C12.4111 6.16481 12.2098 6.25317 11.9995 6.25302C11.7893 6.25275 11.5887 6.16398 11.4468 6.00888C11.1145 5.64497 10.7124 5.28116 10.2534 5.00107C6.92294 2.96912 2.73094 5.33404 2.75052 9.18759C2.76393 11.8124 4.03037 14.2214 5.90579 16.1681C7.63496 17.9628 9.82739 19.4554 11.8755 20.7188C11.9561 20.7684 12.0588 20.7687 12.1392 20.7188C14.1668 19.4607 16.3738 17.9565 18.1148 16.1534C20.0067 14.1941 21.2754 11.7843 21.2505 9.19833Z" fill="currentColor"/>
  </svg>
);

// ── Shared primitives ────────────────────────────────────────────────────────

const ViewAllBtn: React.FC<{ label?: string }> = ({ label = 'View all' }) => (
  <button type="button" className="evo-viewall-btn">
    {label}
  </button>
);

const YellowCircleBtn: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="evo-yellow-circle-btn" style={{ width: size, height: size }}>
    <IconArrow />
  </div>
);

// ── Section 1 — Last-minute weekend deals ─────────────────────────────────────
interface HotelCardProps {
  name: string;
  location: string;
  price: string;
  oldPrice: string;
  nights: string;
  discount: string;
  rating: string;
  ratingGood?: boolean;
  imgSrc: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  name, location, price, oldPrice, nights, discount, rating, ratingGood, imgSrc,
}) => (
  <div className="evo-hotel-card bex-press" role="button" tabIndex={0}>
    <div className="evo-hotel-card__media">
      <img src={imgSrc} alt={name} draggable={false} className="evo-hotel-card__img"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div className={`evo-hotel-card__rating-badge${ratingGood ? '' : ' evo-hotel-card__rating-badge--neutral'}`}>
        {rating}
      </div>
      <button type="button" className="evo-hotel-card__save" aria-label={`Save ${name}`}>
        <IconHeart />
      </button>
    </div>
    <div className="evo-hotel-card__body">
      <div className="evo-hotel-card__info-top">
        <div className="evo-hotel-card__title-row">
          <div className="evo-hotel-card__titles">
            <span className="evo-hotel-card__name">{name}</span>
            <span className="evo-hotel-card__location">{location}</span>
          </div>
        </div>
      </div>
      <div className="evo-hotel-card__info-bottom">
        <div className="evo-hotel-card__pricing">
          <div className="evo-hotel-card__discount-badge">{discount}</div>
          <div className="evo-hotel-card__price-row">
            <s className="evo-hotel-card__old-price">{oldPrice}</s>
            <span className="evo-hotel-card__price">{price}</span>
          </div>
          <div className="evo-hotel-card__nights">{nights}</div>
        </div>
      </div>
    </div>
  </div>
);

// ── Section 2 — Limited-time deals (Merch cards) ──────────────────────────────
interface MerchCardProps {
  imgSrc: string;
  title: string;
  body: string;
  titleColor?: string;
  bodyColor?: string;
}

const MerchCard: React.FC<MerchCardProps> = ({
  imgSrc, title, body, titleColor = '#fddb32', bodyColor = '#ffffff',
}) => (
  <div className="evo-merch-card bex-press" role="button" tabIndex={0}>
    <img src={imgSrc} alt="" className="evo-merch-card__bg"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    <div className="evo-merch-card__scrim-bottom" />
    <div className="evo-merch-card__content">
      <p className="evo-merch-card__title" style={{ color: titleColor }}>{title}</p>
      <p className="evo-merch-card__body" style={{ color: bodyColor }}>{body}</p>
      <div className="evo-merch-card__footer">
        <span className="evo-merch-card__book-label">Book now</span>
        <div className="evo-merch-card__circle-btn">
          <IconArrow />
        </div>
      </div>
    </div>
  </div>
);

// ── Section 3 — Destination cards ────────────────────────────────────────────
interface DestCardProps {
  city: string;
  badge: string;
  desc: string;
  imgSrc: string;
}

const DestCard: React.FC<DestCardProps> = ({ city, badge, desc, imgSrc }) => (
  <div className="evo-dest-card bex-press" role="button" tabIndex={0}>
    <img src={imgSrc} alt={city} className="evo-dest-card__bg"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    {/* Top scrim */}
    <div className="evo-dest-card__scrim-top" />
    {/* Bottom scrim */}
    <div className="evo-dest-card__scrim-bottom" />
    <div className="evo-dest-card__content">
      <div className="evo-dest-card__top">
        <p className="evo-dest-card__city">{city}</p>
        <div className="evo-dest-card__badge">{badge}</div>
      </div>
      <div className="evo-dest-card__bottom">
        <p className="evo-dest-card__desc">{desc}</p>
        <YellowCircleBtn size={32} />
      </div>
    </div>
  </div>
);

// ── Section 4 — Vacation rentals (full-bleed dark) ────────────────────────────
interface CategoryCardProps {
  label: string;
  imgSrc: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ label, imgSrc }) => (
  <div className="evo-cat-card bex-press" role="button" tabIndex={0}>
    <img src={imgSrc} alt={label} className="evo-cat-card__img"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    <div className="evo-cat-card__scrim" />
    <p className="evo-cat-card__label">{label}</p>
  </div>
);

// ── Section 5 — RTB / Bundle & Save ───────────────────────────────────────────
interface RTBCardProps {
  title: string;
  subtitle: string;
}

const RTBCard: React.FC<RTBCardProps> = ({ title, subtitle }) => (
  <div className="evo-rtb2-card bex-press" role="button" tabIndex={0}>
    <div className="evo-rtb2-card__content">
      <p className="evo-rtb2-card__title">{title}</p>
      <p className="evo-rtb2-card__subtitle">{subtitle}</p>
    </div>
    <div className="evo-rtb2-card__art" />
    <button type="button" className="evo-rtb2-card__btn">Book now</button>
  </div>
);

// ── Section 6 — OneKey Merch card ─────────────────────────────────────────────
const OneKeyCard: React.FC = () => (
  <div className="evo-onekey2-card bex-press" role="button" tabIndex={0}>
    {/* OneKey wordmark — replicated as text since the logo mask needs an image URL */}
    <div className="evo-onekey2-card__logo">
      <span className="evo-onekey2-card__logo-text">one</span>
      <span className="evo-onekey2-card__logo-key">Key</span>
      <span className="evo-onekey2-card__logo-mark">™</span>
    </div>
    <p className="evo-onekey2-card__title">Earn an<br />extra $50</p>
    <p className="evo-onekey2-card__body">
      Book a flight to Panama,<br />and get $50 in OneKeyCash.
    </p>
    <button type="button" className="evo-onekey2-card__btn">Book now</button>
  </div>
);

// ── Main feed ─────────────────────────────────────────────────────────────────
export const EvoFeed: React.FC = () => (
  <div className="evo-feed">

    {/* ── The Halfway There Sale (full-bleed, bleeds under hero card corner) ── */}
    <section className="evo-section-bleed">
      <div className="evo-section-bleed__image-frame" aria-hidden="true">
        {/* Base image — slow Ken Burns drift */}
        <div className="hsb-bg" />
        {/* Water shadow band A — wide slow diagonal */}
        <div className="hsb-shadow-a" />
        {/* Water shadow band B — narrower, opposite diagonal */}
        <div className="hsb-shadow-b" />
        {/* Water shadow band C — fine surface ripples */}
        <div className="hsb-shadow-c" />
        {/* Caustic light highlights */}
        <div className="hsb-sheen" />
        <div className="evo-section-bleed__overlay" />
      </div>
      <div className="evo-section-bleed__content">
        <div className="evo-section-bleed__text">
          <p className="evo-section-bleed__headline">
            The Halfway<br />There Sale
          </p>
          <p className="evo-section-bleed__body">
            Save up to 40% on select<br />hotels with Member Prices.
          </p>
        </div>
        <button type="button" className="evo-section-bleed__btn">
          Explore deals
        </button>
      </div>
    </section>

    {/* ── Scrollable sections (gap:48, px:20) ─────────────────────────────── */}
    <div className="evo-feed__sections">

      {/* ── 1. Last-minute weekend deals ────────────────────────────────── */}
      <section className="evo-feed-section">
        <div className="evo-feed-section__head">
          <h2 className="evo-section-title">Last-minute weekend deals</h2>
          <p className="evo-section-sub">Showing deals for: May 17 – May 19</p>
        </div>
        <div className="evo-hscroll">
          <HotelCard
            name="Hotel Splendide Royal"
            location="Rome, Italy"
            price="$782"
            oldPrice="$1,058"
            nights="Deluxe Room for 4 nights"
            discount="$274 off"
            rating="9.6"
            ratingGood
            imgSrc={IMG_HOTEL}
          />
          <HotelCard
            name="Hotel Splendide Royal"
            location="Rome, Italy"
            price="$782"
            oldPrice="$1,058"
            nights="Deluxe Room for 4 nights"
            discount="$274 off"
            rating="8.2"
            imgSrc={IMG_HOTEL}
          />
        </div>
        <div className="evo-feed-section__footer">
          <ViewAllBtn />
        </div>
      </section>

      {/* ── 2. Limited-time deals (merch cards) ─────────────────────────── */}
      <section className="evo-feed-section">
        <div className="evo-feed-section__head">
          <h2 className="evo-section-title">Limited-time deals</h2>
        </div>
        <div className="evo-hscroll">
          <MerchCard
            imgSrc={IMG_MERCH_1}
            title="Earn an extra $50"
            body={'Book a flight to Panama,\nand get $50 in OneKeyCash.'}
            titleColor="#fddb32"
            bodyColor="#ffffff"
          />
          <MerchCard
            imgSrc={IMG_MERCH_2}
            title="Earn an extra $50"
            body={'Book a flight to Panama,\nand get $50 in OneKeyCash.'}
            titleColor="#191e3b"
            bodyColor="#191e3b"
          />
        </div>
        <div className="evo-feed-section__footer">
          <ViewAllBtn />
        </div>
      </section>

      {/* ── 3. Destination cards ────────────────────────────────────────── */}
      <section className="evo-feed-section">
        <div className="evo-feed-section__head">
          <h2 className="evo-section-title">Top destinations</h2>
        </div>
        <div className="evo-hscroll">
          <DestCard
            city="Tokyo"
            badge="Save up to 20%"
            desc="Quiet temples, neon nights, and food worth the trip."
            imgSrc={IMG_DEST}
          />
          <DestCard
            city="Maldives"
            badge="Save up to 20%"
            desc="Turquoise waters, quiet escapes, and sunsets worth staying for."
            imgSrc={IMG_DEST}
          />
          <DestCard
            city="Iceland"
            badge="Save up to 20%"
            desc="Waterfalls, black-sand coasts, and northern lights worth the cold."
            imgSrc={IMG_DEST}
          />
          <DestCard
            city="Phuket"
            badge="Save up to 20%"
            desc="White-sand beaches, turquoise seas, and sunsets worth the trip."
            imgSrc={IMG_DEST}
          />
        </div>
        <div className="evo-feed-section__footer">
          <ViewAllBtn />
        </div>
      </section>

    </div>{/* end evo-feed__sections */}

    {/* ── 4. Vacation rentals — full-bleed dark section ────────────────── */}
    <section className="evo-vacation-bleed">
      <p className="evo-vacation-bleed__title">
        Vacation rentals<br />for your kind of stay
      </p>
      <div className="evo-vacation-bleed__grid">
        <CategoryCard label="Vacation Homes"       imgSrc={IMG_CAT_HOME} />
        <CategoryCard label="Apartments & Condos"  imgSrc={IMG_CAT_CONDO} />
        <CategoryCard label="Cabins"               imgSrc={IMG_CAT_CABIN} />
        <CategoryCard label="Villas"               imgSrc={IMG_CAT_VILLA} />
      </div>
      <button type="button" className="evo-vacation-bleed__btn">
        Explore more deals
      </button>
    </section>

    {/* ── Scrollable sections part 2 ──────────────────────────────────── */}
    <div className="evo-feed__sections">

      {/* ── 5. Book with confidence — RTB cards ─────────────────────────── */}
      <section className="evo-feed-section">
        <div className="evo-feed-section__head">
          <h2 className="evo-section-title">Book with confidence<br />on Expedia</h2>
        </div>
        <div className="evo-hscroll">
          <RTBCard
            title="Bundle & Save"
            subtitle={'Save whether you book your trip\nall at once, or over time'}
          />
          <RTBCard
            title="Bundle & Save"
            subtitle={'Save whether you book your trip\nall at once, or over time'}
          />
        </div>
      </section>

      {/* ── 6. OneKey card ─────────────────────────────────────────────── */}
      <section className="evo-feed-section evo-feed-section--flush">
        <OneKeyCard />
      </section>

    </div>{/* end evo-feed__sections part 2 */}

    {/* Bottom clearance for the floating global nav */}
    <div style={{ height: 48 }} />

  </div>
);
