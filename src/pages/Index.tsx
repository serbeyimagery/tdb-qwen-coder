import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookOpen, Headphones, ArrowRight, Sparkles, Megaphone, CalendarDays, Bell } from 'lucide-react';
import { GlowingCard } from '@/components/GlowingCard';
import StaggerTestimonials from '@/components/StaggerTestimonials';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const underlineRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const spotlightOrbRef = useRef<HTMLDivElement>(null);
  const spotlightAmbientRef = useRef<HTMLDivElement>(null);
  const bibleContainerRef = useRef<HTMLDivElement>(null);
  
  const [verse, setVerse] = useState({ text: '"The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters."', ref: 'Psalm 23:1-2 (KJV)' });
  const [announcements, setAnnouncements] = useState<Array<{ id: string; title: string; body: string; created_at: string }>>([]);
  
  useEffect(() => {
    const hero = heroRef.current;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const orb = spotlightOrbRef.current;
    const ambient = spotlightAmbientRef.current;
    const bibleContainer = bibleContainerRef.current;

    if (!hero || !dot || !ring || !orb || !ambient) return;

    let moving = false;
    let mTimer: NodeJS.Timeout | null = null;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let bibleRotX = 0;
    let bibleRotY = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      ring.style.left = mx + 'px';
      ring.style.top = my + 'px';
      
      const rect = hero.getBoundingClientRect();
      orb.style.left = (mx - rect.left) + 'px';
      orb.style.top = (my - rect.top) + 'px';
      ambient.style.left = (mx - rect.left) + 'px';
      ambient.style.top = (my - rect.top) + 'px';
      
      if (bibleContainer) {
        const bibleRect = bibleContainer.getBoundingClientRect();
        const bibleCenterX = bibleRect.left + bibleRect.width / 2;
        const bibleCenterY = bibleRect.top + bibleRect.height / 2;
        
        const targetRotY = ((mx - bibleCenterX) / (window.innerWidth / 2)) * 0.5;
        const targetRotX = -((my - bibleCenterY) / (window.innerHeight / 2)) * 0.3;
        
        bibleRotX = bibleRotX * 0.95 + targetRotX * 0.05;
        bibleRotY = bibleRotY * 0.95 + targetRotY * 0.05;
        
        bibleContainer.style.transform = `translateY(-50%) rotateX(${bibleRotX}deg) rotateY(${bibleRotY - 25}deg)`;
      }
      
      if (!moving) {
        moving = true;
        orb.classList.add('is-moving');
        ring.classList.add('moving');
      }
      
      if (mTimer) clearTimeout(mTimer);
      mTimer = setTimeout(() => {
        moving = false;
        orb.classList.remove('is-moving');
        ring.classList.remove('moving');
      }, 150);
    };

    const onEnter = () => {
      dot.classList.add('visible');
      ring.classList.add('visible');
      orb.style.opacity = '1';
      ambient.style.opacity = '1';
    };
    
    const onLeave = () => {
      dot.classList.remove('visible');
      ring.classList.remove('visible');
      orb.style.opacity = '0';
      ambient.style.opacity = '0';
    };

    hero.addEventListener('mouseenter', onEnter);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousemove', onMove);

    return () => {
      hero.removeEventListener('mouseenter', onEnter);
      hero.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      container.appendChild(p);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
      const { data: seedRow } = await supabase.from('promise_seeds').select('seed').eq('year', now.getFullYear()).maybeSingle();
      const { data: promises } = await supabase.from('bible_promises').select('id, scripture_ref, kjv_verse').order('day_of_year');
      if (seedRow?.seed && promises?.length) {
        let s = seedRow.seed;
        const rng = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
        const arr = [...promises];
        for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
        const today = arr[(dayOfYear - 1) % arr.length];
        if (today) setVerse({ text: `"${today.kjv_verse}"`, ref: today.scripture_ref });
      }
    })();

    supabase.from('announcements').select('id, title, body, created_at').eq('is_active', true).order('created_at', { ascending: false }).limit(3).then(({ data }) => {
      if (data?.length) setAnnouncements(data);
    });
  }, []);

  const staticAnnouncements = [
    { id: 's1', title: 'New Devotional Series Coming Soon', body: "We're excited to announce a new 30-day devotional series focused on the book of Psalms. Stay tuned for the launch date!", created_at: '2026-04-10' },
    { id: 's2', title: 'Audio Bible Now Available', body: 'Listen to the entire KJV Bible with our new audio feature. Perfect for your morning commute or evening devotion time.', created_at: '2026-04-05' },
    { id: 's3', title: 'Community Prayer Request Feature', body: "We're working on a new community prayer request feature where believers can share and pray for one another. Coming Q3 2026.", created_at: '2026-03-28' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (underlineRef.current) {
        underlineRef.current.style.animation = 'underlineExpand 1.5s cubic-bezier(.16,1,.3,1) forwards';
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <section id="hero" ref={heroRef}>
        <div className="spotlight-bg">
          <div className="spotlight-orb is-moving" id="sOrb" ref={spotlightOrbRef}></div>
          <div className="spotlight-ambient" id="sAmbient" ref={spotlightAmbientRef}></div>
        </div>

        <div className="cursor-dot" id="cDot" ref={cursorDotRef}></div>
        <div className="cursor-ring" id="cRing" ref={cursorRingRef}></div>

        <div id="canvas-container">
          <div className="bible-3d" ref={bibleContainerRef}>
            <div className="bible-front">
              <span className="bible-title">HOLY BIBLE</span>
              <span className="bible-subtitle">King James Version</span>
            </div>
            <div className="bible-back"></div>
            <div className="bible-spine"></div>
            <div className="bible-pages"></div>
          </div>
        </div>

        <div id="particles"></div>

        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-dot">
              <span className="badge-dot-inner"></span>
              <span className="badge-dot-ring"></span>
            </span>
            <span className="badge-label">THE DAILY BELOVED</span>
            <span className="badge-dot">
              <span className="badge-dot-inner"></span>
              <span className="badge-dot-ring delay"></span>
            </span>
          </div>

          <div className="hero-heading">
            <span className="begin">Begin with</span>
            <span className="his-word">His Word</span>
            <span className="his-word-underline"></span>
          </div>

          <div className="hero-desc">
            <p className="line1">
              Start every morning with{' '}
              <span className="highlight">Spirit-filled devotions</span>
            </p>
            <p className="line2">
              Deepen your walk with God through daily Bible readings, Ellen White
              insights, hymns, and scripture songs — all in one place.
            </p>
          </div>

          <div className="hero-buttons">
            <Link to="/bible">
              <button className="btn-primary">
                <BookOpen className="h-4 w-4" />
                Start Reading
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/listen/bible">
              <button className="btn-secondary">
                <Headphones className="h-4 w-4" />
                Listen Now
              </button>
            </Link>
          </div>
        </div>

        <div className="scripture-right">
          <p>"All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness."</p>
          <span>— 2 Timothy 3:16</span>
        </div>

        <div className="hint">Drag to rotate • Scroll to zoom</div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl flex items-center justify-center">
          <GlowingCard>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="h-5 w-5" style={{ color: 'hsl(var(--accent))' }} />
                <h2 className="font-serif text-xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Word for Today</h2>
              </div>
              <blockquote className="font-serif text-base sm:text-lg leading-relaxed mb-4 italic" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
                {verse.text}
              </blockquote>
              <p className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--accent))' }}>— {verse.ref}</p>
              <Link to="/bible" className="inline-flex items-center gap-1 text-sm hover:underline" style={{ color: 'hsl(var(--accent))' }}>
                Read in context <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </GlowingCard>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-center mb-12 text-foreground">
            ANNOUNCEMENTS & UPDATES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(announcements.length ? announcements : staticAnnouncements).map((a, i) => {
              const IconComp = [Megaphone, CalendarDays, Bell][i % 3];
              return (
                <div key={a.id || i} className="bg-card rounded-xl p-6 shadow-sm border hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComp className="h-5 w-5 text-accent" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update</span>
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{a.body}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <StaggerTestimonials />

      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-4">
            Enjoying This App?
          </h2>
          <p className="text-primary-foreground/70 mb-8">
            Keep it free for everyone. Your support helps maintain the servers,
            add new content, and reach more hearts.
          </p>
          <Link to="/donation">
            <Button size="lg" variant="give" className="text-base px-8 py-6">
              Donate Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
