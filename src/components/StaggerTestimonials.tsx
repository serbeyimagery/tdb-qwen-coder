import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_TESTIMONIALS = [
  { id: 0, text: "This app has transformed my morning devotional time. I start every day with God's Word now.", by: "Maria S., Church Member", img: "https://i.pravatar.cc/150?img=1" },
  { id: 1, text: "Having the hymns and Bible in one place is such a blessing. Thank you for making this free for everyone.", by: "James K., Elder", img: "https://i.pravatar.cc/150?img=2" },
  { id: 2, text: "I've been searching for a devotional app like this for years. So glad I finally found one!", by: "Sarah M., Youth Leader", img: "https://i.pravatar.cc/150?img=3" },
  { id: 3, text: "The Ellen White writings section is beautifully organized. Makes my study time so much richer.", by: "Pastor Daniel R.", img: "https://i.pravatar.cc/150?img=4" },
  { id: 4, text: "I listen to the audio Bible every morning during my commute. It's changed my spiritual life.", by: "Grace L., Teacher", img: "https://i.pravatar.cc/150?img=5" },
  { id: 5, text: "Our whole family uses this for evening worship. The hymns feature is our favorite!", by: "The Thompson Family", img: "https://i.pravatar.cc/150?img=6" },
  { id: 6, text: "Simple, beautiful, and Spirit-filled. Exactly what I needed.", by: "Ruth A., Missionary", img: "https://i.pravatar.cc/150?img=7" },
  { id: 7, text: "The daily devotionals keep me grounded in faith throughout the week.", by: "Michael P., Deacon", img: "https://i.pravatar.cc/150?img=8" },
  { id: 8, text: "I love the Scripture Songs section. It helps me memorize Bible verses through music.", by: "Anna W., Music Director", img: "https://i.pravatar.cc/150?img=9" },
  { id: 9, text: "This is the most comprehensive SDA resource I've found online. God bless the team!", by: "David H., Bible Worker", img: "https://i.pravatar.cc/150?img=10" },
];

const SQRT_5000 = Math.sqrt(5000);

interface Testimonial {
  id: number;
  tempId: number;
  text: string;
  by: string;
  img: string;
}

function TestimonialCard({
  position,
  testimonial,
  handleMove,
  cardSize,
}: {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}) {
  const isCenter = position === 0;

  const translateX = (cardSize / 1.5) * position;
  const translateY = isCenter ? -65 : position % 2 ? 15 : -15;
  const rotate = isCenter ? 0 : position % 2 ? 2.5 : -2.5;

  return (
    <div
      onClick={() => handleMove(position)}
      className="absolute border-2 p-8 cursor-pointer transition-all duration-500 ease-in-out hover:scale-[1.02]"
      style={{
        width: cardSize,
        height: cardSize,
        left: "50%",
        top: "50%",
        zIndex: isCenter ? 10 : 0,
        background: isCenter ? "hsl(var(--primary))" : "hsl(var(--card))",
        borderColor: isCenter ? "hsl(var(--primary))" : "hsl(var(--border))",
        color: isCenter ? "hsl(var(--primary-foreground))" : "hsl(var(--card-foreground))",
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block"
        style={{
          transformOrigin: "top right",
          transform: "rotate(45deg)",
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          background: "hsl(var(--border))",
        }}
      />

      <img
        src={testimonial.img}
        alt={testimonial.by.split(",")[0]}
        className="block mb-4 w-12 h-14 object-cover object-top shadow-[3px_3px_0px_hsl(var(--background))]"
        style={{ background: "hsl(var(--muted))" }}
      />

      <h3
        className="font-medium leading-relaxed font-serif"
        style={{
          fontSize: cardSize < 340 ? "0.9rem" : "1.1rem",
          color: isCenter ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
        }}
      >
        &ldquo;{testimonial.text}&rdquo;
      </h3>

      <p
        className="absolute bottom-8 left-8 right-8 mt-2 text-xs italic"
        style={{
          color: isCenter ? "hsla(var(--primary-foreground) / 0.75)" : "hsl(var(--muted-foreground))",
        }}
      >
        — {testimonial.by}
      </p>
    </div>
  );
}

function NavBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center w-14 h-14 text-2xl border-2 transition-colors duration-200"
      style={{
        borderColor: "hsl(var(--border))",
        background: hovered ? "hsl(var(--primary))" : "hsl(var(--background))",
        color: hovered ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
      }}
    >
      {children}
    </button>
  );
}

export default function StaggerTestimonials() {
  const [list, setList] = useState<Testimonial[]>(() =>
    BASE_TESTIMONIALS.map((t) => ({ ...t, tempId: t.id }))
  );
  const [cardSize, setCardSize] = useState(365);

  useEffect(() => {
    const update = () =>
      setCardSize(window.matchMedia("(min-width: 640px)").matches ? 365 : 290);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMove = (steps: number) => {
    setList((prev) => {
      const next = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift();
          if (!item) return prev;
          next.push({ ...item, tempId: Math.random() });
        }
      } else if (steps < 0) {
        for (let i = steps; i < 0; i++) {
          const item = next.pop();
          if (!item) return prev;
          next.unshift({ ...item, tempId: Math.random() });
        }
      }
      return next;
    });
  };

  const half = list.length % 2 ? (list.length + 1) / 2 : list.length / 2;

  return (
    <section className="py-20">
      <div className="text-center max-w-xl mx-auto mb-8 px-4">
        <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-4 text-foreground">
          Testimonies
        </h2>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Click any card to bring it to the center, or use the arrows to cycle through testimonies.
        </p>
      </div>

      <div className="relative w-full h-[600px] overflow-hidden bg-muted/30">
        {list.map((t, index) => {
          const position = index - half;
          return (
            <TestimonialCard
              key={t.tempId}
              testimonial={t}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <NavBtn onClick={() => handleMove(-1)} label="Previous">
            <ChevronLeft className="w-5 h-5" />
          </NavBtn>
          <NavBtn onClick={() => handleMove(1)} label="Next">
            <ChevronRight className="w-5 h-5" />
          </NavBtn>
        </div>
      </div>
    </section>
  );
}
