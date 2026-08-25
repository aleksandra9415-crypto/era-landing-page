import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const INSET = 24;
const GLOW = "0 0 10px 2px rgba(230, 240, 239, 0.4)";

type Star = {
  hx: number;
  hy: number;
  size: number;
  opacity: number;
  glow: boolean;
};

function buildStars(w: number, h: number, count: number): Star[] {
  const clusters = Array.from({ length: Math.floor(rand(6, 8)) }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    spread: rand(w * 0.05, w * 0.12),
  }));
  const clustered = Math.round(count * 0.7);
  const bright = Math.max(1, Math.round(count * (10 / 120)));
  const mid = Math.round(count * (30 / 120));

  return Array.from({ length: count }, (_, i) => {
    let x: number;
    let y: number;
    if (i < clustered) {
      const c = clusters[Math.floor(Math.random() * clusters.length)]!;
      x = Math.min(w, Math.max(0, c.x + gauss() * c.spread));
      y = Math.min(h, Math.max(0, c.y + gauss() * c.spread));
    } else {
      x = rand(0, w);
      y = rand(0, h);
    }
    let size = 2;
    let opacity = 0.3;
    let glow = false;
    if (i < bright) {
      size = 5;
      opacity = 0.9;
      glow = true;
    } else if (i < bright + mid) {
      size = 3.5;
      opacity = 0.6;
      glow = true;
    }
    return { hx: x, hy: y, size, opacity, glow };
  });
}

type Rect = { x: number; y: number; w: number; h: number };

/** Points evenly distributed along the perimeter of a rect inset by INSET. */
function perimeterPoints(rect: Rect, n: number) {
  const x0 = rect.x + INSET;
  const y0 = rect.y + INSET;
  const w = Math.max(1, rect.w - INSET * 2);
  const h = Math.max(1, rect.h - INSET * 2);
  const per = 2 * (w + h);
  return Array.from({ length: n }, (_, i) => {
    let d = (i / n) * per;
    if (d < w) return { x: x0 + d, y: y0 };
    d -= w;
    if (d < h) return { x: x0 + w, y: y0 + d };
    d -= h;
    if (d < w) return { x: x0 + w - d, y: y0 + h };
    d -= w;
    return { x: x0, y: y0 + h - d };
  });
}

type Flight = { x: number; y: number; delay: number; back: number };

export function DirectionsGrid() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const animate = !isMobile && !reduced;

  const fieldRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [flights, setFlights] = useState<Map<number, Flight> | null>(null);
  const [returning, setReturning] = useState<Map<number, Flight> | null>(null);
  const [willChange, setWillChange] = useState(false);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stars = useMemo(() => {
    if (!size || !size.w || !size.h) return [];
    return buildStars(size.w, size.h, isMobile ? 55 : 120);
  }, [size, isMobile]);

  const computeFlights = useCallback(
    (index: number) => {
      const field = fieldRef.current;
      const card = cardRefs.current[index];
      if (!field || !card || stars.length === 0) return null;
      const fb = field.getBoundingClientRect();
      const cb = card.getBoundingClientRect();
      const rect: Rect = { x: cb.left - fb.left, y: cb.top - fb.top, w: cb.width, h: cb.height };
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;

      const scored = stars.map((s, i) => ({
        i,
        d: Math.hypot(s.hx - cx, s.hy - cy),
        a: Math.atan2(s.hy - cy, s.hx - cx),
      }));
      scored.sort((p, q) => p.d - q.d);
      const chosen = scored.slice(0, Math.round(scored.length * 0.6));
      const maxD = Math.max(...chosen.map((c) => c.d), 1);

      const byAngle = [...chosen].sort((p, q) => p.a - q.a);
      const points = perimeterPoints(rect, byAngle.length);

      const map = new Map<number, Flight>();
      byAngle.forEach((c, k) => {
        const p = points[k]!;
        const ratio = c.d / maxD;
        map.set(c.i, {
          x: p.x,
          y: p.y,
          delay: (1 - ratio) * 240,
          back: ratio * 240,
        });
      });
      return map;
    },
    [stars],
  );

  const onEnter = (index: number) => {
    setHovered(index);
    if (!animate) return;
    if (returnTimer.current) clearTimeout(returnTimer.current);
    setWillChange(true);
    setReturning(null);
    setFlights(computeFlights(index));
  };

  const onLeave = () => {
    setHovered(null);
    if (!animate) return;
    setReturning(flights);
    setFlights(null);
    if (returnTimer.current) clearTimeout(returnTimer.current);
    returnTimer.current = setTimeout(() => setWillChange(false), 1000);
  };

  useEffect(() => () => returnTimer.current && clearTimeout(returnTimer.current), []);

  return (
    <section
      id="directions"
      className="relative w-full overflow-hidden bg-bg-page"
      style={{
        paddingTop: "clamp(40px, 5vh, 80px)",
        paddingBottom: "clamp(40px, 5vh, 80px)",
      }}
    >
      <div ref={fieldRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {stars.map((s, i) => {
          const f = flights?.get(i);
          const x = (f ? f.x : s.hx) - s.size / 2;
          const y = (f ? f.y : s.hy) - s.size / 2;
          return (
            <span
              key={i}
              className="absolute left-0 top-0 rounded-full"
              style={{
                width: s.size,
                height: s.size,
                backgroundColor: "var(--text-primary)",
                boxShadow: s.glow ? GLOW : undefined,
                opacity: f ? 0 : s.opacity,
                transform: `translate3d(${x}px, ${y}px, 0)`,
                willChange: willChange ? "transform" : undefined,
                transition: animate
                  ? f
                    ? `transform 700ms ${EASE} ${f.delay}ms, opacity 240ms ease-in ${f.delay + 460}ms`
                    : `transform 700ms ${EASE} ${returning?.get(i)?.back ?? 0}ms, opacity 300ms ease 0ms`
                  : "none",
              }}
            />
          );
        })}
      </div>

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
          {directions.map((d, i) => (
            <div
              key={d.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="relative h-[var(--card)] w-[var(--card)]"
            >
              <button
                type="button"
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
                onFocus={() => onEnter(i)}
                onBlur={onLeave}
                className="group relative block h-full w-full cursor-pointer overflow-hidden text-left"
                style={{
                  borderRadius: 18,
                  border: `1px solid ${hovered === i ? "rgba(255, 255, 255, 0.95)" : "var(--border)"}`,
                  boxShadow:
                    hovered === i && !reduced
                      ? "0 0 26px rgba(230, 240, 239, 0.3), inset 0 0 14px rgba(230, 240, 239, 0.08)"
                      : "none",
                  transform: !reduced && hovered === i ? "translateY(-6px)" : "translateY(0)",
                  transition: reduced
                    ? "none"
                    : hovered === i
                      ? "transform 300ms ease, border-color 480ms ease-out 560ms, box-shadow 560ms ease-out 560ms"
                      : "transform 300ms ease, border-color 400ms ease-out, box-shadow 400ms ease-out",
                  outlineOffset: 4,
                }}
              >
                <img
                  src={d.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: CARD_GRADIENT }} />
                <div className="absolute inset-x-0 bottom-0" style={{ padding: 24 }}>
                  <h3
                    className="font-display text-text-primary"
                    style={{
                      fontSize: "clamp(19px, 1.5vw, 27px)",
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {d.title}
                  </h3>
                  <p
                    className="text-text-secondary"
                    style={{ fontSize: "clamp(13px, 1vw, 16px)", marginTop: 6 }}
                  >
                    {d.desc}
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
          ))}
        </div>
      </div>
    </section>
  );
}
