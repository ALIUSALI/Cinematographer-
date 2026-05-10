import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google Fonts ─────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Bebas+Neue&family=Space+Mono:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black:    #000000;
      --deep:     #080808;
      --carbon:   #0E0E0E;
      --charcoal: #161616;
      --dim:      #1E1E1E;
      --muted:    #2A2A2A;
      --smoke:    #444444;
      --ash:      #888888;
      --silk:     #C8C0B4;
      --cream:    #F0EAE0;
      --gold:     #C9A84C;
      --gold-lt:  #E8C96A;
      --gold-dk:  #8A6B2A;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--black);
      color: var(--cream);
      font-family: 'Cormorant Garamond', serif;
      overflow-x: hidden;
      cursor: none;
    }

    /* ── Custom Cursor ── */
    .cursor-dot {
      width: 8px; height: 8px;
      background: var(--gold);
      border-radius: 50%;
      position: fixed; top: 0; left: 0;
      pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
    }
    .cursor-ring {
      width: 36px; height: 36px;
      border: 1px solid rgba(201,168,76,0.5);
      border-radius: 50%;
      position: fixed; top: 0; left: 0;
      pointer-events: none; z-index: 9998;
      transform: translate(-50%, -50%);
      transition: transform 0.18s ease, width 0.3s, height 0.3s, opacity 0.3s;
    }
    .cursor-ring.hovered {
      width: 64px; height: 64px;
      border-color: var(--gold);
      opacity: 0.7;
    }

    /* ── Film Grain Overlay ── */
    @keyframes grain {
      0%,100%{ transform: translate(0,0) }
      10%     { transform: translate(-2%,-3%) }
      20%     { transform: translate(3%, 2%) }
      30%     { transform: translate(-1%, 4%) }
      40%     { transform: translate(4%,-1%) }
      50%     { transform: translate(-3%, 3%) }
      60%     { transform: translate(2%,-4%) }
      70%     { transform: translate(-4%, 1%) }
      80%     { transform: translate(1%, 3%) }
      90%     { transform: translate(3%,-2%) }
    }
    .grain-overlay {
      position: fixed; inset: -50%;
      width: 200%; height: 200%;
      pointer-events: none; z-index: 9000;
      opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      animation: grain 0.5s steps(1) infinite;
    }

    /* ── Loading Screen ── */
    @keyframes countdown { from { stroke-dashoffset: 0 } to { stroke-dashoffset: 283 } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes slideLeft { from { transform:translateX(0) } to { transform:translateX(-100%) } }
    @keyframes slideRight { from { transform:translateX(0) } to { transform:translateX(100%) } }
    @keyframes scaleUp { from { transform:scale(1.2); opacity:0 } to { transform:scale(1); opacity:1 } }
    @keyframes shimmer { from { background-position: -200% center } to { background-position: 200% center } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes barFill { from{width:0} to{width:var(--pct)} }
    @keyframes typewriter { from{width:0} to{width:100%} }
    @keyframes filmPerf { 0%{transform:translateY(0)} 100%{transform:translateY(-100%)} }
    @keyframes vignette { from{opacity:0} to{opacity:1} }
    @keyframes goldGlow { 0%,100%{text-shadow:0 0 20px rgba(201,168,76,0.3)} 50%{text-shadow:0 0 40px rgba(201,168,76,0.7),0 0 80px rgba(201,168,76,0.2)} }
    @keyframes borderDraw {
      from { clip-path: inset(0 100% 100% 0); }
      to   { clip-path: inset(0 0% 0% 0); }
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

    /* ── Reveal on Scroll ── */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-50px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s; }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(50px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s; }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }

    /* ── Section Headings ── */
    .section-label {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.35em;
      color: var(--gold);
      text-transform: uppercase;
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 16px;
    }
    .section-label::before {
      content: '';
      display: block;
      width: 32px; height: 1px;
      background: var(--gold);
    }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      font-weight: 300;
      line-height: 1.05;
      letter-spacing: -0.01em;
      color: var(--cream);
    }
    .gold-text {
      color: var(--gold);
      font-style: italic;
    }

    /* ── Gold Divider ── */
    .gold-line {
      width: 60px; height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      margin: 24px 0;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gold-dk); }

    /* ── Nav ── */
    .nav-link {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--ash);
      text-decoration: none;
      text-transform: uppercase;
      transition: color 0.3s;
      position: relative;
      padding-bottom: 2px;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 1px;
      background: var(--gold);
      transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .nav-link:hover { color: var(--cream); }
    .nav-link:hover::after { width: 100%; }

    /* ── Buttons ── */
    .btn-gold {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 36px;
      border: 1px solid var(--gold);
      color: var(--gold);
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
      background: transparent;
      position: relative;
      overflow: hidden;
      transition: color 0.4s;
    }
    .btn-gold::before {
      content: '';
      position: absolute; inset: 0;
      background: var(--gold);
      transform: translateX(-101%);
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .btn-gold:hover { color: var(--black); }
    .btn-gold:hover::before { transform: translateX(0); }
    .btn-gold span { position: relative; z-index: 1; }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 36px;
      border: 1px solid var(--smoke);
      color: var(--silk);
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      background: transparent;
      transition: border-color 0.3s, color 0.3s;
    }
    .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

    /* ── Portfolio Cards ── */
    .portfolio-card {
      position: relative; overflow: hidden;
      aspect-ratio: 16/10;
      cursor: pointer;
    }
    .portfolio-card img { width:100%; height:100%; object-fit:cover; transition:transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s; }
    .portfolio-card:hover img { transform: scale(1.06); filter: brightness(0.5); }
    .portfolio-card-info {
      position:absolute; inset:0;
      padding: 28px;
      display: flex; flex-direction: column; justify-content: flex-end;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.5s;
    }
    .portfolio-card:hover .portfolio-card-info { opacity: 1; }
    .portfolio-card-tag {
      font-family:'Space Mono',monospace; font-size:10px;
      letter-spacing:0.3em; color:var(--gold); text-transform:uppercase;
      margin-bottom:8px;
    }
    .portfolio-card-title {
      font-family:'Cormorant Garamond',serif; font-size:1.6rem;
      font-weight:300; color:var(--cream); line-height:1.2;
    }
    .portfolio-card-year {
      font-family:'Space Mono',monospace; font-size:10px;
      color:var(--ash); margin-top:6px;
    }
    .card-play-btn {
      position:absolute; top:50%; left:50%;
      transform:translate(-50%,-50%) scale(0);
      width:56px; height:56px; border-radius:50%;
      border:1px solid var(--gold);
      display:flex; align-items:center; justify-content:center;
      color:var(--gold); transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .portfolio-card:hover .card-play-btn { transform:translate(-50%,-50%) scale(1); }

    /* ── Skill Bars ── */
    .skill-bar-track {
      width: 100%; height: 1px;
      background: var(--muted);
      position: relative; overflow: visible;
    }
    .skill-bar-fill {
      height: 1px;
      background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt));
      position: relative;
      transition: width 1.4s cubic-bezier(0.16,1,0.3,1);
      width: 0;
    }
    .skill-bar-fill::after {
      content:'';
      position:absolute; right:0; top:50%;
      transform:translateY(-50%);
      width:5px; height:5px; border-radius:50%;
      background:var(--gold-lt);
      box-shadow:0 0 8px var(--gold);
    }

    /* ── Equipment Cards ── */
    .equip-card {
      border: 1px solid var(--muted);
      padding: 28px;
      position: relative;
      transition: border-color 0.4s;
      overflow: hidden;
    }
    .equip-card::before {
      content:'';
      position:absolute; inset:0;
      background: linear-gradient(135deg, rgba(201,168,76,0.04), transparent);
      opacity:0; transition:opacity 0.4s;
    }
    .equip-card:hover { border-color: var(--gold-dk); }
    .equip-card:hover::before { opacity:1; }
    .equip-card-num {
      font-family:'Bebas Neue',cursive;
      font-size:3rem; color:var(--muted);
      line-height:1; margin-bottom:12px;
      transition:color 0.4s;
    }
    .equip-card:hover .equip-card-num { color:var(--gold-dk); }

    /* ── Testimonial ── */
    .testimonial-quote {
      font-family:'Cormorant Garamond',serif;
      font-size:clamp(1.2rem,2.5vw,1.7rem);
      font-weight:300; font-style:italic;
      line-height:1.6; color:var(--silk);
    }
    .testimonial-quote::before { content:'\u201C'; color:var(--gold); font-size:3em; line-height:0; vertical-align:-0.3em; margin-right:4px; }

    /* ── Timeline ── */
    .timeline-item { position:relative; padding-left:32px; }
    .timeline-item::before {
      content:'';
      position:absolute; left:0; top:8px;
      width:8px; height:8px; border-radius:50%;
      border:1px solid var(--gold);
      background:var(--black);
      z-index:1;
    }
    .timeline-item::after {
      content:'';
      position:absolute; left:3px; top:20px;
      width:1px; height:calc(100% + 24px);
      background:linear-gradient(to bottom, var(--muted), transparent);
    }
    .timeline-item:last-child::after { display:none; }

    /* ── Video Modal ── */
    .modal-overlay {
      position:fixed; inset:0;
      background:rgba(0,0,0,0.95);
      z-index:8000;
      display:flex; align-items:center; justify-content:center;
      animation: fadeIn 0.3s ease;
    }
    .modal-content {
      width:min(90vw,900px);
      aspect-ratio:16/9;
      position:relative;
      animation: scaleUp 0.4s cubic-bezier(0.16,1,0.3,1);
    }

    /* ── Contact ── */
    .input-field {
      width:100%; background:transparent;
      border:none; border-bottom:1px solid var(--muted);
      padding:14px 0; color:var(--cream);
      font-family:'Cormorant Garamond',serif;
      font-size:1.1rem;
      outline:none;
      transition:border-color 0.3s;
    }
    .input-field::placeholder { color:var(--smoke); }
    .input-field:focus { border-color:var(--gold); }

    /* ── Marquee ── */
    .marquee-track {
      display:flex; gap:48px;
      animation: marquee 18s linear infinite;
      white-space:nowrap; width:max-content;
    }
    .marquee-item {
      font-family:'Bebas Neue',cursive;
      font-size:clamp(4rem,8vw,7rem);
      color:transparent;
      -webkit-text-stroke: 1px var(--muted);
      letter-spacing:0.05em;
      line-height:1;
      user-select:none;
    }
    .marquee-item.filled { -webkit-text-stroke: 1px var(--gold); color:var(--gold); opacity:0.15; }

    /* ── Mobile Nav ── */
    .mobile-menu {
      position:fixed; inset:0; background:var(--black);
      z-index:7000; padding:80px 40px 40px;
      display:flex; flex-direction:column; gap:32px;
      transform:translateX(100%);
      transition:transform 0.5s cubic-bezier(0.16,1,0.3,1);
    }
    .mobile-menu.open { transform:translateX(0); }
    .mobile-nav-link {
      font-family:'Bebas Neue',cursive;
      font-size:3rem; letter-spacing:0.05em;
      color:var(--muted); text-decoration:none;
      transition:color 0.3s;
    }
    .mobile-nav-link:hover { color:var(--cream); }

    /* ── BTS Gallery ── */
    .bts-item {
      overflow:hidden; cursor:pointer;
    }
    .bts-item img {
      width:100%; height:100%; object-fit:cover;
      transition:transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s;
      filter: grayscale(30%) brightness(0.8);
    }
    .bts-item:hover img { transform:scale(1.05); filter:grayscale(0%) brightness(1); }

    /* ── Loading Screen ── */
    .loader-panel {
      position:fixed; top:0; height:100%;
      width:50%; background:var(--black); z-index:9500;
      transition:transform 0.9s cubic-bezier(0.16,1,0.3,1);
    }
    .loader-panel.left { left:0; }
    .loader-panel.right { right:0; }
    .loader-panel.left.exit { transform:translateX(-100%); }
    .loader-panel.right.exit { transform:translateX(100%); }

    /* ── Social Links ── */
    .social-link {
      width:44px; height:44px;
      border:1px solid var(--muted);
      display:flex; align-items:center; justify-content:center;
      color:var(--ash); text-decoration:none;
      transition:border-color 0.3s, color 0.3s, transform 0.3s;
      font-size:14px;
    }
    .social-link:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }

    /* ── Hero vignette ── */
    .hero-vignette {
      position:absolute; inset:0;
      background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%);
      pointer-events:none;
    }

    /* ── Featured Card ── */
    .featured-card {
      position:relative; overflow:hidden;
      border:1px solid var(--muted);
      transition:border-color 0.4s;
      cursor:pointer;
    }
    .featured-card:hover { border-color:var(--gold-dk); }
    .featured-card-overlay {
      position:absolute; inset:0;
      background:linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
    }
    .featured-card-content {
      position:absolute; bottom:0; left:0; right:0;
      padding:32px;
    }
    .featured-play {
      position:absolute; top:50%; left:50%;
      transform:translate(-50%,-50%) scale(0.8);
      width:72px; height:72px; border-radius:50%;
      background:rgba(201,168,76,0.1);
      border:1px solid rgba(201,168,76,0.5);
      backdrop-filter:blur(4px);
      display:flex; align-items:center; justify-content:center;
      color:var(--gold);
      opacity:0; transition:opacity 0.4s, transform 0.4s;
    }
    .featured-card:hover .featured-play { opacity:1; transform:translate(-50%,-50%) scale(1); }

    @media (max-width:768px) {
      .desktop-only { display:none!important; }
      .mobile-show { display:flex!important; }
    }
    @media (min-width:769px) {
      .mobile-only { display:none!important; }
    }
  `}</style>
);

/* ─── Data ─────────────────────────────────────────────────────────── */
const PORTFOLIO = [
  { id:1, title:"Ember & Ash", genre:"Drama", year:"2024", tag:"Feature Film", color:"#2A1A0A", img:"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80" },
  { id:2, title:"Silence of Dusk", genre:"Thriller", year:"2024", tag:"Short Film", color:"#0A0F1A", img:"https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&q=80" },
  { id:3, title:"Golden Parallels", genre:"Documentary", year:"2023", tag:"Documentary", color:"#1A1200", img:"https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&q=80" },
  { id:4, title:"Neon Requiem", genre:"Noir", year:"2023", tag:"Music Video", color:"#0D0A1A", img:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80" },
  { id:5, title:"The Last Frame", genre:"Drama", year:"2022", tag:"Feature Film", color:"#0A0A0A", img:"https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80" },
  { id:6, title:"Chromatic Dreams", genre:"Experimental", year:"2022", tag:"Experimental", color:"#0D0A0A", img:"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80" },
];

const FEATURED = [
  { id:1, title:"Ember & Ash", year:"2024", runtime:"1h 48m", role:"Director of Photography", awards:"Best Cinematography — Lagos Film Festival", img:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80", desc:"A sweeping visual odyssey through the Saharan borderlands, drenched in amber light and shadow." },
  { id:2, title:"Silence of Dusk", year:"2024", runtime:"24 min", role:"Director & DP", awards:"Official Selection — Sundance 2024", img:"https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&q=80", desc:"An intimate thriller exploring memory, identity, and the spaces between heartbeats." },
  { id:3, title:"Golden Parallels", year:"2023", runtime:"52 min", role:"Cinematographer", awards:"Best Documentary — DIFF 2023", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", desc:"A cinematic documentary on the vanishing landscapes of East Africa's highland savannah." },
];

const SKILLS = [
  { name:"Cinematography", pct:97 },
  { name:"Lighting Design", pct:94 },
  { name:"Camera Operation", pct:96 },
  { name:"Directing", pct:88 },
  { name:"Color Grading", pct:91 },
  { name:"Video Editing", pct:85 },
];

const EQUIPMENT = [
  { num:"01", name:"ARRI ALEXA 35", desc:"Primary large-format cinema camera for features and high-end commercial work." },
  { num:"02", name:"Sony VENICE 2", desc:"8K full-frame sensor for exceptional low-light imagery and cinematic latitude." },
  { num:"03", name:"DJI Ronin 4D", desc:"6K integrated cinema camera with LiDAR autofocus and advanced stabilization." },
  { num:"04", name:"Cooke Anamorphic/i", desc:"Full set of T2.3 anamorphic primes delivering that unmistakable oval bokeh." },
  { num:"05", name:"Litepanels Gemini", desc:"Bi-color LED panels for broadcast-quality soft and hard light setups." },
  { num:"06", name:"DaVinci Resolve Studio", desc:"Professional color grading on a calibrated Flanders CM250 reference monitor." },
];

const TESTIMONIALS = [
  { text:"Working with him is like watching a painter with light. Every frame is a deliberate, breathtaking decision. The footage he delivered for our feature exceeded every expectation.", name:"Amara Osei", role:"Film Director, Accra Cinema House", avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" },
  { text:"His eye for cinematic storytelling transformed our brand campaign into something awards-worthy. The team was stunned by the raw beauty he captured under impossible conditions.", name:"Zara Kamau", role:"Creative Director, Vanta Films", avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { text:"An exceptional artist who understands narrative through the lens. He brought an authenticity to our documentary that no one else could have delivered.", name:"David Njoroge", role:"Executive Producer, Savannah Pictures", avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
];

const BTS_GALLERY = [
  { img:"https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=600&q=80", span:1 },
  { img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", span:2 },
  { img:"https://images.unsplash.com/photo-1495134952774-b2eadb8e4cd4?w=600&q=80", span:1 },
  { img:"https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&q=80", span:1 },
  { img:"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80", span:1 },
  { img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", span:1 },
];

const TIMELINE = [
  { year:"2024", role:"Director of Photography", project:"Ember & Ash (Feature Film)", detail:"Shot on ARRI ALEXA 35 across 3 countries" },
  { year:"2023", role:"Cinematographer & Director", project:"Golden Parallels (Documentary)", detail:"22-day field shoot across the East African Rift Valley" },
  { year:"2022", role:"Director of Photography", project:"The Last Frame (Feature)", detail:"Led a 14-person camera department" },
  { year:"2020", role:"Camera Operator", project:"Various Commercials & Music Videos", detail:"Nike, Puma, Universal Music Group" },
  { year:"2018", role:"Camera Assistant", project:"TV Productions & Indie Films", detail:"Trained under award-winning DP Marcus Cole" },
];

const SOCIALS = [
  { label:"IG", href:"#", icon:"📷" },
  { label:"YT", href:"#", icon:"▶" },
  { label:"LI", href:"#", icon:"in" },
  { label:"VI", href:"#", icon:"V" },
];

/* ─── Hooks ────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useSkillBars(triggered) {
  useEffect(() => {
    if (!triggered) return;
    document.querySelectorAll(".skill-bar-fill").forEach(el => {
      const pct = el.dataset.pct;
      el.style.width = pct + "%";
    });
  }, [triggered]);
}

/* ─── Sub-components ───────────────────────────────────────────────── */
function LoadingScreen({ onDone }) {
  const [count, setCount] = useState(3);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCount(2), 600);
    const t2 = setTimeout(() => setCount(1), 1200);
    const t3 = setTimeout(() => { setExiting(true); setTimeout(onDone, 900); }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9500, display:"flex" }}>
      <div className={`loader-panel left ${exiting?"exit":""}`}
        style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:"4vw" }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(5rem,12vw,10rem)", color:"var(--carbon)", lineHeight:1, userSelect:"none", transition:"all 0.3s" }}>
            {count}
          </div>
        </div>
      </div>
      <div className={`loader-panel right ${exiting?"exit":""}`}
        style={{ display:"flex", alignItems:"center", paddingLeft:"4vw", borderLeft:"1px solid var(--muted)" }}>
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", letterSpacing:"0.4em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"12px", animation:"fadeIn 0.4s" }}>
            LOADING REEL
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:300, color:"var(--cream)", lineHeight:1.1 }}>
            ELIAS<br/><span style={{color:"var(--gold)", fontStyle:"italic"}}>MOREAU</span>
          </div>
          <div style={{ marginTop:"20px", width:"120px", height:"1px", background:"var(--muted)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:"var(--gold)", transformOrigin:"left", animation:`barFill 1.8s cubic-bezier(0.16,1,0.3,1) forwards`, "--pct":"100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar({ scrolled, menuOpen, setMenuOpen }) {
  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:6000,
        padding:"20px 40px", display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.08)" : "1px solid transparent",
        transition:"background 0.5s, border-color 0.5s",
      }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"1.5rem", letterSpacing:"0.12em", color:"var(--cream)" }}>
          ELIAS<span style={{ color:"var(--gold)" }}>·</span>MOREAU
        </div>
        <div className="desktop-only" style={{ display:"flex", gap:"36px" }}>
          {["Work","About","Skills","Equipment","Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
          <a href="#contact" className="btn-gold desktop-only" style={{ padding:"10px 24px" }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", letterSpacing:"0.2em" }}>BOOK NOW</span>
          </a>
          <button className="mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background:"none", border:"none", cursor:"none", color:"var(--cream)", display:"none" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
              <span style={{ display:"block", width:"24px", height:"1px", background: menuOpen?"var(--gold)":"var(--cream)", transform: menuOpen?"rotate(45deg) translateY(6px)":"none", transition:"all 0.3s" }} />
              <span style={{ display:"block", width:"24px", height:"1px", background:"var(--cream)", opacity: menuOpen?0:1, transition:"opacity 0.3s" }} />
              <span style={{ display:"block", width:"24px", height:"1px", background: menuOpen?"var(--gold)":"var(--cream)", transform: menuOpen?"rotate(-45deg) translateY(-6px)":"none", transition:"all 0.3s" }} />
            </div>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen?"open":""}`}>
        {["Work","About","Skills","Equipment","Contact"].map((s,i) => (
          <a key={s} href={`#${s.toLowerCase()}`} className="mobile-nav-link"
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay:`${i*0.05}s` }}>{s}</a>
        ))}
      </div>
    </>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" style={{ position:"relative", height:"100vh", minHeight:"600px", overflow:"hidden", display:"flex", alignItems:"center" }}>
      {/* Background */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
        <img src="https://images.unsplash.com/photo-1540559455230-d8a7f4a9a1ed?w=1920&q=85"
          alt="Cinematic background"
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.35) saturate(0.6)", animation:"scaleUp 2s cubic-bezier(0.16,1,0.3,1)" }}/>
        <div className="hero-vignette" />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 60%, var(--black) 100%)" }} />
        {/* Scan line */}
        <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", pointerEvents:"none" }} />
      </div>

      {/* Content */}
      <div style={{ position:"relative", zIndex:10, padding:"0 clamp(24px,6vw,80px)", maxWidth:"900px" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"11px", letterSpacing:"0.4em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"24px", opacity: loaded?1:0, transform: loaded?"translateY(0)":"translateY(16px)", transition:"all 0.8s 0.3s" }}>
          ◆ Director of Photography &amp; Filmmaker
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(3.5rem,9vw,8rem)", fontWeight:300, lineHeight:0.95, letterSpacing:"-0.02em", color:"var(--cream)", opacity: loaded?1:0, transform: loaded?"translateY(0)":"translateY(30px)", transition:"all 0.9s 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          Crafting<br/><span style={{ color:"var(--gold)", fontStyle:"italic" }}>Cinematic</span><br/>Worlds
        </h1>
        <div style={{ width:"60px", height:"1px", background:"var(--gold)", margin:"32px 0", opacity: loaded?1:0, transform: loaded?"scaleX(1)":"scaleX(0)", transformOrigin:"left", transition:"all 0.8s 0.8s" }} />
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1rem,2vw,1.25rem)", fontWeight:300, color:"var(--silk)", lineHeight:1.7, maxWidth:"480px", opacity: loaded?1:0, transform: loaded?"translateY(0)":"translateY(20px)", transition:"all 0.8s 0.9s" }}>
          Award-winning cinematographer with over a decade of visual storytelling. I transform visions into visceral, unforgettable frames.
        </p>
        <div style={{ display:"flex", gap:"16px", marginTop:"40px", flexWrap:"wrap", opacity: loaded?1:0, transform: loaded?"translateY(0)":"translateY(20px)", transition:"all 0.8s 1.1s" }}>
          <button className="btn-gold" onClick={() => document.getElementById("work")?.scrollIntoView({behavior:"smooth"})}>
            <span>View Portfolio</span>
            <span style={{ position:"relative", zIndex:1 }}>→</span>
          </button>
          <button className="btn-outline" onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", letterSpacing:"0.2em" }}>GET IN TOUCH</span>
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:"48px", marginTop:"72px", flexWrap:"wrap", opacity: loaded?1:0, transition:"all 0.8s 1.3s" }}>
          {[["12+","Years Experience"],["40+","Films & Projects"],["18","Awards Won"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"2.8rem", color:"var(--gold)", lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--ash)", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:"4px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:"40px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity: loaded?1:0, transition:"opacity 1s 1.5s" }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", letterSpacing:"0.3em", color:"var(--ash)", textTransform:"uppercase" }}>Scroll</div>
        <div style={{ width:"1px", height:"48px", background:"linear-gradient(to bottom, var(--gold), transparent)", animation:"pulse 2s infinite" }} />
      </div>

      {/* Frame corners */}
      {[["top-4 left-4","border-t border-l"],["top-4 right-4","border-t border-r"],["bottom-4 left-4","border-b border-l"],["bottom-4 right-4","border-b border-r"]].map(([pos], i) => (
        <div key={i} style={{
          position:"absolute",
          top: i<2 ? "20px":"auto",
          bottom: i>=2 ? "20px":"auto",
          left: i%2===0 ? "20px":"auto",
          right: i%2===1 ? "20px":"auto",
          width:"24px", height:"24px",
          borderTop: i<2 ? `1px solid rgba(201,168,76,0.4)`:"none",
          borderBottom: i>=2 ? `1px solid rgba(201,168,76,0.4)`:"none",
          borderLeft: i%2===0 ? `1px solid rgba(201,168,76,0.4)`:"none",
          borderRight: i%2===1 ? `1px solid rgba(201,168,76,0.4)`:"none",
        }} />
      ))}
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:"-5%", top:"10%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"80px", alignItems:"center", maxWidth:"1200px", margin:"0 auto" }}>
        <div className="reveal-left">
          <div className="section-label">About Me</div>
          <h2 className="section-title">The Eye<br/>Behind the<br/><span className="gold-text">Lens</span></h2>
          <div className="gold-line" />
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", lineHeight:1.8, color:"var(--silk)", fontWeight:300, marginBottom:"20px" }}>
            I'm <strong style={{color:"var(--cream)",fontWeight:400}}>Elias Moreau</strong> — a cinematographer and filmmaker based between Lagos and Nairobi. I believe that cinema is the art of making time tangible, of crystallizing moments into something eternal.
          </p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", lineHeight:1.8, color:"var(--smoke)", fontWeight:300, marginBottom:"36px" }}>
            Trained at the La Fémis Film School in Paris, I've spent over a decade developing a visual language rooted in contrast, texture, and the quiet poetry of natural light. My work has screened at Sundance, TIFF, and the Durban International Film Festival.
          </p>
          {/* Timeline */}
          <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
            {TIMELINE.map((item,i) => (
              <div key={i} className="timeline-item">
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--gold)", letterSpacing:"0.2em", marginBottom:"4px" }}>{item.year}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", color:"var(--cream)", fontWeight:500 }}>{item.role}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", color:"var(--silk)", fontStyle:"italic" }}>{item.project}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--smoke)", marginTop:"2px" }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal-right" style={{ position:"relative" }}>
          <div style={{ position:"relative", paddingTop:"12px", paddingLeft:"12px" }}>
            <div style={{ position:"absolute", top:0, left:0, width:"calc(100% - 12px)", height:"calc(100% - 12px)", border:"1px solid rgba(201,168,76,0.2)", zIndex:0 }} />
            <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
              alt="Elias Moreau"
              style={{ width:"100%", display:"block", filter:"brightness(0.85) saturate(0.7)", position:"relative", zIndex:1 }} />
            <div style={{ position:"absolute", bottom:"20px", left:"24px", zIndex:2, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", padding:"16px 20px", border:"1px solid rgba(201,168,76,0.2)" }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--gold)", letterSpacing:"0.3em" }}>CURRENTLY AVAILABLE</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"var(--silk)", marginTop:"4px", fontStyle:"italic" }}>for projects Q3 – Q4 2025</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold:0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useSkillBars(triggered);

  return (
    <section id="skills" ref={ref} style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background:"var(--deep)", position:"relative" }}>
      {/* Marquee */}
      <div style={{ overflow:"hidden", marginBottom:"80px", opacity:0.6 }}>
        <div className="marquee-track">
          {["CINEMA","LIGHT","FRAME","NARRATIVE","VISION","CRAFT","CINEMA","LIGHT","FRAME","NARRATIVE","VISION","CRAFT"].map((w,i) => (
            <span key={i} className={`marquee-item ${i%3===1?"filled":""}`}>{w}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"80px" }}>
        <div className="reveal">
          <div className="section-label">Expertise</div>
          <h2 className="section-title">Mastered<br/><span className="gold-text">Crafts</span></h2>
          <div className="gold-line" />
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"var(--smoke)", lineHeight:1.8, fontWeight:300 }}>
            Each discipline is a thread in the larger tapestry of visual storytelling — woven together to create images that resonate long after the credits roll.
          </p>
          {/* Specializations */}
          <div style={{ marginTop:"36px", display:"flex", flexWrap:"wrap", gap:"10px" }}>
            {["ARRI Systems","Anamorphic","Natural Light","Night Photography","Underwater","Aerial / Drone"].map(s => (
              <span key={s} style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", letterSpacing:"0.2em", padding:"6px 14px", border:"1px solid var(--muted)", color:"var(--ash)", textTransform:"uppercase" }}>{s}</span>
            ))}
          </div>
        </div>
        <div className="reveal" style={{ display:"flex", flexDirection:"column", gap:"32px" }}>
          {SKILLS.map((skill,i) => (
            <div key={skill.name}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", color:"var(--silk)", fontWeight:500 }}>{skill.name}</span>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--gold)", letterSpacing:"0.1em" }}>{skill.pct}%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" data-pct={skill.pct}
                  style={{ transitionDelay:`${i*0.12}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio({ onPlay }) {
  return (
    <section id="work" style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto" }}>
        <div className="reveal" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"60px", flexWrap:"wrap", gap:"24px" }}>
          <div>
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">Selected<br/><span className="gold-text">Works</span></h2>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"var(--ash)", maxWidth:"280px", lineHeight:1.7, fontStyle:"italic" }}>
            A curated selection of feature films, documentaries, and commercial projects spanning twelve years of craft.
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"2px" }}>
          {PORTFOLIO.map((p,i) => (
            <div key={p.id} className="portfolio-card reveal" style={{ transitionDelay:`${i*0.08}s` }} onClick={() => onPlay(p)}>
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className="portfolio-card-info">
                <div className="portfolio-card-tag">{p.tag}</div>
                <div className="portfolio-card-title">{p.title}</div>
                <div className="portfolio-card-year">{p.year} · {p.genre}</div>
              </div>
              <div className="card-play-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured({ onPlay }) {
  return (
    <section style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background:"var(--deep)" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto" }}>
        <div className="reveal" style={{ marginBottom:"60px" }}>
          <div className="section-label">Featured Projects</div>
          <h2 className="section-title">Signature<br/><span className="gold-text">Films</span></h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
          {FEATURED.map((f,i) => (
            <div key={f.id} className="featured-card reveal" style={{ transitionDelay:`${i*0.12}s`, minHeight:"320px" }} onClick={() => onPlay(f)}>
              <img src={f.img} alt={f.title} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
              <div className="featured-card-overlay" />
              <div className="featured-play">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div className="featured-card-content">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"16px" }}>
                  <div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--gold)", letterSpacing:"0.3em", marginBottom:"8px" }}>{f.role.toUpperCase()} · {f.year} · {f.runtime}</div>
                    <h3 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(2rem,5vw,4rem)", color:"var(--cream)", letterSpacing:"0.05em", lineHeight:1 }}>{f.title}</h3>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"var(--silk)", fontStyle:"italic", marginTop:"8px", maxWidth:"480px" }}>{f.desc}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold-dk)", letterSpacing:"0.2em", padding:"8px 14px", border:"1px solid var(--gold-dk)" }}>{f.awards}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Equipment() {
  return (
    <section id="equipment" style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div className="reveal" style={{ marginBottom:"60px" }}>
          <div className="section-label">Gear</div>
          <h2 className="section-title">Tools of the<br/><span className="gold-text">Trade</span></h2>
          <div className="gold-line" />
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"var(--smoke)", maxWidth:"500px", lineHeight:1.8 }}>
            Cinema-grade equipment operated with precision. Every lens, every light—chosen deliberately for the story it serves.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1px", background:"var(--muted)" }}>
          {EQUIPMENT.map((e,i) => (
            <div key={e.num} className="equip-card reveal" style={{ background:"var(--black)", transitionDelay:`${i*0.07}s` }}>
              <div className="equip-card-num">{e.num}</div>
              <h3 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"1.4rem", color:"var(--cream)", letterSpacing:"0.08em", marginBottom:"10px" }}>{e.name}</h3>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", color:"var(--smoke)", lineHeight:1.7 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background:"var(--deep)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", background:"radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ maxWidth:"800px", margin:"0 auto", textAlign:"center" }}>
        <div className="reveal">
          <div className="section-label" style={{ justifyContent:"center" }}>Testimonials</div>
          <h2 className="section-title">What They<br/><span className="gold-text">Say</span></h2>
          <div style={{ display:"flex", justifyContent:"center" }}><div className="gold-line" /></div>
        </div>
        <div className="reveal" style={{ marginTop:"48px", minHeight:"180px" }}>
          <p className="testimonial-quote">{TESTIMONIALS[active].text}</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", marginTop:"36px" }}>
            <img src={TESTIMONIALS[active].avatar} alt={TESTIMONIALS[active].name}
              style={{ width:"48px", height:"48px", borderRadius:"50%", objectFit:"cover", border:"1px solid var(--gold-dk)", filter:"grayscale(30%)" }} />
            <div style={{ textAlign:"left" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"var(--cream)", fontWeight:500 }}>{TESTIMONIALS[active].name}</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--ash)", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:"3px" }}>{TESTIMONIALS[active].role}</div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:"12px", marginTop:"40px" }}>
          {TESTIMONIALS.map((_,i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ width: i===active?"32px":"8px", height:"2px", background: i===active?"var(--gold)":"var(--muted)", border:"none", cursor:"none", transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)", padding:0 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BTS() {
  return (
    <section style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto" }}>
        <div className="reveal" style={{ marginBottom:"60px" }}>
          <div className="section-label">Behind The Scenes</div>
          <h2 className="section-title">On<br/><span className="gold-text">Set</span></h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gridTemplateRows:"auto", gap:"4px" }}>
          {BTS_GALLERY.map((b,i) => (
            <div key={i} className="bts-item reveal"
              style={{ gridColumn: i===1?"span 2":"span 1", height:"280px", transitionDelay:`${i*0.07}s` }}>
              <img src={b.img} alt="Behind the scenes" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name:"", email:"", project:"", message:"" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name:"", email:"", project:"", message:"" });
  };

  return (
    <section id="contact" style={{ padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background:"var(--deep)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:0, top:0, width:"300px", height:"100%", background:"linear-gradient(to bottom, rgba(201,168,76,0.02), transparent, rgba(201,168,76,0.02))", pointerEvents:"none" }} />
      <div style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"80px" }}>
        <div className="reveal-left">
          <div className="section-label">Contact</div>
          <h2 className="section-title">Let's Create<br/>Something<br/><span className="gold-text">Timeless</span></h2>
          <div className="gold-line" />
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"var(--smoke)", lineHeight:1.8, marginBottom:"40px" }}>
            Whether you have a feature film, documentary, commercial project, or a creative vision that needs a dedicated eye — I'd love to hear it.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
            {[["Email","elias@moreau.film"],["WhatsApp","+1 (555) 012 3456"],["Location","Lagos · Nairobi · Paris"]].map(([label,val]) => (
              <div key={label}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold)", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:"4px" }}>{label}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"var(--silk)" }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"12px", marginTop:"36px" }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} className="social-link" title={s.label}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"11px" }}>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="reveal-right">
          {sent ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"400px", gap:"16px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"4rem", color:"var(--gold)", animation:"goldGlow 2s infinite" }}>✓</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:"var(--cream)", fontStyle:"italic" }}>Message Received</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--ash)", letterSpacing:"0.2em" }}>I'll be in touch within 24 hours</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"32px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
                <div>
                  <label style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold)", letterSpacing:"0.3em", display:"block", marginBottom:"8px" }}>YOUR NAME</label>
                  <input className="input-field" placeholder="Full name" value={form.name}
                    onChange={e => setForm(p => ({...p,name:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold)", letterSpacing:"0.3em", display:"block", marginBottom:"8px" }}>EMAIL</label>
                  <input className="input-field" placeholder="your@email.com" type="email" value={form.email}
                    onChange={e => setForm(p => ({...p,email:e.target.value}))} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold)", letterSpacing:"0.3em", display:"block", marginBottom:"8px" }}>PROJECT TYPE</label>
                <input className="input-field" placeholder="Feature Film / Documentary / Commercial..." value={form.project}
                  onChange={e => setForm(p => ({...p,project:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold)", letterSpacing:"0.3em", display:"block", marginBottom:"8px" }}>YOUR VISION</label>
                <textarea className="input-field" rows={4} placeholder="Tell me about your project, timeline, and budget..."
                  value={form.message} onChange={e => setForm(p => ({...p,message:e.target.value}))}
                  style={{ resize:"none", display:"block" }} />
              </div>
              <button className="btn-gold" onClick={handleSubmit} style={{ width:"fit-content" }}>
                <span>Send Message</span>
                <span style={{ position:"relative", zIndex:1 }}>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BookingCTA() {
  return (
    <section style={{ padding:"clamp(80px,10vw,120px) clamp(24px,6vw,80px)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0 }}>
        <img src="https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=1920&q=70" alt="Studio"
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.15) saturate(0.4)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(10,8,0,0.8) 100%)" }} />
      </div>
      <div style={{ position:"relative", zIndex:1, maxWidth:"900px", margin:"0 auto", textAlign:"center" }}>
        <div className="reveal">
          <div className="section-label" style={{ justifyContent:"center" }}>Collaboration</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,6vw,5.5rem)", fontWeight:300, color:"var(--cream)", lineHeight:1.05, marginBottom:"24px" }}>
            Ready to Make<br/>Your <span style={{ color:"var(--gold)", fontStyle:"italic" }}>Vision Real</span>?
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", color:"var(--silk)", lineHeight:1.8, maxWidth:"560px", margin:"0 auto 48px" }}>
            Currently accepting select projects for 2025. Limited availability for feature films and premium commercials.
          </p>
          <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-gold" onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
              <span>Book a Consultation</span>
              <span style={{ position:"relative", zIndex:1 }}>→</span>
            </button>
            <button className="btn-outline">
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", letterSpacing:"0.2em" }}>DOWNLOAD REEL</span>
            </button>
          </div>
          {/* Award badges */}
          <div style={{ display:"flex", justifyContent:"center", gap:"24px", marginTop:"60px", flexWrap:"wrap" }}>
            {["Sundance 2024","TIFF Selection","DIFF Award Winner","Lagos Festival"].map(a => (
              <div key={a} style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", letterSpacing:"0.2em", color:"var(--gold-dk)", padding:"8px 16px", border:"1px solid var(--gold-dk)", textTransform:"uppercase" }}>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding:"40px clamp(24px,6vw,80px)", borderTop:"1px solid var(--muted)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--smoke)", letterSpacing:"0.2em" }}>
        © 2025 ELIAS MOREAU FILMS · ALL RIGHTS RESERVED
      </div>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"var(--gold-dk)", letterSpacing:"0.2em" }}>
        CRAFTED WITH LIGHT
      </div>
    </footer>
  );
}

function VideoModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Simulated video player */}
        <div style={{ width:"100%", height:"100%", background:"var(--charcoal)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
          <img src={item.img} alt={item.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.4 }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
          <div style={{ position:"relative", textAlign:"center" }}>
            <div style={{ width:"80px", height:"80px", borderRadius:"50%", border:"2px solid var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", cursor:"pointer", animation:"float 2s infinite ease-in-out" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--gold)"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"2.5rem", color:"var(--cream)", letterSpacing:"0.08em" }}>{item.title}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"var(--gold)", letterSpacing:"0.3em", marginTop:"8px" }}>TRAILER PREVIEW</div>
          </div>
        </div>
        <button onClick={onClose} style={{ position:"absolute", top:"-44px", right:"0", background:"none", border:"1px solid var(--muted)", color:"var(--cream)", cursor:"none", padding:"8px 16px", fontFamily:"'Space Mono',monospace", fontSize:"10px", letterSpacing:"0.2em" }}>
          ESC / CLOSE
        </button>
      </div>
    </div>
  );
}

/* ─── Main App ─────────────────────────────────────────────────────── */
export default function CinematographerPortfolio() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    let rx = 0, ry = 0, tx = 0, ty = 0;
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = tx+"px"; dotRef.current.style.top = ty+"px"; }
    };
    let raf;
    const loop = () => {
      rx += (tx - rx) * 0.15; ry += (ty - ry) * 0.15;
      if (ringRef.current) { ringRef.current.style.left = rx+"px"; ringRef.current.style.top = ry+"px"; }
      raf = requestAnimationFrame(loop);
    };
    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);
    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("button, a, .portfolio-card, .featured-card, .equip-card, .bts-item").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [loading]);

  // Reveal on scroll
  useReveal();

  return (
    <div style={{ background:"var(--black)", color:"var(--cream)", minHeight:"100vh", overflowX:"hidden" }}>
      <FontLink />
      <div className="grain-overlay" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${hovering?"hovered":""}`} />

      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {!loading && (
        <>
          <Navbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <Hero />
          <About />
          <Skills />
          <Portfolio onPlay={setModal} />
          <Featured onPlay={setModal} />
          <Equipment />
          <Testimonials />
          <BTS />
          <Contact />
          <BookingCTA />
          <Footer />
          {modal && <VideoModal item={modal} onClose={() => setModal(null)} />}
        </>
      )}
    </div>
  );
}
