import React, { useEffect, useMemo, useState, useRef } from 'react';
import { PUPPIES, FILTERS } from './puppies.js';
import { COMMUNITY_IMAGES, SHELTER_IMAGES, TESTIMONIAL_IMAGES, FAQS, HERO_VIDEO, DAY_VIDEOS, TESTIMONIAL_VIDEOS, PET_IMAGES } from './content.js';
import { PuppyCard } from './components/puppy.jsx';
import PuppyDetail from './components/puppy-detail.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { MutedVideo } from './components/ui.jsx';

const ACCURATE_FAQS = FAQS.map((item, index) => {
  if (index === FAQS.length - 1) {
    return item;
  }

  const optionAFAQS = [
    {
      question: "How do I apply for shelter or housing assistance?",
      answer: "You can apply online through our intake form, call our hotline directly, or visit our nursery office during business hours. A team member will conduct a brief assessment to determine eligibility and puppy availability."
    },
    {
      question: "Who is eligible to stay at the shelter?",
      answer: "Our shelter services individuals and families experiencing housing insecurity, domestic crisis, or sudden displacement. Specific program criteria depend on the placement type available."
    },
    {
      question: "What items am I allowed to bring with me?",
      answer: "Residents may bring essential personal belongings, including clothing, hygiene items, necessary medical prescriptions, and personal identification. Large furniture, hazardous materials, and weapons are strictly prohibited."
    },
    {
      question: "Is there a cost to stay at the facility?",
      answer: "No. All temporary emergency shelter services, basic meals, and supportive intake programs are provided free of charge."
    }
  ];

  return optionAFAQS[index] || item;
});

const AnimationStyles = () => (
  <style>{`
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes floatReverse {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(8px); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.08); }
    }
    .animate-float-slow {
      animation: floatSlow 5s ease-in-out infinite;
    }
    .animate-float-reverse {
      animation: floatReverse 6s ease-in-out infinite;
    }
    .animate-pulse-glow {
      animation: pulseGlow 7s ease-in-out infinite;
    }
  `}</style>
);

function Title({ eyebrow, title, body }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#E8DAF0] bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#6C428E] shadow-sm transition-transform duration-300 hover:scale-105 sm:px-4 sm:py-2 sm:text-xs">
        <span className="text-[#D99F38]">✦</span>{eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-[#2D1B3E] sm:mt-5 sm:text-5xl lg:text-6xl">{title}</h2>
      {body && <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#584168] sm:mt-5 sm:text-lg sm:leading-8">{body}</p>}
      <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-16 rounded-full bg-[#D99F38] transition-all duration-500 hover:w-24 sm:mt-6" />
    </div>
  );
}

function Header({ page, navigate, browse }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSanctuaryOpen, setMobileSanctuaryOpen] = useState(false);
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const sanctuaryLinks = [
    ['shelter', 'Our Shelter'],
    ['vaccinations', 'Vaccinations'],
    ['certificates', 'Certificates & Licenses'],
    ['shipping', 'Shipping & Delivery']
  ];

  const guideLinks = [
    ['adoption', 'Adoption Guide'],
    ['stories', 'Stories & Reviews'],
    ['faq', 'FAQs'],
    ['contact', 'Contact Us']
  ];

  const handleNavClick = (route) => {
    setMenuOpen(false);
    setOpenDropdown(null);
    navigate(route);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EEE4F4] bg-white/95 shadow-sm shadow-[#2D1B3E]/5 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="group flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <b className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#2D1B3E] text-base text-[#D99F38] shadow-md shadow-[#2D1B3E]/15 sm:h-11 sm:w-11 sm:text-xl">♥</b>
          <span className="truncate">
            <b className="block truncate text-sm font-black text-[#2D1B3E] sm:text-xl">Dazy’s Paw Haven</b>
            <small className="block truncate text-[8px] font-extrabold uppercase tracking-[.15em] text-[#8668A1] sm:text-xs">Licensed Shelter &amp; Nursery</small>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden items-center gap-1 xl:flex">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            className={`rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
              page === 'home'
                ? 'bg-[#F2EAFA] text-[#6C428E] shadow-sm'
                : 'text-[#483458] hover:bg-[#FDFBFE] hover:text-[#6C428E]'
            }`}
          >
            Home
          </a>

          <a
            href="#puppies"
            onClick={(e) => { e.preventDefault(); handleNavClick('puppies'); }}
            className={`rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
              page === 'puppies'
                ? 'bg-[#F2EAFA] text-[#6C428E] shadow-sm'
                : 'text-[#483458] hover:bg-[#FDFBFE] hover:text-[#6C428E]'
            }`}
          >
            Puppies
          </a>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sanctuary' ? null : 'sanctuary')}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                ['shelter', 'vaccinations', 'certificates', 'shipping'].includes(page)
                  ? 'bg-[#F2EAFA] text-[#6C428E] shadow-sm'
                  : 'text-[#483458] hover:bg-[#FDFBFE] hover:text-[#6C428E]'
              }`}
            >
              Sanctuary &amp; Care
              <span className={`transition-transform duration-200 text-[10px] ${openDropdown === 'sanctuary' ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {openDropdown === 'sanctuary' && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-[#EEE4F4] bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                {sanctuaryLinks.map(([route, label]) => (
                  <a
                    key={route}
                    href={`#${route}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(route); }}
                    className={`block rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      page === route ? 'bg-[#F2EAFA] text-[#6C428E]' : 'text-[#483458] hover:bg-[#F8F2FC] hover:text-[#6C428E]'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'guides' ? null : 'guides')}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                ['adoption', 'stories', 'faq', 'contact'].includes(page)
                  ? 'bg-[#F2EAFA] text-[#6C428E] shadow-sm'
                  : 'text-[#483458] hover:bg-[#FDFBFE] hover:text-[#6C428E]'
              }`}
            >
              Guides &amp; Community
              <span className={`transition-transform duration-200 text-[10px] ${openDropdown === 'guides' ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {openDropdown === 'guides' && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-[#EEE4F4] bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                {guideLinks.map(([route, label]) => (
                  <a
                    key={route}
                    href={`#${route}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(route); }}
                    className={`block rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      page === route ? 'bg-[#F2EAFA] text-[#6C428E]' : 'text-[#483458] hover:bg-[#F8F2FC] hover:text-[#6C428E]'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleNavClick('donate')}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#D99F38] px-3.5 py-2 text-xs font-extrabold transition-all sm:px-4 sm:py-2.5 ${
              page === 'donate'
                ? 'bg-[#D99F38] text-white shadow-md'
                : 'bg-[#FFF8EB] text-[#2D1B3E] hover:bg-[#D99F38] hover:text-white'
            }`}
          >
            <span>♥</span> Donate
          </button>

          <button
            onClick={() => { setMenuOpen(false); browse(); }}
            className="hidden sm:inline-flex rounded-2xl bg-[#2D1B3E] px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#452B5E] active:scale-95 sm:px-5 sm:py-3 sm:text-sm"
          >
            Meet Puppies
          </button>

          {/* Hamburger Menu Icon always firmly visible on mobile */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8DAF0] text-xl text-[#2D1B3E] xl:hidden transition-all duration-200 hover:bg-[#F2EAFA] active:scale-90"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <>
          <div 
            onClick={() => setMenuOpen(false)}
            aria-hidden="true" 
            className="fixed inset-0 top-20 z-40 bg-[#180A24]/40 backdrop-blur-sm xl:hidden transition-opacity" 
          />
          <nav className="absolute inset-x-0 top-full z-50 max-h-[85vh] overflow-y-auto border-b border-[#EEE4F4] bg-white p-5 shadow-2xl xl:hidden animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="space-y-1.5">
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className={`block rounded-xl px-4 py-3 text-sm font-extrabold uppercase ${
                  page === 'home' ? 'bg-[#F2EAFA] text-[#6C428E]' : 'text-[#2D1B3E] hover:bg-[#F8F2FC]'
                }`}
              >
                Home
              </a>

              <a
                href="#puppies"
                onClick={(e) => { e.preventDefault(); handleNavClick('puppies'); }}
                className={`block rounded-xl px-4 py-3 text-sm font-extrabold uppercase ${
                  page === 'puppies' ? 'bg-[#F2EAFA] text-[#6C428E]' : 'text-[#2D1B3E] hover:bg-[#F8F2FC]'
                }`}
              >
                Puppies
              </a>

              <a
                href="#donate"
                onClick={(e) => { e.preventDefault(); handleNavClick('donate'); }}
                className={`block rounded-xl px-4 py-3 text-sm font-extrabold uppercase ${
                  page === 'donate' ? 'bg-[#FFF8EB] text-[#D99F38]' : 'text-[#2D1B3E] hover:bg-[#F8F2FC]'
                }`}
              >
                ♥ Donate to Shelter
              </a>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMobileSanctuaryOpen(!mobileSanctuaryOpen)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-extrabold uppercase text-[#2D1B3E] hover:bg-[#F8F2FC]"
                >
                  <span>Sanctuary &amp; Care</span>
                  <span className={`text-xs transition-transform duration-200 ${mobileSanctuaryOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {mobileSanctuaryOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#E8DAF0] pl-3">
                    {sanctuaryLinks.map(([route, label]) => (
                      <a
                        key={route}
                        href={`#${route}`}
                        onClick={(e) => { e.preventDefault(); handleNavClick(route); }}
                        className={`block rounded-lg px-3 py-2 text-xs font-bold ${
                          page === route ? 'bg-[#F2EAFA] text-[#6C428E]' : 'text-[#483458] hover:bg-[#F8F2FC]'
                        }`}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMobileGuidesOpen(!mobileGuidesOpen)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-extrabold uppercase text-[#2D1B3E] hover:bg-[#F8F2FC]"
                >
                  <span>Guides &amp; Community</span>
                  <span className={`text-xs transition-transform duration-200 ${mobileGuidesOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {mobileGuidesOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#E8DAF0] pl-3">
                    {guideLinks.map(([route, label]) => (
                      <a
                        key={route}
                        href={`#${route}`}
                        onClick={(e) => { e.preventDefault(); handleNavClick(route); }}
                        className={`block rounded-lg px-3 py-2 text-xs font-bold ${
                          page === route ? 'bg-[#F2EAFA] text-[#6C428E]' : 'text-[#483458] hover:bg-[#F8F2FC]'
                        }`}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

function Hero({ browse, navigate }) {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-gradient-to-b from-[#FDFBFE] via-[#F8F2FC] to-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#EBD8F7]/60 blur-3xl animate-pulse-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-[20%] -z-10 h-[28rem] w-[28rem] rounded-full bg-[#F5EAD6]/60 blur-3xl animate-pulse-glow" />
      
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative z-10 text-center lg:text-left">
          <div className="animate-float-slow inline-flex items-center gap-2 rounded-full border border-[#E8DAF0] bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#6C428E] shadow-sm backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
            <span className="text-[#D99F38]">✦</span> 15+ Years USDA Licensed Small-Breed Sanctuary
          </div>
          <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight text-[#2D1B3E] sm:mt-7 sm:text-6xl sm:leading-[1.02] lg:text-[4.5rem]">
            A softer landing.<br />
            <span className="text-[#8668A1]">A brighter beginning.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#584168] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
            At Dazy&#39;s Paw Haven, every pup receives world-class veterinary care, early neurological stimulation, and unconditional love. Our adoption gallery features purebred, home-raised Yorkshire Terriers &amp; Shih Tzus ready for nationwide air nanny delivery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 lg:justify-start">
            <button
              onClick={browse}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#2D1B3E] px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#2D1B3E]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#452B5E] hover:shadow-2xl active:scale-95"
            >
              Meet Available Puppies <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
            <button
              onClick={() => navigate('certificates')}
              className="rounded-2xl border border-[#D8C4E6] bg-white px-7 py-4 text-sm font-extrabold text-[#2D1B3E] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#F8F2FC] hover:shadow-md active:scale-95"
            >
              Licenses &amp; Credentials
            </button>
            <button
              onClick={() => navigate('donate')}
              className="inline-flex sm:hidden items-center justify-center gap-2 rounded-2xl border-2 border-[#D99F38] bg-[#FFF8EB] px-7 py-4 text-sm font-extrabold text-[#2D1B3E] transition-all duration-300 hover:bg-[#D99F38] hover:text-white active:scale-95 shadow-sm"
            >
              <span>♥</span> Donate to Shelter
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-extrabold uppercase tracking-wider text-[#6C428E] sm:mt-10 sm:gap-6 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 transition-transform duration-300 hover:scale-105"><span className="text-[#D99F38]">✓</span> 10-Year Health Warranty</span>
            <span className="inline-flex items-center gap-1.5 transition-transform duration-300 hover:scale-105"><span className="text-[#D99F38]">✓</span> In-Cabin Flight Nanny</span>
            <span className="inline-flex items-center gap-1.5 transition-transform duration-300 hover:scale-105"><span className="text-[#D99F38]">✓</span> Microchip &amp; AKC Verified</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div aria-hidden="true" className="absolute -inset-2 sm:-inset-3 rotate-2 rounded-[2.5rem] bg-[#EBD8F7] transition-transform duration-500 hover:rotate-1" />
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.25rem] bg-[#E8DAF0] shadow-2xl shadow-[#2D1B3E]/20 ring-4 ring-white group">
            <MutedVideo src={HERO_VIDEO} poster={SHELTER_IMAGES[0]} className="aspect-[4/4.2] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-[5/4.3]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0B27]/85 via-[#1A0B27]/30 to-transparent px-5 pb-6 pt-16 text-white sm:px-8 sm:pb-7 sm:pt-20">
              <span className="text-[10px] font-extrabold uppercase tracking-[.25em] text-[#EBCB8B] sm:text-xs">Safe &amp; Loved Sanctuary</span>
              <p className="mt-1.5 text-xl font-black sm:mt-2 sm:text-3xl">Every puppy is raised in our home with family warmth.</p>
            </div>
          </div>
          <div className="animate-float-reverse relative sm:absolute -bottom-4 sm:-bottom-5 left-0 sm:-left-6 mt-4 sm:mt-0 flex max-w-full sm:max-w-[18rem] items-center gap-3.5 rounded-2xl border border-[#EEE4F4] bg-white/95 p-3.5 shadow-2xl backdrop-blur-md sm:p-4 transition-transform duration-300 hover:scale-105">
            <img src={SHELTER_IMAGES[1]} alt="Shelter puppy" loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-xl object-cover sm:h-14 sm:w-14" />
            <span>
              <b className="block text-xs font-black text-[#2D1B3E] sm:text-sm">100% Health Guarantee</b>
              <span className="mt-0.5 block text-[11px] leading-4 text-[#8668A1] sm:text-xs sm:leading-5">Complete vet checkup &amp; microchip before travel.</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DonatePage() {
  const whatsappNumber = "18005847297";

  const openWhatsApp = (amountStr, titleStr) => {
    const text = encodeURIComponent(`Hello Dazy's Paw Haven! I would like to make a donation of ${amountStr} for: ${titleStr}. Please send me the payment details.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const tiers = [
    {
      title: "Puppy Starter Pack",
      amount: "$25",
      desc: "Provides high-grade puppy nutrition, vitamins, and teething toys for a rescued puppy.",
      badge: "Popular"
    },
    {
      title: "Vaccination & Microchip",
      amount: "$75",
      desc: "Covers complete 5-in-1 DHPP core vaccines, deworming, and ISO microchip registration.",
      badge: "Essential"
    },
    {
      title: "Comprehensive Vet Care",
      amount: "$150",
      desc: "Funds a thorough veterinary checkup, health certificate (CVI), and parasite protection.",
      badge: "Impactful"
    },
    {
      title: "Emergency Shelter Rescue Fund",
      amount: "$300+",
      desc: "Directly sponsors urgent medical treatments, specialized care, or transport for severe rescue cases.",
      badge: "Hero Level"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#FDFBFE] via-white to-[#F8F2FC] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title
          eyebrow="Support Our Shelter"
          title="Help Us Give Every Puppy A Loving Start"
          body="Your generous contribution supports medical treatment, high-quality food, vaccinations, and safe housing for our rescued toy breeds."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-[2rem] border border-[#E8DAF0] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#6C428E] hover:shadow-2xl"
            >
              <div>
                <span className="inline-block rounded-full bg-[#F2EAFA] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#6C428E]">
                  {t.badge}
                </span>
                <h3 className="mt-4 text-xl font-black text-[#2D1B3E]">{t.title}</h3>
                <div className="mt-2 text-3xl font-black text-[#D99F38]">{t.amount}</div>
                <p className="mt-3 text-xs leading-relaxed text-[#584168]">{t.desc}</p>
              </div>

              <button
                onClick={() => openWhatsApp(t.amount, t.title)}
                className="mt-6 w-full rounded-2xl bg-[#25D366] py-3 text-xs font-black text-white shadow-md transition-all hover:bg-[#1EBE5B] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>💬</span>Donate
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2.25rem] bg-gradient-to-r from-[#2D1B3E] via-[#452B5E] to-[#2D1B3E] p-8 text-white shadow-2xl sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-[#EBCB8B]/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#EBCB8B]">
              Direct Assistance
            </span>
            <h3 className="mt-4 text-3xl font-black text-white sm:text-4xl">Have a Custom Amount in Mind?</h3>
            <p className="mt-3 text-sm text-purple-100/90 leading-relaxed sm:text-base">
              Connect directly with our administration team to set up custom donations, recurring monthly sponsorships, or physical item contributions.
            </p>

            <button
              onClick={() => openWhatsApp("Custom Amount", "General Shelter Sponsorship")}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-8 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-[#1EBE5B] hover:scale-105 active:scale-95 shadow-xl"
            >
              <span>💬</span> Live Chat on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificatesPage({ navigate }) {
  const certs = [
    {
      title: "USDA Interstate Health Certificate (CVI)",
      issuedBy: "United States Department of Agriculture",
      details: "Official Certificate of Veterinary Inspection required for all interstate and air travel, confirming negative infectious disease checks within 10 days of travel.",
      code: "Form USDA-APHIS 7001"
    },
    {
      title: "10-Year Genetic Health Guarantee Contract",
      issuedBy: "Dazy’s Paw Haven Legal & Medical Board",
      details: "Comprehensive written health warranty covering hereditary or congenital life-altering conditions for up to 10 years post-adoption.",
      code: "Contract Ref #DPH-W889"
    },
    {
      title: "AKC Purebred Lineage Certificate",
      issuedBy: "American Kennel Club",
      details: "Official purebred lineage registration verifying 3+ generations of purebred Yorkshire Terrier or Shih Tzu ancestry.",
      code: "AKC Class A Registration"
    },
    {
      title: "ISO 15-Digit Microchip & Registry Transfer",
      issuedBy: "Avid Pet Microchip Systems",
      details: "International ISO 11784/11785 compliant microchip pre-implanted prior to rehoming with free lifetime owner transfer.",
      code: "ISO Standard 11784/85"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#FDFBFE] via-white to-[#F8F2FC] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Authenticity & Compliance" title="Official Licensing & Certificates" body="Complete transparency is our pledge. Review the regulatory certifications and health documentation included with every adopted puppy." />

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2">
          {certs.map((c, i) => (
            <div key={i} className="group rounded-[1.75rem] sm:rounded-[2rem] border border-[#E8DAF0] bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#6C428E] hover:shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#F2EAFA] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#6C428E] sm:px-3.5 sm:text-xs">{c.code}</span>
                <span className="text-sm font-bold text-[#D99F38] sm:text-xl">🛡 Verified</span>
              </div>
              <h3 className="mt-4 text-xl font-black text-[#2D1B3E] sm:mt-5 sm:text-2xl">{c.title}</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8668A1] sm:text-xs">{c.issuedBy}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#584168] sm:mt-4 sm:text-sm">{c.details}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] sm:rounded-[2rem] bg-[#2D1B3E] p-6 text-white shadow-2xl sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[.25em] text-[#EBCB8B]">Ethical Shelter Operations</span>
            <h3 className="mt-3 text-2xl font-black text-white sm:text-4xl">Zero Puppy-Mill Guarantee</h3>
            <p className="mt-3 text-sm text-purple-100/90 leading-relaxed sm:mt-4 sm:text-base">
              Dazy’s Paw Haven is fully licensed under USDA Class A Facility License #47-A-8921. We operate under strict humane standards, zero cage confinement, and complete veterinary oversight.
            </p>
            <button
              onClick={() => navigate('puppies')}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#EBCB8B] px-6 py-3.5 text-xs font-black text-[#180A24] transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 sm:mt-8 sm:px-8 sm:py-4 sm:text-sm"
            >
              Browse Certified Puppies →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Puppies({ filter, setFilter, onOpen, puppies = PUPPIES, limit = null, navigate = null }) {
  const filteredList = useMemo(() => filter === 'All Puppies' ? puppies : puppies.filter(p => `${p.breedType}s` === filter), [filter, puppies]);
  const list = limit ? filteredList.slice(0, limit) : filteredList;
  const amount = f => f === 'All Puppies' ? puppies.length : puppies.filter(p => `${p.breedType}s` === f).length;

  return (
    <section id="available" className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#FCF9FE] to-[#F8F2FC] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Available Puppies" title="Yorkies & Shih Tzus Ready For Adoption" body="Click any puppy to view their full photo album, birth records, weight chart, vaccination passport, and parent lineage." />
        
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-sm ${
                filter === f ? 'bg-[#2D1B3E] text-white shadow-lg scale-105' : 'bg-white text-[#2D1B3E] ring-1 ring-[#E8DAF0] hover:bg-[#F2EAFA]'
              }`}
            >
              {f} <span className="ml-1 opacity-70">({amount(f)})</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {list.map(p => (
            <div key={p.id} className="transition-all duration-300 hover:-translate-y-2">
              <PuppyCard puppy={p} onOpen={onOpen} />
            </div>
          ))}
        </div>

        {limit && navigate && (
          <div className="mt-10 text-center sm:mt-14">
            <button
              onClick={() => navigate('puppies')}
              className="group inline-flex items-center gap-3 rounded-2xl bg-[#2D1B3E] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-[#2D1B3E]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#452B5E] hover:shadow-2xl active:scale-95 sm:px-8 sm:py-4"
            >
              See More Available Puppies ({puppies.length})
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Shelter() {
  return (
    <section id="shelter" className="relative isolate overflow-hidden bg-gradient-to-br from-[#231233] via-[#2D1B3E] to-[#422659] py-14 text-white sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-10">
          <div>
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#EBCB8B] sm:px-4 sm:py-2 sm:text-xs">15+ Years Trust</span>
            <h2 className="mt-4 text-3xl font-black text-white sm:mt-5 sm:text-4xl lg:text-5xl">A sanctuary built on love &amp; medical excellence.</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-purple-100/90 sm:mt-5 sm:text-lg">
              Dazy&#39;s Paw Haven provides a safe haven, medical care, and family environment for every puppy. We specialize in toy-breed excellence, ensuring every Yorkie and Shih Tzu leaves fully vaccinated, microchipped, and socialized.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-purple-200/80 sm:mt-4 sm:text-base">
              Our puppies are home-raised with Early Neurological Stimulation (ENS) and Puppy Culture protocols for optimal temperament and health.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {SHELTER_IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Shelter community dog ${i + 1}`}
                loading="lazy"
                decoding="async"
                className={`w-full rounded-2xl sm:rounded-[1.5rem] object-cover ring-2 ring-white/20 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:ring-[#EBCB8B] ${i === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {[
            { tag: 'Vaccine Standards', title: '5-in-1 DHPP & Parasite Control', desc: 'Complete age-appropriate core vaccines, preventative deworming every 2 weeks, and flea/tick protection.' },
            { tag: 'Flight Nanny Travel', title: 'In-Cabin Hand Delivery', desc: 'We deliver puppies in-cabin with a professional flight nanny to all 50 US states, Canada, and international airports.' },
            { tag: '10-Year Guarantee', title: 'Genetic Health Warranty', desc: 'Every puppy includes an official written contract with a 10-year genetic health guarantee and lifetime support.' }
          ].map((card, idx) => (
            <article key={idx} className="rounded-2xl sm:rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.12] hover:shadow-2xl">
              <span className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#EBCB8B] sm:text-xs">{card.tag}</span>
              <h3 className="mt-2.5 text-lg font-black text-white sm:mt-3 sm:text-xl">{card.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-purple-100/80 sm:text-sm">{card.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VaccinationsPage({ navigate }) {
  const protocol = [
    { age: '6 - 8 Weeks', title: 'First Core 5-in-1 Vaccine (DHPP)', desc: 'Protects against Canine Distemper, Infectious Hepatitis, Parvovirus, and Parainfluenza.' },
    { age: '10 - 12 Weeks', title: 'Second Core Booster + Bordetella', desc: 'Secondary booster for strong antibody production plus kennel cough immunization.' },
    { age: '14 - 16 Weeks', title: 'Third Core Booster + Rabies', desc: 'Final puppy booster round and state-certified Rabies vaccination with official tag.' },
    { age: 'Bi-Weekly', title: 'Multi-Stage Parasite Control', desc: 'Dewormed at 2, 4, 6, and 8 weeks using Pyrantel Pamoate and Panacur.' }
  ];

  return (
    <section className="bg-gradient-to-b from-[#FDFBFE] via-white to-[#F8F2FC] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Medical Care Protocols" title="Vaccination & Health Standards" body="Our puppies receive rigorous medical protocols supervised by licensed veterinarians prior to entering your home." />
        
        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-2">
          <div className="rounded-[1.75rem] sm:rounded-[2rem] border border-[#E8DAF0] bg-white p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-black text-[#2D1B3E] sm:text-2xl">Vaccination Timeline</h3>
            <p className="mt-2 text-xs text-[#584168] sm:text-sm">Every adopted puppy comes with an official signed Health Passport detailing all administered vaccines with serial lot numbers.</p>
            <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              {protocol.map((item, idx) => (
                <div key={idx} className="group flex gap-3 sm:gap-4 border-l-2 border-[#D99F38] pl-4 sm:pl-5 transition-all duration-300 hover:border-[#2D1B3E]">
                  <div>
                    <span className="rounded-full bg-[#F2EAFA] px-2.5 py-0.5 text-[11px] font-black text-[#6C428E] transition-colors duration-300 group-hover:bg-[#2D1B3E] group-hover:text-white sm:px-3 sm:py-1 sm:text-xs">{item.age}</span>
                    <h4 className="mt-1.5 text-base font-bold text-[#2D1B3E] sm:mt-2 sm:text-lg">{item.title}</h4>
                    <p className="mt-1 text-xs text-[#584168] sm:text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[1.75rem] sm:rounded-[2rem] bg-[#2D1B3E] p-6 text-white shadow-2xl transition-all duration-300 hover:scale-[1.01] sm:p-8">
            <div>
              <span className="rounded-full bg-[#D99F38]/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#EBCB8B] sm:px-3.5 sm:text-xs">Medical Package Included</span>
              <h3 className="mt-3 text-2xl font-black text-white sm:mt-4 sm:text-3xl">What comes with your puppy:</h3>
              <ul className="mt-5 space-y-3 text-xs sm:text-sm text-purple-100/90 sm:mt-6 sm:space-y-4">
                {['Official Veterinary Health Certificate (CVI)', 'ISO 15-Digit Microchip with free lifetime registration', 'Complete Vaccination Passport & Deworming Log', '10-Year Genetic Health Warranty Contract', 'Stool Examination Check (Negative for parasites/giardia)', 'Starter Food Kit & Vitamin Supplement Packet'].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1 sm:gap-3">
                    <span className="text-[#EBCB8B] shrink-0">✓</span> <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-xl bg-white/10 p-4 sm:p-5 text-xs text-purple-200 sm:mt-8">
              <strong className="block text-xs sm:text-sm font-bold text-white">AAHA &amp; WSAVA Compliant</strong>
              We adhere strictly to the American Animal Hospital Association guidelines for small breed canine immunization.
            </div>
          </div>
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <button onClick={() => navigate('puppies')} className="rounded-2xl bg-[#2D1B3E] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#452B5E] hover:shadow-xl active:scale-95 sm:px-8 sm:py-4">
            Browse Available Vaccinated Puppies →
          </button>
        </div>
      </div>
    </section>
  );
}

function ShippingPage({ navigate }) {
  const steps = [
    { num: '01', title: 'Flight Nanny Booking', desc: 'We coordinate an in-cabin pet nanny who holds your puppy on their lap throughout the flight.' },
    { num: '02', title: 'Pre-Flight Health Exam', desc: 'Our vet performs a final departure exam and issues a USDA Interstate Health Certificate.' },
    { num: '03', title: 'Live Flight Updates', desc: 'You receive real-time photo and video updates at airport departure, layovers, and arrival.' },
    { num: '04', title: 'Airport Hand-Off', desc: 'Meet your flight nanny directly at your local airport terminal baggage claim for hand delivery.' }
  ];

  return (
    <section className="bg-gradient-to-b from-white via-[#FCF9FE] to-[#F8F2FC] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Nationwide & International" title="In-Cabin Pet Flight Nanny Delivery" body="We never ship puppies in cargo. Every puppy travels safely inside the airplane cabin with a dedicated nanny." />

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {steps.map((s) => (
            <div key={s.num} className="rounded-[1.5rem] sm:rounded-[1.75rem] border border-[#E8DAF0] bg-white p-6 sm:p-7 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#6C428E] hover:shadow-xl">
              <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-[#F2EAFA] text-base sm:text-lg font-black text-[#6C428E] transition-transform duration-300 hover:scale-110">{s.num}</span>
              <h3 className="mt-4 text-lg sm:text-xl font-black text-[#2D1B3E] sm:mt-5">{s.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#584168]">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] sm:rounded-[2rem] bg-[#2D1B3E] p-6 text-white shadow-xl sm:mt-12 sm:p-12 transition-all duration-300 hover:shadow-2xl">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#EBCB8B] sm:text-xs">Delivery Coverage</span>
              <h3 className="mt-1.5 text-2xl font-black text-white sm:mt-2 sm:text-3xl">Where do we deliver?</h3>
              <p className="mt-3 text-xs sm:text-sm text-purple-100/90 leading-relaxed sm:mt-4">
                We deliver to all major commercial airports across the United States (all 50 states), Canada (Toronto, Vancouver, Montreal, Calgary), United Kingdom (London Heathrow), and select international destinations.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
              <strong className="block text-base sm:text-lg font-bold text-[#EBCB8B]">Hand Delivery Direct To Your Door</strong>
              <p className="mt-2 text-xs text-purple-200 leading-relaxed">
                Ground vehicle transport is also available within a 300-mile radius of our nursery facility for direct home drop-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ navigate, limit = null }) {
  const reviews = [
    {
      name: "Sarah & David M.",
      location: "Dallas, Texas",
      dog: "Bella (Teacup Yorkie)",
      text: "Dazy’s Paw Haven exceeded every expectation! Little Bella arrived safely via flight nanny right to Dallas-Fort Worth airport. She came fully vaccinated with a complete health passport and was already well on her way with potty training."
    },
    {
      name: "The Harrison Family",
      location: "Seattle, Washington",
      dog: "Milo & Otis (Shih Tzu Brothers)",
      text: "Adopting our two Shih Tzu boys from Dazy's was the best decision we've ever made. Their 15+ years of experience really shows in how calm, socialized, and healthy these pups are. The medical records were crystal clear!"
    },
    {
      name: "Dr. Elena Rostova",
      location: "Miami, Florida",
      dog: "Teddy (Imperial Shih Tzu)",
      text: "As a veterinarian myself, I am extremely cautious about pet shelters and breeders. Dazy's Paw Haven maintains impeccable standards. Teddy was completely up to date on vaccinations and microchipped with ISO standards."
    },
    {
      name: "Marcus & Chloe Vance",
      location: "Chicago, Illinois",
      dog: "Coco (Yorkshire Terrier)",
      text: "From our first video call to Coco’s arrival at O'Hare with her flight nanny, the communication was seamless. Dazy's Paw Haven provided her full vaccination record, health guarantee, and even a puppy starter pack."
    },
    {
      name: "Amanda K.",
      location: "New York, NY",
      dog: "Peanut (Micro Yorkie)",
      text: "Peanut is my dream teacup Yorkie! He is tiny, hypoallergenic, playful, and so full of energy. Dazy's staff was so patient answering all my questions about feeding schedules and health warranties."
    },
    {
      name: "Robert & Linda Chen",
      location: "Toronto, Canada",
      dog: "Mochi (Party-Coat Shih Tzu)",
      text: "International delivery to Canada was handled smoothly! Dazy's team took care of all international health certificates and customs paperwork. Mochi arrived happy, healthy, and ready for cuddles."
    }
  ];

  let media = [
    ...TESTIMONIAL_IMAGES.map((src, i) => ({ id: `photo-${i}`, src, type: 'image' })),
    ...TESTIMONIAL_VIDEOS.map((src, i) => ({ id: `video-${i}`, src, poster: TESTIMONIAL_IMAGES[i], type: 'video' }))
  ].filter((_, i) => i !== 5 && i !== 6 && i !== 7);

  if (limit) {
    media = media.slice(0, limit);
  }

  return (
    <section id="stories" className="bg-gradient-to-b from-[#F8F2FC] via-[#FCF9FE] to-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-black text-[#2D1B3E] sm:text-5xl lg:text-6xl">
            {limit ? "Stories from happy families" : "All Adoption Stories & Video Reviews"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#584168] sm:mt-5 sm:text-lg sm:leading-8">
            Real adoption moments, video updates, and verified reviews from families across North America who welcomed a puppy from Dazy’s Paw Haven.
          </p>
          <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-16 rounded-full bg-[#D99F38] sm:mt-6" />
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item, i) => {
            const review = reviews[i % reviews.length];
            return (
              <figure key={item.id} className="group overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] bg-white shadow-md shadow-[#2D1B3E]/5 ring-1 ring-[#E8DAF0] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  {item.type === 'video' ? <MutedVideo src={item.src} poster={item.poster} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <img src={item.src} alt={`Adopter story photo ${i + 1}`} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <figcaption className="p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#6C428E] sm:text-xs">Verified Adoption</span>
                      <span className="text-xs font-bold text-[#D99F38]">★★★★★</span>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm italic leading-relaxed text-[#483458]">“{review.text}”</p>
                  </figcaption>
                </div>
                <div className="border-t border-[#F0E8F4] bg-[#FCF9FE] px-5 py-3.5 sm:px-6 sm:py-4 transition-colors duration-300 group-hover:bg-[#F2EAFA]">
                  <strong className="block text-xs sm:text-sm font-bold text-[#2D1B3E]">{review.name}</strong>
                  <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-[#8668A1] mt-0.5 gap-1">
                    <span>📍 {review.location}</span>
                    <span className="font-semibold text-[#6C428E]">{review.dog}</span>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>

        {limit && navigate && (
          <div className="mt-10 text-center sm:mt-14">
            <button
              onClick={() => navigate('stories')}
              className="group inline-flex items-center gap-3 rounded-2xl bg-[#2D1B3E] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-[#2D1B3E]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#452B5E] hover:shadow-2xl active:scale-95 sm:px-8 sm:py-4"
            >
              See All Stories &amp; Video Reviews
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-gradient-to-b from-white to-[#F8F2FC] py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <Title eyebrow="Good to know" title="Questions, Answered Plainly" />
        <div className="mt-8 space-y-3 sm:mt-10">
          {ACCURATE_FAQS.map((item, i) => (
            <div key={item.question} className="overflow-hidden rounded-2xl border border-[#E8DAF0] bg-white shadow-sm transition-all duration-300 hover:border-[#6C428E]">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full justify-between gap-3 p-4 text-left text-base sm:p-5 sm:text-lg font-black text-[#2D1B3E] transition-colors duration-200 hover:bg-[#FCF9FE]"
              >
                <span>{item.question}</span>
                <span className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full bg-[#F2EAFA] text-sm sm:text-base text-[#6C428E] transition-transform duration-300 ${open === i ? 'rotate-180 bg-[#2D1B3E] text-white' : ''}`}>
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && (
                <p className="border-t border-[#E8DAF0] bg-white p-4 text-sm sm:p-5 sm:text-base text-[#584168] animate-in fade-in duration-200">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DayAtShelter({ limit = null }) {
  const videoList = limit ? DAY_VIDEOS.slice(0, limit) : DAY_VIDEOS;

  return (
    <section id="day" className="bg-gradient-to-b from-[#FAF5EF] via-white to-[#FCF9FE] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Shelter Video Gallery" title="A Little More Of Life At The Haven" body="Watch clips from the shelter media collection. All videos play muted." />
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {videoList.map((src, i) => (
            <figure key={src} className="group overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] bg-[#231233] shadow-lg ring-1 ring-[#2D1B3E]/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <MutedVideo src={src} poster={SHELTER_IMAGES[(i + 1) % SHELTER_IMAGES.length]} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoJournal() {
  const filteredPhotos = PET_IMAGES.filter((_, i) => i !== 13 && i !== 15 && i !== 16);

  return (
    <section className="bg-gradient-to-br from-[#F2EAFA] via-[#FCF9FE] to-[#F8F1E6] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Photo Journal" title="The Faces Behind The Pawprints" body="A little gallery from the dogs and pups who make our shelter feel like home." />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredPhotos.map((src, i) => (
            <div key={src} className={`overflow-hidden rounded-2xl sm:rounded-[1.75rem] shadow-lg transition-transform duration-500 hover:scale-[1.03] ${i === 0 || i === 5 ? 'md:row-span-2' : ''}`}>
              <img src={src} alt={`Shelter photo ${i + 1}`} loading="lazy" decoding="async" className="h-full min-h-40 sm:min-h-52 w-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdoptionCare() {
  const items = [
    ['01', 'Tell us about your home', 'Share your routine, household and what you hope for in a companion.'],
    ['02', 'Ask about a meeting', 'Review the puppy photos, ask questions and check whether a meeting can be arranged.'],
    ['03', 'Review the records', 'Ask the shelter to confirm current availability, share known care history and explain the next steps.']
  ];
  return (
    <section className="bg-[#FCF9FE] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title eyebrow="Thoughtful Matches" title="A Caring Path To Adoption" />
        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
          {items.map(([number, title, body]) => (
            <article key={number} className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] border border-[#E8DAF0] bg-white p-6 sm:p-7 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#6C428E] hover:shadow-xl">
              <span className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-[#F2EAFA] text-2xl sm:text-3xl font-black text-[#8668A1] transition-transform duration-300 group-hover:rotate-6 group-hover:bg-[#EBCB8B]/40">{number}</span>
              <h3 className="mt-4 text-xl sm:text-2xl font-black text-[#2D1B3E] sm:mt-5">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#584168] sm:mt-3 sm:text-base">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShelterPromise() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-r from-[#2D1B3E] via-[#452B5E] to-[#5C3A7A] py-14 sm:py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.18em] sm:px-4 sm:py-2 sm:text-xs">What Guides Us</span>
          <h2 className="mt-4 text-3xl font-black text-white sm:mt-5 sm:text-4xl">Every dog deserves a safe next chapter.</h2>
          <p className="mt-3 text-base leading-relaxed text-purple-100 sm:mt-5 sm:text-lg">We focus on careful introductions, health-guaranteed placements, and match every family with a lifelong companion.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[['15+', 'Years of shelter leadership'], ['100%', 'Vaccinated & Microchipped'], ['10 Yr', 'Genetic Health Guarantee'], ['50 States', 'Safe Flight Nanny Shipping']].map(([number, label]) => (
            <div key={label} className="rounded-2xl sm:rounded-[1.5rem] bg-white/[0.12] p-4 sm:p-5 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.18]">
              <b className="block text-2xl sm:text-3xl">{number}</b>
              <span className="mt-1 block text-xs sm:text-sm text-purple-100 sm:mt-2">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ browse, navigate, onOpen, filter, setFilter, puppies }) {
  return (
    <>
      <Hero browse={browse} navigate={navigate} />
      <Puppies filter={filter} setFilter={setFilter} onOpen={onOpen} puppies={puppies} limit={6} navigate={navigate} />
      <Shelter />
      <PhotoJournal />
      <AdoptionCare />
      <ShelterPromise />
      <DayAtShelter limit={8} />
      <Testimonials navigate={navigate} limit={6} />
      <Faq />
    </>
  );
}

function AdoptionGuide() {
  const topics = [
    ['5-in-1 Vaccine Record (DHPP)', 'All puppies leave with recorded age-appropriate 5-in-1 vaccines covering Distemper, Hepatitis, Parvovirus, and Parainfluenza.'],
    ['Deworming & Parasite Prevention', 'Puppies are dewormed every 2 weeks starting at week 2, along with proactive preventative flea and tick administration.'],
    ['Microchip & ISO Identification', 'Every puppy is implanted with an ISO-compliant microchip ready to be registered in your name.'],
    ['10-Year Genetic Health Warranty', 'Our written contract includes a 10-year genetic health guarantee protecting against congenital defects.']
  ];

  return (
    <>
      <AdoptionCare />
      <section className="bg-gradient-to-br from-[#FCF9FE] to-[#F8F1E6] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Title eyebrow="Health Standards" title="Vaccination & Medical Care Protocol" body="Transparency is our top priority. Every puppy receives comprehensive veterinary care prior to rehoming." />
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(([title, body], i) => (
              <article key={title} className="rounded-[1.5rem] border border-[#E8DAF0] bg-white p-5 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-[#F2EAFA] text-base sm:text-lg font-black text-[#6C428E]">0{i + 1}</span>
                <h3 className="mt-4 text-lg sm:text-xl font-black text-[#2D1B3E] sm:mt-5">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#584168] sm:mt-3">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactPage({ navigate }) {
  const whatsappNumber = "18005847297";
  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello Dazy's Paw Haven! I have a question about available puppies.");
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const fields = [
    ['Phone Hotline', '(800) 584-PAWS (7297)'], 
    ['Live Chat Support', 'Direct messaging via WhatsApp'], 
    ['Shelter Nursery', 'Visits arranged by scheduled appointment']
  ];

  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-[#FCF9FE] via-white to-[#F8F1E6] py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Title eyebrow="Contact Us" title="Talk with our adoption team" body="Have questions about a specific puppy, flight nanny shipping, or our adoption process? Reach out anytime!" />
        
        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
          {fields.map(([label, value], idx) => (
            <article key={label} className="flex flex-col justify-between rounded-[1.5rem] border border-[#E8DAF0] bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div>
                <span className="rounded-full bg-[#F2EAFA] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#6C428E] sm:text-xs">
                  {idx === 1 ? 'WhatsApp Online' : 'Official Hotline'}
                </span>
                <h3 className="mt-4 text-lg sm:text-xl font-black text-[#2D1B3E] sm:mt-5">{label}</h3>
                <p className="mt-2 text-xs sm:text-sm font-semibold leading-6 text-[#584168]">{value}</p>
              </div>

              {idx === 1 && (
                <button
                  onClick={openWhatsApp}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-black text-white shadow-md transition-all hover:bg-[#1EBE5B] active:scale-95"
                >
                  <span>💬</span> Live Chat
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-[#2D1B3E] p-6 text-center text-white shadow-xl transition-all duration-300 hover:shadow-2xl sm:mt-10 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-black text-white">Ready to meet your new puppy?</h2>
          <p className="mt-2 text-xs sm:text-sm text-purple-100 sm:mt-3">Browse our current available Yorkies and Shih Tzus and submit your adoption application today.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-6">
            <button onClick={() => navigate('puppies')} className="rounded-2xl bg-[#EBCB8B] px-6 py-3 text-xs sm:text-sm font-extrabold text-[#231233] transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95">
              Browse Available Puppies
            </button>
            <button onClick={openWhatsApp} className="rounded-2xl bg-[#25D366] px-6 py-3 text-xs sm:text-sm font-extrabold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1EBE5B] active:scale-95 flex items-center gap-2">
              <span>💬</span> Live Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ navigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setSubscribed(true);
      setEmail('');
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const navigationLinks = [
    ['home', 'Home'],
    ['puppies', 'Available Puppies'],
    ['donate', 'Donate to Shelter'],
    ['shelter', 'Our Shelter'],
    ['vaccinations', 'Vaccinations'],
    ['certificates', 'Certificates'],
    ['shipping', 'Flight Shipping'],
    ['adoption', 'Adoption Guide'],
    ['stories', 'Community Stories'],
    ['faq', 'FAQs & Answers'],
    ['contact', 'Contact Us'],
    ['admin', 'Admin Sign In']
  ];

  const breedList = [
    'Yorkshire Terriers (Yorkies)',
    'Teacup & Micro Yorkies',
    'Shih Tzus (Standard & Imperial)',
    'Morkies & Specialty Hybrids',
    'Rescue & Community Dogs'
  ];

  const trustBadges = [
    { title: 'USDA Licensed', detail: 'USDA Class A Facility #47-A-8921' },
    { title: 'AKC Registered', detail: 'Full Purebred Lineage Verification' },
    { title: '10-Yr Guarantee', detail: 'Comprehensive Genetic Health Warranty' },
    { title: 'Pet Flight Nanny', detail: 'In-Cabin Airport Delivery Available' }
  ];

  return (
    <footer className="relative bg-[#180A24] text-purple-100 border-t border-[#2D1B3E]">
      <div className="border-b border-white/10 bg-gradient-to-r from-[#231233] via-[#2D1B3E] to-[#231233] py-8 sm:py-10 px-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 lg:flex-row text-center lg:text-left">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EBCB8B]/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#EBCB8B] sm:px-3.5 sm:text-xs">
              <span>✦</span> VIP Litter Alerts
            </span>
            <h3 className="mt-2 text-xl font-black text-white sm:text-3xl">Get notified when new Yorkie &amp; Shih Tzu puppies arrive</h3>
            <p className="mt-1 text-xs sm:text-sm text-purple-200/80">Be the first to view new litters before they are publicly listed.</p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="rounded-2xl bg-[#EBCB8B]/20 border border-[#EBCB8B] px-6 py-3.5 text-center text-sm font-black text-[#EBCB8B]">
                ✓ You have subscribed
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-purple-200/60 outline-none transition-all duration-300 focus:border-[#EBCB8B] focus:bg-white/20"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-2xl bg-[#EBCB8B] px-6 py-3 text-xs sm:text-sm font-black text-[#180A24] transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-[#12061C] py-6 sm:py-8 px-4 sm:px-8">
        <div className="mx-auto grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08]">
              <span className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-[#EBCB8B]/20 text-base sm:text-lg font-black text-[#EBCB8B]">✓</span>
              <div>
                <strong className="block text-xs sm:text-sm font-bold text-white">{badge.title}</strong>
                <span className="text-[11px] sm:text-xs text-purple-200/70">{badge.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-8 sm:py-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="group flex items-center gap-3">
            <b className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EBCB8B] text-lg text-[#180A24] shadow-md transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">♥</b>
            <span>
              <b className="block text-xl font-black text-white">Dazy’s Paw Haven</b>
              <small className="block text-[10px] font-bold uppercase tracking-[.2em] text-[#EBCB8B]">Licensed Adoption Shelter</small>
            </span>
          </a>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-purple-200/80 sm:mt-5">
            A compassionate, home-style rescue and dedicated adoption shelter in the USA with over 15 years of experience. We specialize in loving care and health-guaranteed rehoming for Yorkshire Terriers and Shih Tzus.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#EBCB8B] sm:text-xs">Navigation</h4>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm font-medium sm:mt-5 sm:space-y-2.5">
            {navigationLinks.map(([route, label]) => (
              <li key={route}>
                <a
                  href={`#${route}`}
                  onClick={(e) => { e.preventDefault(); navigate(route); }}
                  className="inline-flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <span className="text-xs text-[#EBCB8B]/60">›</span> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#EBCB8B] sm:text-xs">Featured Breeds</h4>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium text-purple-200/90 sm:mt-5 sm:space-y-3">
            {breedList.map((breed, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EBCB8B]" />
                {breed}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#EBCB8B] sm:text-xs">Shelter Contact</h4>
          <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-purple-200/90 sm:mt-5 sm:space-y-3">
            <p className="flex items-start gap-2.5">
              <span className="text-[#EBCB8B]">📍</span>
              <span>United States (Nationwide Flight Nanny Delivery)</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="text-[#EBCB8B]">📞</span>
              <span className="font-bold text-white">(800) 584-PAWS (7297)</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="text-[#EBCB8B]">✉</span>
              <span>adoptions@dazyspawhaven.org</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0F0417]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-purple-300/70 sm:px-8 sm:py-6 md:flex-row">
          <p>© {new Date().getFullYear()} Dazy’s Paw Haven Shelter Inc. All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-bold text-[#EBCB8B] hover:text-white transition-all duration-200 hover:scale-105">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const routes = ['home', 'puppies', 'donate', 'shelter', 'vaccinations', 'certificates', 'shipping', 'adoption', 'stories', 'faq', 'contact', 'admin'];
  const readRoute = () => {
    const candidate = window.location.hash.slice(1);
    return routes.includes(candidate) ? candidate : 'home';
  };

  const [page, setPage] = useState(readRoute);
  const [filter, setFilter] = useState('All Puppies');
  const [puppies, setPuppies] = useState(PUPPIES);
  const [selected, setSelected] = useState(null);

  const navigate = route => {
    setPage(route);
    setSelected(null);
    if (window.location.hash !== `#${route}`) window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const browse = () => {
    setFilter('All Puppies');
    navigate('puppies');
  };

  useEffect(() => {
    setPuppies(PUPPIES);

    const onHashChange = () => {
      setPage(readRoute());
      setSelected(null);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D1B3E] selection:bg-[#E8DAF0] overflow-x-hidden">
      <AnimationStyles />
      <Header page={page} navigate={navigate} browse={browse} />
      <main className="transition-opacity duration-300">
        {page === 'home' && <HomePage browse={browse} navigate={navigate} onOpen={setSelected} filter={filter} setFilter={setFilter} puppies={puppies} />}
        {page === 'puppies' && <Puppies filter={filter} setFilter={setFilter} onOpen={setSelected} puppies={puppies} />}
        {page === 'donate' && <DonatePage />}
        {page === 'shelter' && <><Shelter /><PhotoJournal /><DayAtShelter /></>}
        {page === 'vaccinations' && <VaccinationsPage navigate={navigate} />}
        {page === 'certificates' && <CertificatesPage navigate={navigate} />}
        {page === 'shipping' && <ShippingPage navigate={navigate} />}
        {page === 'adoption' && <AdoptionGuide />}
        {page === 'stories' && <Testimonials navigate={navigate} />}
        {page === 'faq' && <Faq />}
        {page === 'contact' && <ContactPage navigate={navigate} />}
        {page === 'admin' && <AdminPanel />}
      </main>
      <Footer navigate={navigate} />
      {selected && <PuppyDetail puppy={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}