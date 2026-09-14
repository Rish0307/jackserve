import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Hotel, Car, Home, Film, Armchair,
  UtensilsCrossed, ParkingCircle, AlertCircle, Truck,
  Star, Waves, Ticket, Sparkles, Ship, Train, Bus,
  ChefHat, Mic2, Fish, MapPin, Send, CheckCircle2,
  X, Menu, Shield, DollarSign, Globe,
  Zap, ArrowRight
} from 'lucide-react';
import AnimatedText from './components/AnimatedText';
import FadeIn from './components/FadeIn';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const TELEGRAM_BOT_TOKEN = '8768120693:AAEzLR8wITx81KgHvgPkX-G4xQIEV1HcRf8';
const TELEGRAM_CHAT_ID   = '656476228';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const BRAND_LOGOS = [
  { name: 'JetBlue',           icon: Plane,    grad: 'from-sky-400 to-blue-700',      glow: '#0284c7' },
  { name: 'United Airlines',   icon: Plane,    grad: 'from-blue-500 to-indigo-800',   glow: '#1e40af' },
  { name: 'Southwest',         icon: Plane,    grad: 'from-amber-400 to-red-600',     glow: '#dc2626' },
  { name: 'American Airlines', icon: Plane,    grad: 'from-cyan-400 to-blue-600',     glow: '#0284c7' },
  { name: 'Airbnb',            icon: Home,     grad: 'from-rose-400 to-pink-600',     glow: '#e11d48' },
  { name: 'IKEA',              icon: Armchair, grad: 'from-yellow-400 to-blue-600',   glow: '#2563eb' },
  { name: 'Viator',            icon: MapPin,   grad: 'from-emerald-400 to-teal-700',  glow: '#059669' },
  { name: 'Booking.com',       icon: Hotel,    grad: 'from-blue-400 to-indigo-800',   glow: '#1d4ed8' },
  { name: 'Georgia Aquarium',  icon: Fish,     grad: 'from-cyan-400 to-teal-600',     glow: '#0891b2' },
  { name: 'Expedia',           icon: Globe,    grad: 'from-yellow-300 to-amber-600',  glow: '#d97706' },
  { name: 'Delta Airlines',    icon: Plane,    grad: 'from-red-500 to-blue-900',      glow: '#b91c1c' },
  { name: 'Uber',              icon: Car,      grad: 'from-zinc-400 to-slate-900',    glow: '#334155' },
];

// 12 completely distinct 3D diorama travel & booking scenes — zero repeats
const ROW1 = [
  '/travel_cruise.jpg',
  '/travel_hotel.jpg',
  '/travel_airbnb.jpg',
  '/travel_flight.jpg',
  '/travel_themepark.jpg',
  '/travel_cinema.jpg',
];

const ROW2 = [
  '/travel_car.jpg',
  '/travel_concert.jpg',
  '/travel_dining.jpg',
  '/travel_spa.jpg',
  '/travel_aquarium.jpg',
  '/travel_train.jpg',
];


const SERVICES_GRID = [
  { icon: Plane,          label: 'Air Travel',       category: 'Flights & Jets',    grad: 'from-sky-400 to-blue-600',       glow: '#0284c7', iconColor: '#0284c7' },
  { icon: Hotel,          label: 'Hotels & Resorts', category: 'Luxury Stays',      grad: 'from-amber-400 to-orange-600',   glow: '#d97706', iconColor: '#ea580c' },
  { icon: Home,           label: 'Airbnb Stays',     category: 'Villas & Homes',    grad: 'from-rose-400 to-pink-600',      glow: '#e11d48', iconColor: '#e11d48' },
  { icon: Car,            label: 'Car Rentals',      category: 'Exotic & Daily',    grad: 'from-emerald-400 to-teal-600',   glow: '#059669', iconColor: '#059669' },
  { icon: Ship,           label: 'Cruises',          category: 'Ocean & River',     grad: 'from-cyan-400 to-blue-600',      glow: '#0891b2', iconColor: '#0284c7' },
  { icon: Train,          label: 'Train Trips',      category: 'Rail Passes',       grad: 'from-indigo-400 to-purple-600',  glow: '#4f46e5', iconColor: '#6366f1' },
  { icon: Mic2,           label: 'Live Concerts',    category: 'VIP & Festivals',   grad: 'from-fuchsia-400 to-purple-600', glow: '#c026d3', iconColor: '#c026d3' },
  { icon: Film,           label: 'Movie Nights',     category: 'Premiere Cinema',   grad: 'from-blue-400 to-indigo-700',    glow: '#2563eb', iconColor: '#3b82f6' },
  { icon: Star,           label: 'Theme Parks',      category: 'Disney & Universal',grad: 'from-yellow-400 to-amber-600',   glow: '#ca8a04', iconColor: '#d97706' },
  { icon: Waves,          label: 'Water Parks',      category: 'Attractions',       grad: 'from-teal-400 to-cyan-600',      glow: '#0d9488', iconColor: '#06b6d4' },
  { icon: Fish,           label: 'Aquariums & Zoos', category: 'Passes & Tours',    grad: 'from-sky-400 to-teal-600',       glow: '#0284c7', iconColor: '#0ea5e9' },
  { icon: MapPin,         label: 'City Tours',       category: 'Guided Travel',     grad: 'from-lime-400 to-emerald-600',   glow: '#65a30d', iconColor: '#16a34a' },
  { icon: UtensilsCrossed,label: 'Fine Dining',      category: 'Table & Bills',     grad: 'from-orange-400 to-red-600',     glow: '#ea580c', iconColor: '#ea580c' },
  { icon: ChefHat,        label: 'Restaurant Bills', category: 'Direct Savings',    grad: 'from-red-400 to-rose-600',       glow: '#dc2626', iconColor: '#e11d48' },
  { icon: Sparkles,       label: 'Salons & Spas',    category: 'Wellness Care',     grad: 'from-pink-400 to-fuchsia-600',   glow: '#db2777', iconColor: '#d946ef' },
  { icon: Armchair,       label: 'IKEA Orders',      category: 'Home & Living',     grad: 'from-amber-400 to-blue-600',     glow: '#d97706', iconColor: '#2563eb' },
  { icon: Ticket,         label: 'Adv. Passes',      category: 'Events & Expos',    grad: 'from-purple-400 to-indigo-600',  glow: '#9333ea', iconColor: '#8b5cf6' },
  { icon: ParkingCircle,  label: 'Airport Parking',  category: 'Valet & Lots',      grad: 'from-slate-300 to-zinc-600',     glow: '#64748b', iconColor: '#475569' },
  { icon: Bus,            label: 'Bus Tickets',      category: 'Intercity Transit', grad: 'from-amber-400 to-orange-600',   glow: '#d97706', iconColor: '#ea580c' },
  { icon: Truck,          label: 'Truck Services',   category: 'Hauling & Freight', grad: 'from-cyan-400 to-blue-600',      glow: '#0891b2', iconColor: '#0284c7' },
  { icon: AlertCircle,    label: 'Traffic Fines',    category: 'Instant Clearance', grad: 'from-yellow-400 to-red-600',     glow: '#eab308', iconColor: '#ef4444' },
  { icon: Globe,          label: 'Online Orders',    category: 'Global Shopping',   grad: 'from-sky-400 to-indigo-600',     glow: '#0284c7', iconColor: '#3b82f6' },
];


const SERVICES_LIST = [
  { num: '01', name: 'Air Travel',         desc: 'All major US airline bookings at unbeatable prices — JetBlue, United, Southwest, American and more. Confirmation in hours.' },
  { num: '02', name: 'Accommodations',     desc: 'Hotels, Airbnb stays, and short-term rentals worldwide. Best rates, any dates, any location — we handle it all.' },
  { num: '03', name: 'Events & Concerts',  desc: 'Live events, festivals, concerts, and movie nights. Premium tickets at 60% off retail — DM before they sell out.' },
  { num: '04', name: 'Dining & Lifestyle', desc: 'Restaurant bills, salon & spa bookings, theme parks, water attractions, and adventure passes — all covered.' },
  { num: '05', name: 'Bills & Payments',   desc: 'Traffic fines, mobile bills, rent payments, bus tickets, and challan payments processed fast and securely.' },
];



const SERVICE_OPTIONS = [
  'Air Travel / Flight Reservation',
  'Hotel / Accommodation',
  'Airbnb Booking',
  'Car Rental',
  'Live Event / Concert / Festival',
  'Movie Night',
  'IKEA / Furniture Order',
  'Dining / Restaurant Bill',
  'Parking Space',
  'Traffic Fine Payment',
  'Truck Service',
  'Theme Park Ticket',
  'Water Attraction / Adventure Pass',
  'Salon & Spa',
  'Cruise Adventure',
  'Train Journey',
  'Bus Ticket',
  'Viator Tour',
  'Georgia Aquarium Ticket',
  'Bill Payment (Rent / Mobile / Challan)',
  'Online Custom Order',
  'Other',
];

// ─── CONTACT BUTTON (Solid White Pill) ────────────────────────────────────────

const ContactButton: React.FC<{ onClick?: () => void; className?: string; label?: string }> = ({ onClick, className = '', label = 'Contact Me' }) => (
  <button
    id="contact-btn"
    onClick={onClick}
    className={`rounded-full font-bold uppercase tracking-wider sm:tracking-[0.15em] cursor-pointer
      px-5 py-2.5 sm:px-9 sm:py-3.5
      text-xs sm:text-sm whitespace-nowrap
      transition-all duration-300 hover:scale-[1.04] hover:bg-[#eaeaea] active:scale-100 ${className}`}
    style={{
      background: '#ffffff',
      color: '#0C0C0C',
      border: 'none',
      boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
      fontFamily: "'Kanit', sans-serif",
    }}
  >
    {label}
  </button>
);

// ─── BRAND TICKER ─────────────────────────────────────────────────────────────

const BrandTicker: React.FC = () => {
  const doubled = [...BRAND_LOGOS, ...BRAND_LOGOS];
  return (
    <div
      className="py-6 overflow-hidden"
      style={{
        background:   'rgba(255,255,255,0.02)',
        borderTop:    '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="brand-ticker-track gap-3.5">
        {doubled.map((b, i) => (
          <div
            key={`${b.name}-${i}`}
            className="flex-shrink-0 flex items-center gap-3.5 px-4 py-2.5 rounded-2xl mx-1.5 transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border:     '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Miniature 3D Glossy Squircle */}
            <div
              className="relative w-8 h-8 rounded-[11px] flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 55%, #dbe4ee 100%)',
                boxShadow: '0 4px 10px -1px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
              }}
            >
              <div
                className={`relative w-5 h-5 rounded-[7px] bg-gradient-to-tr ${b.grad} flex items-center justify-center text-white`}
                style={{
                  boxShadow: `0 2px 6px -1px ${b.glow}aa, inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.3)`,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[45%] rounded-t-[7px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 100%)',
                  }}
                />
                <b.icon size={11} strokeWidth={2.4} className="relative z-10 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
              </div>
            </div>
            <span className="font-semibold text-[#D7E2EA] text-xs sm:text-sm whitespace-nowrap tracking-tight">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── HERO SECTION — travel-focused, CSS-animated (no framer opacity traps) ────

const HeroSection: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <section
      id="home"
      className="relative h-screen flex flex-col"
      style={{ overflowX: 'clip', background: '#0C0C0C' }}
    >
      {/* Full-screen travel background — diorama tilt-shift style */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Slow infinite Ken Burns pan on the bg */}
        <img
          src="/travel_hotel.jpg"
          alt=""
          style={{
            position: 'absolute', width: '115%', height: '115%',
            top: '-7.5%', left: '-7.5%',
            objectFit: 'cover',
            opacity: 0.55,
            animation: 'diorama-pan-right 18s ease-in-out infinite alternate',
            willChange: 'transform',
          }}
        />
        {/* Tilt-shift blur — top band */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          maskImage: 'linear-gradient(180deg, black 0%, transparent 30%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 30%)',
        }} />
        {/* Tilt-shift blur — bottom band */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          maskImage: 'linear-gradient(0deg, black 0%, transparent 30%)',
          WebkitMaskImage: 'linear-gradient(0deg, black 0%, transparent 30%)',
        }} />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0.15) 50%, rgba(12,12,12,0.82) 100%)'
        }} />
      </div>

      {/* Nav space — filled by fixed navbar above */}
      <div className="h-[64px] md:h-[72px]" />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 inset-x-4 z-50 rounded-2xl p-5"
            style={{ background: '#1a1a1a', border: '1px solid rgba(215,226,234,0.1)' }}>
            {[['Services', 'services'], ['Deals', 'deals'], ['Reviews', 'reviews'], ['Contact', 'contact']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="block w-full text-left py-3 text-[#D7E2EA] font-medium border-b border-white/5 last:border-0 bg-transparent cursor-pointer">
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Heading ── */}
      <div className="px-4 sm:px-6 md:px-8 relative z-10 mt-4 md:mt-2"
        style={{ animation: 'heroFadeUp 0.8s 0.15s both ease-out' }}>
        <h1 className="font-black uppercase tracking-tight leading-[0.9] w-full hero-heading"
          style={{ fontSize: 'clamp(2.8rem, 13vw, 13rem)' }}>
          Jack&apos;s Booking
        </h1>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 md:pb-10 px-6 md:px-10 mt-auto"
        style={{ animation: 'heroFadeUp 0.8s 0.35s both ease-out' }}>
        <div className="flex flex-col gap-2.5 max-w-[280px] sm:max-w-[340px] md:max-w-[420px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit bg-white/[0.06] border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-emerald-300 uppercase">
              VIP Booking
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase">
              Flat 60% Off
            </span>
          </div>
          <p className="text-[#D7E2EA]/90 font-light text-xs sm:text-sm md:text-base leading-relaxed tracking-tight">
            Curated travel &amp; lifestyle bookings across the USA — premium flights, luxury stays, airbnbs &amp; VIP events.
          </p>
        </div>
        <div className="flex flex-row items-center gap-2.5 sm:gap-4 flex-nowrap">
          <button
            onClick={() => scrollTo('services')}
            className="rounded-full font-bold uppercase tracking-wider sm:tracking-[0.15em] cursor-pointer
              px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm whitespace-nowrap
              transition-all duration-300 hover:scale-[1.04] hover:bg-white/10 active:scale-100"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#D7E2EA',
              border: '1px solid rgba(215, 226, 234, 0.25)',
              backdropFilter: 'blur(10px)',
              fontFamily: "'Kanit', sans-serif",
            }}
          >
            Explore Services
          </button>
          <ContactButton onClick={() => scrollTo('contact')} />
        </div>
      </div>
    </section>
  );
};

// ─── DIORAMA CARD — tilt-shift + infinite loop animation ─────────────────────

const DIORAMA_ANIMS = [
  'diorama-pan-right',
  'diorama-pan-left',
  'diorama-zoom-in',
  'diorama-pan-up',
  'diorama-zoom-out',
  'diorama-pan-right-slow',
  'diorama-pan-left-slow',
  'diorama-zoom-in',
  'diorama-pan-up',
  'diorama-zoom-out',
];

const DioramaCard: React.FC<{ src: string; animIndex: number }> = ({ src, animIndex }) => {
  const anim = DIORAMA_ANIMS[animIndex % DIORAMA_ANIMS.length];
  const duration = 6 + (animIndex % 4) * 2; // 6–12s per card, staggered

  return (
    <div
      className="relative flex-shrink-0 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden w-[180px] h-[120px] sm:w-[300px] sm:h-[195px] md:w-[420px] md:h-[270px]"
      style={{
        boxShadow: '0 6px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4)',
      }}
    >
      {/* The image — animates in an infinite slow loop */}
      <img
        src={src} alt="" loading="lazy"
        style={{
          width: '110%', height: '110%',       // slightly oversized so pan has room
          objectFit: 'cover',
          position: 'absolute', top: '-5%', left: '-5%',
          animation: `${anim} ${duration}s ease-in-out infinite alternate`,
          willChange: 'transform',
        }}
      />

      {/* ── Tilt-shift blur — top band ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(12,12,12,0.01) 0%, transparent 28%)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        maskImage: 'linear-gradient(180deg, black 0%, transparent 35%)',
        WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 35%)',
      }} />

      {/* ── Tilt-shift blur — bottom band ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        maskImage: 'linear-gradient(0deg, black 0%, transparent 35%)',
        WebkitMaskImage: 'linear-gradient(0deg, black 0%, transparent 35%)',
      }} />

      {/* ── Vignette + colour grade for miniature warmth ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
        mixBlendMode: 'multiply',
      }} />
    </div>
  );
};

// ─── MARQUEE SECTION (Scroll-driven) ──────────────────────────────────────────

const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.35;
      setOffset(scrollOffset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tripledRow1 = [...ROW1, ...ROW1, ...ROW1];
  const tripledRow2 = [...ROW2, ...ROW2, ...ROW2];

  return (
    <section
      ref={sectionRef}
      style={{ background: '#0C0C0C', overflow: 'hidden' }}
      className="pt-14 sm:pt-20 pb-8 sm:pb-12"
    >
      {/* Section heading */}
      <div className="text-center px-5 mb-8 sm:mb-12">
        <p className="text-[#D7E2EA]/30 text-xs uppercase tracking-[0.3em] mb-2 sm:mb-3">What we book for you</p>
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 9rem)' }}>
          Every Experience
        </h2>
      </div>

      {/* Row 1 — moves right on scroll */}
      <div className="overflow-hidden mb-3 sm:mb-4">
        <div
          className="flex gap-2.5 sm:gap-4"
          style={{ transform: `translateX(${offset - 250}px)`, willChange: 'transform' }}
        >
          {tripledRow1.map((src, i) => (
            <DioramaCard key={`r1-${i}`} src={src} animIndex={i} />
          ))}
        </div>
      </div>

      {/* Row 2 — moves left on scroll */}
      <div className="overflow-hidden">
        <div
          className="flex gap-2.5 sm:gap-4"
          style={{ transform: `translateX(${-(offset - 250)}px)`, willChange: 'transform' }}
        >
          {tripledRow2.map((src, i) => (
            <DioramaCard key={`r2-${i}`} src={src} animIndex={i + 5} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── ABOUT / INTRO SECTION (original layout, booking-focused content) ─────────

const ABOUT_TEXT =
  "With partnerships across every major US platform, i specialise in scoring the best prices on flights, hotels, airbnb, events, and more — up to 60% off retail. I genuinely love saving people money and making booking effortless. Let's get you the best deal possible!";

const AboutSection: React.FC = () => (
  <section
    id="about"
    className="relative flex items-center justify-center
      bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
      -mt-10 sm:-mt-12 md:-mt-14 z-10
      px-5 sm:px-8 md:px-10 pt-16 pb-6 sm:pt-24 sm:pb-10"
    style={{ overflow: 'hidden' }}
  >
    {/* Corner decorations */}
    <FadeIn delay={0.1} x={-80} y={0} duration={0.9}
      className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0 pointer-events-none">
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
        alt="" className="w-[120px] sm:w-[160px] md:w-[210px] h-auto" loading="lazy" />
    </FadeIn>
    <FadeIn delay={0.25} x={-80} y={0} duration={0.9}
      className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0 pointer-events-none">
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
        alt="" className="w-[100px] sm:w-[140px] md:w-[180px] h-auto" loading="lazy" />
    </FadeIn>
    <FadeIn delay={0.15} x={80} y={0} duration={0.9}
      className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0 pointer-events-none">
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
        alt="" className="w-[120px] sm:w-[160px] md:w-[210px] h-auto" loading="lazy" />
    </FadeIn>
    <FadeIn delay={0.3} x={80} y={0} duration={0.9}
      className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0 pointer-events-none">
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
        alt="" className="w-[130px] sm:w-[170px] md:w-[220px] h-auto" loading="lazy" />
    </FadeIn>

    {/* Centre content */}
    <div className="relative z-10 flex flex-col items-center text-center gap-10 sm:gap-14 md:gap-16">
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          About Us
        </h2>
      </FadeIn>

      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <AnimatedText
          text={ABOUT_TEXT}
          className="font-medium leading-relaxed max-w-[560px]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' } as React.CSSProperties}
        />
        <FadeIn delay={0.2} y={20}>
          <ContactButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} />
        </FadeIn>

        {/* Feature callouts inside About Us */}
        <FadeIn delay={0.3} className="w-full max-w-5xl mt-6 sm:mt-10">
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 text-left">
            {[
              { icon: Zap,         title: 'Instant Booking',          desc: 'Confirmation in hours, not days.',            grad: 'from-amber-400 to-yellow-600',  glow: '#f59e0b' },
              { icon: Shield,      title: '100% Verified',            desc: 'Every deal is real and sureshot.',            grad: 'from-emerald-400 to-teal-600',   glow: '#10b981' },
              { icon: DollarSign,  title: 'Best Price Guaranteed',    desc: 'Up to 60% off retail. Always.',              grad: 'from-fuchsia-400 to-purple-600', glow: '#c084fc' },
            ].map(({ icon: Icon, title, desc, grad, glow }) => (
              <div
                key={title}
                className="group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(215, 226, 234, 0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* 3D Ceramic Squircle Icon */}
                <div
                  className="relative w-12 h-12 rounded-[16px] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 55%, #dbe4ee 100%)',
                    boxShadow: '0 8px 18px -2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <div
                    className={`relative w-8 h-8 rounded-[10px] bg-gradient-to-tr ${grad} flex items-center justify-center text-white`}
                    style={{
                      boxShadow: `0 3px 8px -1px ${glow}aa, inset 0 1px 1px rgba(255,255,255,0.7)`,
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[45%] rounded-t-[10px] pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 100%)',
                      }}
                    />
                    <Icon size={16} strokeWidth={2.4} className="relative z-10 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#D7E2EA] text-base mb-1.5 group-hover:text-white transition-colors">{title}</h3>
                  <p className="text-[#D7E2EA]/50 font-light text-xs sm:text-sm leading-relaxed">{desc}</p>
                </div>

                {/* Subtle hover gradient glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at top left, ${glow}18 0%, transparent 65%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ─── SERVICES LIST SECTION (white, rounded top — original Services design) ────

const ServicesListSection: React.FC = () => (
  <section
    id="services"
    className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
      -mt-8 sm:-mt-10 md:-mt-12 relative z-20
      px-5 sm:px-8 md:px-10 pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24"
  >
    <FadeIn delay={0} y={30}>
      <h2
        className="font-black uppercase text-center text-[#0C0C0C] mb-8 sm:mb-12 md:mb-16"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Services
      </h2>
    </FadeIn>

    <div className="max-w-5xl mx-auto">
      {SERVICES_LIST.map((svc, i) => (
        <FadeIn key={svc.num} delay={i * 0.1} y={30}>
          <div
            className="flex flex-row items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
            style={{
              borderTop:    i === 0 ? '1px solid rgba(12,12,12,0.15)' : undefined,
              borderBottom: '1px solid rgba(12,12,12,0.15)',
            }}
          >
            <span
              className="font-black text-[#0C0C0C] leading-none flex-shrink-0 select-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {svc.num}
            </span>
            <div className="flex flex-col justify-center gap-2 pt-2 md:pt-4">
              <span
                className="font-medium uppercase text-[#0C0C0C] leading-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {svc.name}
              </span>
              <p
                className="font-light leading-relaxed max-w-2xl text-[#0C0C0C]"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
              >
                {svc.desc}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ─── 3D GLOSSY APP ICON (Exact style matching Reference 2) ───────────────────

const Glossy3DAppIcon: React.FC<{
  icon: React.ComponentType<{ size: number; className?: string; strokeWidth?: number }>;
  grad: string;
  glow: string;
}> = ({ icon: Icon, grad, glow }) => (
  <div
    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[18px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
    style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 55%, #dbe4ee 100%)',
      boxShadow: '0 10px 22px -3px rgba(0,0,0,0.6), 0 3px 6px -1px rgba(0,0,0,0.35), inset 0 2px 2px rgba(255,255,255,1), inset 0 -2px 3px rgba(0,0,0,0.08)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
    }}
  >
    {/* 3D Reflection glow on ceramic base */}
    <div
      className="absolute w-8 h-8 rounded-xl blur-[6px] opacity-70 pointer-events-none"
      style={{ background: glow }}
    />

    {/* 3D Dimensional Glass Icon */}
    <div
      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr ${grad} flex items-center justify-center text-white`}
      style={{
        boxShadow: `0 5px 12px -1px ${glow}aa, inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Top glass refraction highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[46%] rounded-t-xl pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      />
      <Icon size={17} strokeWidth={2.2} className="relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
    </div>
  </div>
);

// ─── DEALS SECTION — 3D Glass App Icon Grid, Brand Ticker, Airlines ──────────

const DealsSection: React.FC = () => (
  <section
    id="deals"
    className="bg-[#0C0C0C] z-10 relative px-5 sm:px-8 md:px-10 pt-14 sm:pt-20 md:pt-24 pb-8 sm:pb-12"
  >
    <div className="max-w-7xl mx-auto">
      {/* Heading */}
      <FadeIn className="text-center mb-14 sm:mb-20">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          All Deals
        </h2>
        <div className="flex justify-center mt-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#D7E2EA]/80 uppercase">
              Verified Direct Deals
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-400 uppercase">
              Flat 60% Off
            </span>
          </div>
        </div>
      </FadeIn>

      {/* 3D Glass App Icon Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
        {SERVICES_GRID.map(({ icon, label, category, grad, glow }, i) => (
          <FadeIn key={label} delay={i * 0.025}>
            <div
              className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(215, 226, 234, 0.08)',
                backdropFilter: 'blur(12px)',
                minHeight: '145px',
              }}
            >
              {/* Top row: 3D Glossy Squircle Icon + Discount Badge */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <Glossy3DAppIcon icon={icon} grad={grad} glow={glow} />
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#D7E2EA',
                    border: '1px solid rgba(215, 226, 234, 0.15)',
                  }}
                >
                  60% OFF
                </span>
              </div>

              {/* Bottom text */}
              <div>
                <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-[#D7E2EA]/40 mb-1">
                  {category}
                </p>
                <h4 className="text-[#D7E2EA] group-hover:text-white font-medium text-sm sm:text-base tracking-tight transition-colors">
                  {label}
                </h4>
              </div>

              {/* Subtle hover glow matching icon hue */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at top left, ${glow}15 0%, transparent 65%)`,
                }}
              />
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Brand ticker */}
      <FadeIn className="mb-16 sm:mb-20">
        <p className="text-center text-[#D7E2EA]/30 text-xs uppercase tracking-[0.3em] mb-6">
          Trusted platforms &amp; partners
        </p>
        <BrandTicker />
      </FadeIn>

      {/* ── Aesthetic 3D Airlines & Concierge Section ── */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
        {/* Left Column: Supported Airlines */}
        <FadeIn>
          <div
            className="rounded-[32px] p-6 sm:p-8 h-full flex flex-col justify-between"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(215, 226, 234, 0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-[#D7E2EA] font-black uppercase tracking-tight text-xl sm:text-2xl">
                    Supported Airlines
                  </h3>
                  <p className="text-xs text-[#D7E2EA]/40 font-light mt-1">Direct confirmation on all major US carriers</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                  60% OFF
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { name: 'JetBlue Airways',    code: 'B6', grad: 'from-sky-400 to-blue-700',    glow: '#0284c7', route: 'Domestic & Caribbean Hubs' },
                  { name: 'United Airlines',    code: 'UA', grad: 'from-blue-500 to-indigo-800', glow: '#1e40af', route: 'Transcontinental & Global' },
                  { name: 'Southwest Airlines', code: 'WN', grad: 'from-amber-400 to-red-600',   glow: '#dc2626', route: 'Direct Nationwide Routes' },
                  { name: 'American Airlines',  code: 'AA', grad: 'from-cyan-400 to-blue-600',   glow: '#0284c7', route: 'All Major US Airports' },
                ].map((airline) => (
                  <div
                    key={airline.name}
                    className="group flex items-center justify-between gap-4 p-3 sm:p-3.5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* 3D Ceramic Squircle for Airline */}
                      <div
                        className="relative w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 55%, #dbe4ee 100%)',
                          boxShadow: '0 6px 14px -2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        <div
                          className={`relative w-7 h-7 rounded-[9px] bg-gradient-to-tr ${airline.grad} flex items-center justify-center text-white font-black text-xs`}
                          style={{
                            boxShadow: `0 3px 8px -1px ${airline.glow}aa, inset 0 1px 1px rgba(255,255,255,0.7)`,
                          }}
                        >
                          <Plane size={13} strokeWidth={2.4} className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-[#D7E2EA] group-hover:text-white transition-colors">
                          {airline.name}
                        </p>
                        <p className="text-[11px] text-[#D7E2EA]/40 font-light">{airline.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/[0.06] text-[#D7E2EA]/70 border border-white/10">
                        {airline.code}
                      </span>
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Featured Concierge Services */}
        <FadeIn delay={0.1}>
          <div
            className="rounded-[32px] p-6 sm:p-8 h-full flex flex-col justify-between"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(215, 226, 234, 0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-[#D7E2EA] font-black uppercase tracking-tight text-xl sm:text-2xl">
                    Popular US Bookings
                  </h3>
                  <p className="text-xs text-[#D7E2EA]/40 font-light mt-1">Direct checkout &amp; fast reservation handling</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Instant VIP</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Plane,    name: 'Flight Reservations',      category: 'Instant E-Tickets', grad: 'from-sky-400 to-blue-600',      glow: '#0284c7' },
                  { icon: Home,     name: 'Airbnb Luxury Stays',      category: 'Villas & Homes',    grad: 'from-rose-400 to-pink-600',     glow: '#e11d48' },
                  { icon: Armchair, name: 'IKEA Orders & Pickup',     category: 'Home & Living',     grad: 'from-yellow-400 to-blue-600',   glow: '#2563eb' },
                  { icon: Globe,    name: 'Online Store Purchases',   category: 'Global Checkout',   grad: 'from-sky-400 to-indigo-600',    glow: '#0284c7' },
                  { icon: MapPin,   name: 'Viator Tours & Activities',category: 'City Experiences',  grad: 'from-emerald-400 to-teal-700',  glow: '#059669' },
                  { icon: Fish,     name: 'Georgia Aquarium Tickets', category: 'Family VIP Passes', grad: 'from-cyan-400 to-teal-600',     glow: '#0891b2' },
                  { icon: Bus,      name: 'Bus Ticket Bookings',      category: 'Transit Routes',    grad: 'from-amber-400 to-orange-600',  glow: '#d97706' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      {/* 3D Ceramic Squircle */}
                      <div
                        className="relative w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 55%, #dbe4ee 100%)',
                          boxShadow: '0 4px 10px -1px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,1)',
                          border: '1px solid rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        <div
                          className={`relative w-6 h-6 rounded-[8px] bg-gradient-to-tr ${item.grad} flex items-center justify-center text-white`}
                          style={{
                            boxShadow: `0 2px 6px -1px ${item.glow}aa, inset 0 1px 1px rgba(255,255,255,0.7)`,
                          }}
                        >
                          <item.icon size={12} strokeWidth={2.4} className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-xs sm:text-sm text-[#D7E2EA] group-hover:text-white transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#D7E2EA]/40 font-light">{item.category}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      60% OFF
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ─── TESTIMONIALS (Aesthetic Verified Client Proof) ───────────────────────────

const TestimonialsSection: React.FC = () => (
  <section
    id="reviews"
    className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-2 pb-4 sm:pt-4 sm:pb-6 relative z-10"
  >
    <div className="max-w-6xl mx-auto">
      <FadeIn className="text-center mb-8 sm:mb-12">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)' }}
        >
          Client Proof
        </h2>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {[
          {
            name: 'Diane Carter',
            role: 'Family Vacation · New York, NY',
            handle: '@diane_c',
            img: '/testimonial_1.jpg',
            booking: 'Roundtrip JetBlue + Miami Airbnb',
            saved: 'Saved $840 (60% Off)',
            quote: 'Booked flights for my family of 4 plus a 5-night villa in South Beach. Everything was confirmed in under 3 hours with official confirmation codes. The savings were 100% genuine.',
            icon: Plane,
            grad: 'from-sky-400 to-blue-600',
            glow: '#0284c7',
          },
          {
            name: 'Marcus Rivera',
            role: 'Corporate Travel · Miami, FL',
            handle: '@m_rivera_biz',
            img: '/testimonial_2.jpg',
            booking: 'United Airlines First Class + 4-Star Hotel',
            saved: 'Saved $620 (60% Off)',
            quote: 'Needed last-minute business class seats to Chicago. Jack got my tickets and hotel sorted directly on WhatsApp with zero hassle. Been using him for all work travel ever since.',
            icon: Hotel,
            grad: 'from-amber-400 to-orange-600',
            glow: '#ea580c',
          },
          {
            name: 'Priya Nguyen',
            role: 'Event Director · Atlanta, GA',
            handle: '@priya_events',
            img: '/testimonial_3.jpg',
            booking: 'Georgia Aquarium Group VIP + Viator Tour',
            saved: 'Saved $490 (60% Off)',
            quote: 'Secured 12 VIP aquarium admissions and city tours for our company retreat. Direct digital passes arrived right on time without a hitch. Seamless communication throughout.',
            icon: Fish,
            grad: 'from-cyan-400 to-teal-600',
            glow: '#0891b2',
          },
        ].map((item, i) => (
          <FadeIn key={item.name} delay={i * 0.1}>
            <div
              className="group relative rounded-[32px] p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(215, 226, 234, 0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div>
                {/* Header: 3D Squircle Icon + Real Savings Badge */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div
                    className="relative w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 55%, #dbe4ee 100%)',
                      boxShadow: '0 6px 14px -2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,1)',
                      border: '1px solid rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div
                      className={`relative w-7 h-7 rounded-[9px] bg-gradient-to-tr ${item.grad} flex items-center justify-center text-white`}
                      style={{
                        boxShadow: `0 3px 8px -1px ${item.glow}aa, inset 0 1px 1px rgba(255,255,255,0.7)`,
                      }}
                    >
                      <item.icon size={13} strokeWidth={2.4} className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {item.saved}
                  </span>
                </div>

                {/* Booking summary pill */}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D7E2EA]/50 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                  {item.booking}
                </p>

                {/* Quote text */}
                <p className="text-[#D7E2EA]/80 font-light leading-relaxed text-xs sm:text-sm">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Verified Client Profile */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-[#D7E2EA] truncate">{item.name}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  </div>
                  <p className="text-[11px] text-[#D7E2EA]/40 font-light truncate">{item.role}</p>
                </div>
              </div>

              {/* Subtle hover gradient */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at top right, ${item.glow}12 0%, transparent 65%)`,
                }}
              />
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Trust badges — Clean 2x2 grid on mobile, 4-col row on desktop */}
      <FadeIn delay={0.2} className="mt-10 sm:mt-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {[
            { label: 'Instant Ticket Issuance', icon: Zap },
            { label: 'Official PNR Confirmation', icon: CheckCircle2 },
            { label: '24/7 Live Support', icon: Shield },
            { label: 'Guaranteed 60% Savings', icon: DollarSign },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-2.5 p-3 sm:px-3.5 sm:py-3 rounded-2xl text-center sm:text-left bg-white/[0.03] border border-white/[0.08] backdrop-blur-md transition-colors hover:bg-white/[0.05]"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-emerald-400" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#D7E2EA]/90 leading-none sm:whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

// ─── CONTACT / BOOKING FORM ───────────────────────────────────────────────────

interface FormData { name: string; phone: string; email: string; service: string; travelDates: string; message: string; }
const initForm: FormData = { name: '', phone: '', email: '', service: '', travelDates: '', message: '' };
type Status = 'idle' | 'loading' | 'success' | 'error';

const ContactSection: React.FC = () => {
  const [form, setForm]     = useState<FormData>(initForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading'); setErrMsg('');
    const text = `
🔔 *New Booking Request — Jack's Booking Services*

👤 *Name:* ${form.name}
📱 *WhatsApp / Phone:* ${form.phone}
📧 *Email:* ${form.email}
🛎️ *Service:* ${form.service}
📅 *Travel Dates:* ${form.travelDates || 'Not specified'}
💬 *Message:* ${form.message || 'None'}

_via jackserve.vercel.app_
    `.trim();

    try {
      const url = new URL(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`);
      url.searchParams.set('chat_id', TELEGRAM_CHAT_ID);
      url.searchParams.set('text', text);
      url.searchParams.set('parse_mode', 'Markdown');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`${res.status}`);
      setStatus('success'); setForm(initForm);
    } catch {
      setStatus('error'); setErrMsg("Something went wrong. DM us directly on Telegram!");
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-4 pb-20 sm:pt-8 sm:pb-28"
    >
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-8 sm:mb-12">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 110px)' }}
          >
            Book Now
          </h2>
          <p className="text-[#D7E2EA]/50 font-light text-xs sm:text-sm uppercase tracking-widest">
            Direct reservation checkout · Instant confirmation
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="rounded-[40px] p-12 text-center"
              style={{ background: 'rgba(182,0,168,0.08)', border: '1px solid rgba(182,0,168,0.25)' }}
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(182,0,168,0.15)', border: '2px solid rgba(182,0,168,0.3)' }}>
                <CheckCircle2 size={40} style={{ color: '#B600A8' }} />
              </div>
              <h3 className="font-black text-[#D7E2EA] text-2xl mb-3">Request Sent! 🎉</h3>
              <p className="text-[#D7E2EA]/60 font-light text-sm">
                Your booking request landed in our Telegram.<br />
                Expect a reply within minutes!
              </p>
              <button onClick={() => setStatus('idle')}
                className="mt-6 text-[#B600A8] text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1 mx-auto bg-transparent border-0 cursor-pointer">
                <ArrowRight size={14} /> Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit}
              className="flex flex-col gap-5 rounded-[40px] p-6 sm:p-10"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(215,226,234,0.08)' }}
            >
              {[
                { id: 'f-name',  name: 'name',  label: 'Full Name *',             type: 'text',  placeholder: 'Your name',              req: true },
                { id: 'f-phone', name: 'phone', label: 'WhatsApp / Phone *',       type: 'tel',   placeholder: '+1 (555) 000-0000',       req: true },
                { id: 'f-email', name: 'email', label: 'Email *',                  type: 'email', placeholder: 'you@email.com',           req: true },
                { id: 'f-dates', name: 'travelDates', label: 'Travel Dates (optional)', type: 'text', placeholder: 'e.g. Aug 25 – Sep 2, 2026', req: false },
              ].map(({ id, name, label, type, placeholder, req }) => (
                <div key={id}>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/40 mb-2">{label}</label>
                  <input id={id} type={type} name={name} required={req}
                    value={form[name as keyof FormData]} onChange={onChange}
                    placeholder={placeholder} className="form-input" />
                </div>
              ))}

              {/* Service select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/40 mb-2">Service Type *</label>
                <select id="f-service" name="service" required value={form.service} onChange={onChange}
                  className="form-input cursor-pointer" style={{ background: '#131313' }}>
                  <option value="" disabled style={{ background: '#131313' }}>Select a service...</option>
                  {SERVICE_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#131313' }}>{o}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/40 mb-2">Details (optional)</label>
                <textarea id="f-message" name="message" rows={4} value={form.message} onChange={onChange}
                  placeholder="Destination, number of people, special requests..."
                  className="form-input resize-none" />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <X size={15} className="flex-shrink-0" />{errMsg}
                </div>
              )}

              <button
                id="f-submit"
                type="submit"
                disabled={status === 'loading'}
                className="group relative flex items-center justify-center gap-3 rounded-full font-black uppercase tracking-wider py-4 sm:py-4.5 mt-3 w-full text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer overflow-hidden"
                style={{
                  background: 'linear-gradient(150deg, #1c1c20 0%, #121215 55%, #0a0a0c 100%)',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 12px 30px -4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.22), inset 0 -1px 2px rgba(0,0,0,0.8)',
                  fontFamily: 'Kanit, sans-serif',
                }}
              >
                {/* 3D Top Specular Gloss Highlight */}
                <div
                  className="absolute inset-x-0 top-0 h-[48%] rounded-t-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.01) 100%)',
                  }}
                />

                {status === 'loading' ? (
                  <div className="relative z-10 flex items-center gap-2 text-white">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Booking Request...</span>
                  </div>
                ) : (
                  <div className="relative z-10 flex items-center gap-2.5">
                    <Send size={17} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <span className="text-[#F8FAFC] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Send Booking Request 🚀</span>
                  </div>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-xs text-[#D7E2EA]/40 font-light mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Instant confirmation sent directly to your Telegram / WhatsApp</span>
              </div>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const Footer: React.FC = () => (
  <footer
    className="py-10 px-5 text-center"
    style={{ borderTop: '1px solid rgba(215,226,234,0.08)', background: '#0C0C0C' }}
  >
    <p className="hero-heading font-black text-2xl sm:text-3xl uppercase tracking-tight mb-2">
      Jack's Booking
    </p>
    <p className="text-[#D7E2EA]/25 text-xs font-light uppercase tracking-widest">
      © 2026 Jack's Booking Services · 🇺🇸 USA Premium · All Deals 60% OFF · SURESHOT 💯
    </p>
  </footer>
);

// ─── FIXED NAVBAR ─────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-[100] flex justify-between items-center px-6 md:px-10 py-4 md:py-5"
        style={{
          background: scrolled
            ? 'rgba(12,12,12,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(215,226,234,0.08)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease',
          animation: 'heroFadeDown 0.6s 0s both ease-out',
        }}
      >
        {/* Desktop */}
        <div className="hidden md:flex justify-between w-full items-center">
          <span className="font-black text-white tracking-tight text-xl cursor-pointer"
            onClick={() => scrollTo('home')}>
            Jack&apos;s <span style={{ color: '#c084fc' }}>Booking</span>
          </span>
          {/* Desktop Nav Pills with stroke & light glass background */}
          <div className="flex items-center gap-2 lg:gap-3 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            {[['Services', 'services'], ['Deals', 'deals'], ['Reviews', 'reviews']].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs lg:text-sm px-4 lg:px-5 py-2 rounded-full transition-all duration-300 hover:text-white hover:bg-white/[0.08] border border-white/10 hover:border-white/25 cursor-pointer bg-white/[0.02]"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="text-[#0C0C0C] bg-white font-bold uppercase tracking-wider text-xs lg:text-sm px-5 lg:px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:bg-[#e8e8e8] shadow-[0_2px_12px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
        {/* Mobile */}
        <div className="flex md:hidden justify-between w-full items-center gap-2">
          <span className="text-white font-black text-base sm:text-lg cursor-pointer flex-shrink-0" onClick={() => scrollTo('home')}>
            Jack&apos;s <span style={{ color: '#c084fc' }}>Booking</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo('services')}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#D7E2EA] bg-white/[0.06] border border-white/15 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#0C0C0C] bg-white hover:bg-[#e8e8e8] transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1.5 ml-0.5 bg-transparent border-0 cursor-pointer flex items-center justify-center">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-[60px] inset-x-4 z-[99] rounded-2xl p-5 md:hidden"
            style={{ background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(215,226,234,0.1)' }}>
            {[['Services', 'services'], ['Deals', 'deals'], ['Reviews', 'reviews'], ['Contact', 'contact']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="block w-full text-left py-3 text-[#D7E2EA] font-medium border-b border-white/5 last:border-0 bg-transparent cursor-pointer">
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <>
    <Navbar />
    <main style={{ overflowX: 'clip', background: '#0C0C0C', fontFamily: "'Kanit', sans-serif" }}>
      <HeroSection />
      <MarqueeSection />
      <DealsSection />
      <ServicesListSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  </>
);

export default App;
