import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookOpen, Headphones, ArrowRight, Sparkles, Megaphone, CalendarDays, Bell } from 'lucide-react';
import { GlowingCard } from '@/components/GlowingCard';
import StaggerTestimonials from '@/components/StaggerTestimonials';
import { LampContainer } from '@/components/ui/LampContainer';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const underlineRef = useRef<HTMLSpanElement>(null);

  const [verse, setVerse] = useState({ text: '"The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters."', ref: 'Psalm 23:1-2 (KJV)' });
  const [announcements, setAnnouncements] = useState<Array<{ id: string; title: string; body: string; created_at: string }>>([]);

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
      {/* Hero Section with Lamp Effect */}
      <LampContainer>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="text-center max-w-4xl mx-auto px-6"
        >
          {/* Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-xl" style={{
              borderColor: 'rgba(127,154,131,0.3)',
              background: 'linear-gradient(to right, rgba(127,154,131,0.2), rgba(127,154,131,0.1), rgba(127,154,131,0.2))',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full" style={{ background: 'hsl(var(--accent))' }} />
                <span className="absolute inset-0 rounded-full" style={{ background: 'hsl(var(--accent))', animation: 'ping-ring 1.2s cubic-bezier(0,0,.2,1) infinite' }} />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'hsl(var(--accent))' }}>
                THE DAILY BELOVED
              </span>
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full" style={{ background: 'hsl(var(--accent))' }} />
                <span className="absolute inset-0 rounded-full" style={{ background: 'hsl(var(--accent))', animation: 'ping-ring 1.2s cubic-bezier(0,0,.2,1) infinite 0.5s' }} />
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-serif select-none" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.88 }}>
              <span className="block font-light mb-2" style={{ fontSize: 'clamp(2.25rem, 6vw, 7rem)', color: 'hsl(var(--hero-text) / 0.7)' }}>
                Begin with
              </span>
              <span className="block relative">
                <span className="relative z-10 font-black" style={{
                  background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--hero-text)), hsl(140 20% 45%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  His Word
                </span>
                <span className="absolute inset-0 font-black pointer-events-none" aria-hidden="true" style={{
                  background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--hero-text)), hsl(140 20% 45%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'blur(28px)',
                  opacity: 0.5,
                  transform: 'scale(1.06)'
                }}>
                  His Word
                </span>
                <span ref={underlineRef} className="absolute left-0 rounded-full" style={{
                  bottom: '-1.4rem',
                  height: '0.72rem',
                  width: 0,
                  background: 'linear-gradient(to right, hsl(var(--accent)), hsl(var(--accent) / 0.75), transparent)',
                  boxShadow: '0 0 22px hsl(var(--accent) / 0.5)'
                }} />
              </span>
            </h1>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto mb-10">
            <p className="text-lg font-medium mb-3" style={{ color: 'hsl(var(--hero-text) / 0.7)' }}>
              Start every morning with{' '}
              <span className="font-semibold px-2 py-1 rounded" style={{
                color: 'hsl(var(--hero-text))',
                background: 'linear-gradient(to right, hsl(var(--accent) / 0.2), hsl(var(--accent) / 0.1))'
              }}>
                Spirit-filled devotions
              </span>
            </p>
            <p className="text-base" style={{ color: 'hsl(var(--hero-text) / 0.6)', lineHeight: 1.65 }}>
              Deepen your walk with God through daily Bible readings, Ellen White
              insights, hymns, and scripture songs — all in one place.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/bible">
              <Button size="lg" className="group relative overflow-hidden font-semibold text-base px-8 py-6" style={{
                background: 'linear-gradient(to right, hsl(var(--accent)), hsl(140 15% 45%))',
                color: 'hsl(var(--hero-bg))',
                borderColor: 'hsl(var(--accent) / 0.3)',
                boxShadow: '0 10px 35px rgba(0,0,0,0.25)'
              }}>
                <BookOpen className="h-5 w-5 mr-2" />
                Start Reading
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/listen/bible">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 backdrop-blur-lg" style={{
                border: '2px solid hsl(var(--hero-text) / 0.15)',
                background: 'hsl(var(--hero-bg) / 0.6)',
                color: 'hsl(var(--hero-text))',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
              }}>
                <Headphones className="h-5 w-5 mr-2" />
                Listen Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </LampContainer>

      {/* Word for Today - Glowing Card */}
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

      {/* Announcements & Updates Section */}
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

      {/* Testimonies */}
      <StaggerTestimonials />

      {/* Donation CTA */}
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
