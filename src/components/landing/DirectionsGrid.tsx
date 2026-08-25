import { useEffect, useMemo, useRef, useState } from "react";
import { directions } from "@/lib/directions";
import { useIsMobile, useReducedMotion } from "@/hooks/use-reduced-motion";

const CARD_GRADIENT =
  "linear-gradient(to bottom, rgba(3,25,30,0) 40%, rgba(3,25,30,0.6) 62%, rgba(3,25,30,0.9) 82%, rgba(3,25,30,0.97) 100%)";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** Section background star field, drawn in code on a canvas. */
function SectionStars({ count }: { count: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const color =
      getComputedStyle(document.documentElement).getPropertyValue("--text-primary").trim() ||
      "#E6F0EF";

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const clusters = Array.from({ length: Math.floor(rand(5, 7)) }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        spread: rand(w * 0.05, w * 0.12),
      }));
      const clustered = Math.round(count * 0.7);
      const bright = 6;
      const mid = 20;

      for (let i = 0; i < count; i++) {
        let x: number;
        let y: number;
        if (i < clustered) {
          const c = clusters[Math.floor(Math.random() * clusters.length)]!;
          x = c.x + gauss() * c.spread;
          y = c.y + gauss() * c.spread;
        } else {
          x = rand(0, w);
          y = rand(0, h);
        }
        let r = 0.6;
        let opacity = 0.25;
        if (i < bright) {
          r = 1.6;
          opacity = 0.85;
        } else if (i < bright + mid) {
          r = 1.1;
          opacity = 0.5;
        }
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

const PAD = 150;
const STAR_COUNT = 14;

type CardStar = {
  size: number;
  restX: number;
  restY: number;
  delay: number;
  /** fraction along card perimeter */
  t: number;
  gap: number;
};

function buildCardStars(): CardStar[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    // rest position: anywhere in the wrapper but outside the card area
    let restX = 0;
    let restY = 0;
    for (let attempt = 0; attempt < 30; attempt++) {
      restX = rand(0, 1);
      restY = rand(0, 1);
      const insideCard = restX > 0.28 && restX < 0.72 && restY > 0.28 && restY < 0.72;
      if (!insideCard) break;
    }
    return {
      size: rand(3, 5),
      restX,
      restY,
      delay: rand(0, 220),
      t: (i + rand(0.15, 0.85)) / STAR_COUNT,
      gap: rand(10, 18),
    };
  });
}

/** Perimeter position (in wrapper px, wrapper = card + PAD on each side). */
function perimeterPos(star: CardStar, card: number) {
  const gap = star.gap;
  const w = card + gap * 2;
  const h = card + gap * 2;
  const per = 2 * (w + h);
  let d = star.t * per;
  let x = 0;
  let y = 0;
  if (d < w) {
    x = d;
    y = 0;
  } else if ((d -= w) < h) {
    x = w;
    y = d;
  } else if ((d -= h) < w) {
    x = w - d;
    y = h;
  } else {
    d -= w;
    x = 0;
    y = h - d;
  }
  return { x: PAD - gap + x, y: PAD - gap + y };
}

function DirectionCard({
  title,
  desc,
  image,
  starsEnabled,
  liftEnabled,
}: {
  title: string;
  desc: string;
  image: string;
  starsEnabled: boolean;
  liftEnabled: boolean;
}) {
  const [active, setActive] = useState(false);
  const [card, setCard] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stars = useMemo(buildCardStars, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setCard(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative isolate h-[var(--card)] w-[var(--card)]">
      {starsEnabled && card > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0"
          style={{ inset: -PAD }}
        >
          {stars.map((s, i) => {
            const target = perimeterPos(s, card);
            const rest = {
              x: s.restX * (card + PAD * 2),
              y: s.restY * (card + PAD * 2),
            };
            const pos = active ? target : rest;
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: s.size,
                  height: s.size,
                  left: 0,
                  top: 0,
                  backgroundColor: "var(--text-primary)",
                  boxShadow: "0 0 10px 2px rgba(230, 240, 239, 0.45)",
                  opacity: active ? 0.9 : 0.35,
                  transform: `translate3d(${pos.x - s.size / 2}px, ${pos.y - s.size / 2}px, 0)`,
                  transition:
                    "transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transitionDelay: `${active ? s.delay : 220 - s.delay}ms`,
                }}
              />
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => {}}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="group relative z-10 block h-full w-full cursor-pointer overflow-hidden text-left"
        style={{
          borderRadius: 18,
          border: `1px solid ${active ? "color-mix(in srgb, var(--text-accent) 60%, transparent)" : "var(--border)"}`,
          transform: liftEnabled && active ? "translateY(-6px)" : "translateY(0)",
          transition: "transform 300ms ease, border-color 300ms ease",
          outlineOffset: 4,
        }}
      >
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: CARD_GRADIENT }} />
        <div className="absolute inset-x-0 bottom-0" style={{ padding: 24 }}>
          <h3
            className="font-display text-text-primary"
            style={{ fontSize: "clamp(19px, 1.5vw, 27px)", fontWeight: 400, letterSpacing: "0.01em" }}
          >
            {title}
          </h3>
          <p className="text-text-secondary" style={{ fontSize: "clamp(13px, 1vw, 16px)", marginTop: 6 }}>
            {desc}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="dg-arrow absolute text-text-accent"
          style={{ right: 24, bottom: 24, fontSize: 20, lineHeight: 1 }}
        >
          →
        </span>
      </button>
    </div>
  );
}

export function DirectionsGrid() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <section
      id="directions"
      className="relative w-full overflow-hidden bg-bg-page"
      style={{
        paddingTop: "clamp(40px, 5vh, 80px)",
        paddingBottom: "clamp(40px, 5vh, 80px)",
      }}
    >
      <SectionStars count={isMobile ? 45 : 90} />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-[4vw] md:px-6">
        <h2
          className="text-center font-display text-text-primary"
          style={{ fontSize: "clamp(32px, 3.4vw, 64px)", letterSpacing: "0.01em", lineHeight: 1.08 }}
        >
          Шесть систем, один профиль
        </h2>
        <p
          className="mx-auto mt-4 max-w-[760px] text-center text-text-secondary"
          style={{ fontSize: "clamp(16px, 1.2vw, 20px)" }}
        >
          Обычно сервисы считают одну-две системы. Здесь — все шесть, и они видят друг друга
        </p>

        <div className="dg-grid mx-auto" style={{ marginTop: 40 }}>
          {directions.map((d) => (
            <DirectionCard
              key={d.id}
              title={d.title}
              desc={d.desc}
              image={d.image}
              starsEnabled={!isMobile && !reduced}
              liftEnabled={!reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
