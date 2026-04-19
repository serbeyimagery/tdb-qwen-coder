import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  BookOpen,
  BookText,
  Library,
  Music,
  Mic2,
  Headphones,
  Volume2,
  Users,
  Mail,
  Heart,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type NavLinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

const readLinks: NavLinkItem[] = [
  { title: 'KJV Bible', href: '/bible', icon: BookOpen, description: 'Read the King James Version Bible' },
  { title: 'Devotional Books', href: '/devotionals', icon: BookText, description: 'Daily devotional readings' },
  { title: 'EGW Books', href: '/egw', icon: Library, description: 'Ellen G. White writings' },
];

const singLinks: NavLinkItem[] = [
  { title: 'SDA Hymns', href: '/hymns', icon: Music, description: 'Seventh-day Adventist Hymnal' },
  { title: 'Scripture Songs', href: '/songs', icon: Mic2, description: 'Songs from Scripture' },
];

const listenLinks: NavLinkItem[] = [
  { title: 'KJV Bible Audio', href: '/listen/bible', icon: Headphones, description: 'Listen to the KJV Bible' },
  { title: 'EGW Books Audio', href: '/listen/egw', icon: Volume2, description: 'Listen to EGW book chapters' },
];

const connectLinks: NavLinkItem[] = [
  { title: 'About', href: '/about', icon: Users, description: 'Learn about The Daily Beloved' },
  { title: 'Contact', href: '/contact', icon: Mail, description: 'Send us a message' },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    width: "auto" as const,
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    width: "3.5rem",
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      when: "afterChildren" as const,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: { opacity: 1, scale: 1, transition: { type: "spring" as const, damping: 15, stiffness: 300, delay: 0.15 } },
};

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isExpanded, setExpanded] = React.useState(true);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const dropdownTimeout = React.useRef<ReturnType<typeof setTimeout>>();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && latest < previous && scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrolled = lastScrollY.current > 10;

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      {/* Desktop Animated Nav */}
      <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 hidden md:block">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.1 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={cn(
            "flex items-center overflow-visible rounded-full border backdrop-blur-xl shadow-lg h-12",
            isHome && !scrolled
              ? "bg-card/70 border-border/50"
              : "bg-card/90 border-border/60",
            !isExpanded ? "cursor-pointer justify-center" : "cursor-default"
          )}
        >
          <motion.div
            className="flex items-center gap-1 px-4"
            style={{ pointerEvents: !isExpanded ? "none" : "auto" }}
          >
            <motion.div variants={itemVariants}>
              <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground px-2.5 py-1 rounded-md transition-colors">
                Home
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-1">
              <NavDropdown label="Read" links={readLinks} open={openDropdown === 'Read'} onEnter={() => handleDropdownEnter('Read')} onLeave={handleDropdownLeave} />
              <NavDropdown label="Sing" links={singLinks} open={openDropdown === 'Sing'} onEnter={() => handleDropdownEnter('Sing')} onLeave={handleDropdownLeave} />
              <NavDropdown label="Listen" links={listenLinks} open={openDropdown === 'Listen'} onEnter={() => handleDropdownEnter('Listen')} onLeave={handleDropdownLeave} />
              <NavDropdown label="Connect" links={connectLinks} open={openDropdown === 'Connect'} onEnter={() => handleDropdownEnter('Connect')} onLeave={handleDropdownLeave} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/donation">
                <Button variant="give" size="sm" className="ml-2">
                  <Heart className="h-4 w-4 mr-1" />
                  Give
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <ThemeToggle />
            </motion.div>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div variants={collapsedIconVariants}>
              <Menu className="w-[22px] h-[22px] text-foreground" />
            </motion.div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden',
        scrolled || !isHome
          ? 'bg-card/90 backdrop-blur-xl border-b shadow-sm'
          : 'bg-transparent'
      )}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className={cn('h-6 w-6', scrolled || !isHome ? 'text-primary' : 'text-hero-text')} />
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className={cn('h-6 w-6', scrolled || !isHome ? 'text-foreground' : 'text-hero-text')} />
              : <Menu className={cn('h-6 w-6', scrolled || !isHome ? 'text-foreground' : 'text-hero-text')} />
            }
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 top-16 bg-card z-[60] overflow-y-auto">
            <nav className="p-6 space-y-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <BookOpen className="h-5 w-5 text-accent" />
                <span className="text-base font-medium text-foreground">Home</span>
              </Link>

              <div className="pt-2 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">Read</p>
                {readLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <link.icon className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">Sing</p>
                {singLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <link.icon className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">Listen</p>
                {listenLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <link.icon className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">Connect</p>
                {connectLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <link.icon className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                  </Link>
                ))}
              </div>

              <Link to="/donation" onClick={() => setMobileOpen(false)}>
                <Button variant="give" className="w-full mt-4">
                  <Heart className="h-4 w-4 mr-1" />
                  Give
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function NavDropdown({ label, links, open, onEnter, onLeave }: { label: string; links: NavLinkItem[]; open: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground px-2.5 py-1 rounded-md transition-colors">
        {label}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card border border-border rounded-xl shadow-xl py-2 min-w-[260px] z-[100]"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <link.icon className="h-5 w-5 text-accent shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">{link.title}</div>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="block text-lg font-medium text-foreground hover:text-accent transition-colors">
      {label}
    </Link>
  );
}

function MobileSection({ title, links, onClose }: { title: string; links: NavLinkItem[]; onClose: () => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-1 mb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <link.icon className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-foreground">{link.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
