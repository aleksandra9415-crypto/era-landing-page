import { useCallback, useEffect, useRef, useState } from "react";
import { DIRECTIONS } from "@/lib/directions";
import { Glyph } from "./Glyph";
import { useIsMobile, useReducedMotion } from "@/hooks/use-reduced-motion";

const COUNT = DIRECTIONS.length;

export function DirectionRing() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const step = isMobile ? 36 : 60;
  const diameter = isMobile ? 320 : 480;
  const radius = diameter / 2;

  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const rotationRef = useRef(0);
  const dragRef = useRef<{ active: boolean; lastX: number }>({ active: false, lastX: 0 });

  rotationRef.current = rotation;

  // idle auto-rotation: full turn in 60s
  useEffect(() => {
    if (reduced || paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotation((r) => r + dt * 6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, paused]);

  /** continuous slot position; 0 = active (top of the ring/arc) */
  const pos = rotationRef.current / step;
  /** wrap an offset into (-COUNT/2, COUNT/2] so items spread evenly around */
  const wrapOffset = (v: number) => {
    let o = ((v % COUNT) + COUNT) % COUNT;
    if (o > COUNT / 2) o -= COUNT;
    return o;
  };
  const activeIndex = ((Math.round(-pos) % COUNT) + COUNT) % COUNT;
  const active = DIRECTIONS[activeIndex]!;

  const snapTo = useCallback(
    (index: number) => {
      setRotation((r) => {
        const target = -index * step;
        const period = COUNT * step;
        const turns = Math.round((r - target) / period);
        return target + turns * period;
      });
    },
    [step],
  );


  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, lastX: e.clientX };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX = e.clientX;
    setRotation((r) => r + dx * 0.4);
  };
  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    snapTo(((Math.round(-rotationRef.current / step) % COUNT) + COUNT * 10) % COUNT);
  };

  return (
    <div
      className="relative touch-none select-none"
      style={{ width: diameter, height: isMobile ? radius + 88 : diameter }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        onPointerUp();
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* breathing glow */}
      <div
        aria-hidden="true"
        className="ring-glow pointer-events-none absolute"
        style={{
          width: diameter * 1.2,
          height: diameter * 1.2,
          left: "50%",
          top: isMobile ? radius : "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* items */}
      {DIRECTIONS.map((d, i) => {
        const angle = (-90 + i * step + rotation) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = i === activeIndex;
        const size = isActive ? 88 : 72;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => snapTo(i)}
            aria-label={d.title}
            aria-current={isActive}
            className="absolute flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300"
            style={{
              width: size,
              height: size,
              left: `calc(50% + ${x}px)`,
              top: isMobile ? radius + y : `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              backgroundColor: isActive ? "var(--surface-2)" : "var(--surface-1)",
              borderColor: isActive ? "var(--text-accent)" : "var(--border)",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            <Glyph name={d.glyph} size={isActive ? 34 : 28} />
          </button>
        );
      })}

      {/* center card */}
      <div
        className="absolute flex w-[260px] flex-col items-center gap-3 text-center"
        style={{
          left: "50%",
          top: isMobile ? radius : "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2
          className="font-display text-text-primary leading-tight"
          style={{ fontSize: isMobile ? 20 : 28 }}
        >
          {active.title}
        </h2>
        <p className="text-text-secondary text-[15px] leading-snug">{active.description}</p>
        <button
          type="button"
          className="bg-accent rounded-lg px-5 py-2.5 text-[14px] text-white transition-opacity hover:opacity-90"
        >
          Открыть
        </button>
      </div>
    </div>
  );
}
