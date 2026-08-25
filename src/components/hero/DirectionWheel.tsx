import { useCallback, useEffect, useRef, useState } from "react";
import { directions } from "@/lib/directions";
import { Glyph } from "./Glyph";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const STEP = 60;
const COUNT = directions.length;

type Metrics = { centerX: number; centerY: number; r: number; mobile: boolean };

function computeMetrics(): Metrics {
  const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
  const vh = typeof window === "undefined" ? 900 : window.innerHeight;
  const mobile = vw < 768;
  const r = mobile ? 1.1 * vw : 0.62 * vh;
  const apexY = (mobile ? 0.58 : 0.44) * vh;
  return {
    r,
    centerX: (mobile ? 0.5 : 0.3) * vw,
    centerY: apexY + r,
    mobile,
  };
}

/** wrap into (-180, 180] */
const wrapDeg = (v: number) => {
  let a = ((v % 360) + 360) % 360;
  if (a > 180) a -= 360;
  return a;
};

export function DirectionWheel() {
  const reduced = useReducedMotion();
  const [metrics, setMetrics] = useState<Metrics>(() => computeMetrics());
  const [offset, setOffset] = useState(0);
  const [duration, setDuration] = useState(800);
  const [interacting, setInteracting] = useState(false);
  const drag = useRef<{ active: boolean; lastX: number; moved: boolean }>({
    active: false,
    lastX: 0,
    moved: false,
  });
  const offsetRef = useRef(0);
  offsetRef.current = offset;

  useEffect(() => {
    const onResize = () => setMetrics(computeMetrics());
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // stepped auto-rotation: 4000ms pause, then one 60° step over 800ms
  useEffect(() => {
    if (reduced || interacting) return;
    const id = setInterval(() => {
      setDuration(800);
      setOffset((o) => o - STEP);
    }, 4800);
    return () => clearInterval(id);
  }, [reduced, interacting]);

  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pause = useCallback(() => {
    if (resume.current) clearTimeout(resume.current);
    setInteracting(true);
  }, []);
  const scheduleResume = useCallback(() => {
    if (resume.current) clearTimeout(resume.current);
    resume.current = setTimeout(() => setInteracting(false), 2000);
  }, []);

  const snap = useCallback(() => {
    setDuration(400);
    setOffset((o) => Math.round(o / STEP) * STEP);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX, moved: false };
    pause();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    if (Math.abs(dx) > 1) drag.current.moved = true;
    drag.current.lastX = e.clientX;
    setDuration(0);
    setOffset((o) => o + dx * 0.25);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    snap();
    scheduleResume();
  };

  const activeIndex = (() => {
    let best = 0;
    let bestAbs = Infinity;
    for (let i = 0; i < COUNT; i++) {
      const a = Math.abs(wrapDeg(offsetRef.current + i * STEP));
      if (a < bestAbs) {
        bestAbs = a;
        best = i;
      }
    }
    return best;
  })();

  const { centerX, centerY, r, mobile } = metrics;
  const side = mobile ? "min(70vw, 42vh)" : "min(30vw, 48vh)";
  const glyphSize = `calc(${side} * 0.22)`;

  return (
    <div
      className="absolute inset-0 h-screen w-screen touch-none select-none overflow-hidden"
      onPointerEnter={pause}
      onPointerLeave={() => {
        endDrag();
        scheduleResume();
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* visible orbit line, clipped by the screen edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border"
        style={{
          width: r * 2,
          height: r * 2,
          left: centerX,
          top: centerY,
          transform: "translate(-50%, -50%)",
          borderColor: "var(--border)",
          borderWidth: 1,
          opacity: 0.35,
        }}
      />

      {/* orbit dots, under the cards */}
      {directions.map((d, i) => {
        const angle = offset + i * STEP;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + r * Math.sin(rad);
        const y = centerY - r * Math.cos(rad);
        const isActive = i === activeIndex;
        const size = isActive ? 10 : 8;
        return (
          <div
            key={`dot-${d.id}`}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              backgroundColor: isActive ? "var(--text-accent)" : "var(--surface-2)",
              opacity: isActive ? 1 : 0.6,
              transition: `left ${duration}ms ease-out, top ${duration}ms ease-out, width 400ms ease-out, height 400ms ease-out, background-color 400ms ease-out, opacity 400ms ease-out`,
            }}
          />
        );
      })}

      {directions.map((d, i) => {
        const angle = offset + i * STEP;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + r * Math.sin(rad);
        const y = centerY - r * Math.cos(rad);
        const isActive = i === activeIndex;
        return (
          <div
            key={d.id}
            aria-current={isActive}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%)${isActive ? "" : " scale(0.55)"}`,
              opacity: isActive ? 1 : 0.35,
              filter: isActive ? "none" : "blur(2px)",
              transition: `left ${duration}ms ease-out, top ${duration}ms ease-out, transform 400ms ease-out, opacity 400ms ease-out, filter 400ms ease-out`,
              width: side,
              height: side,
            }}
          >
            <div
              className="bg-surface-1 flex h-full w-full flex-col border"
              style={{
                borderColor: "var(--border)",
                borderRadius: 20,
                padding: 32,
                boxSizing: "border-box",
              }}
            >
              {/* image area: fixed share of the card height, photo goes here later */}
              <div
                className="flex items-center justify-center"
                style={{ height: "58%", flex: "0 0 58%" }}
              >
                <Glyph name={d.id} size={glyphSize} />
              </div>

              <div
                className="flex flex-col justify-end gap-3 text-left"
                style={{ height: "42%", flex: "0 0 42%" }}
              >
                <h2
                  className="font-display text-text-primary leading-tight"
                  style={{ fontSize: "clamp(20px, 1.7vw, 34px)" }}
                >
                  {d.title}
                </h2>
                {isActive && (
                  <>
                    <p
                      className="text-text-secondary leading-snug"
                      style={{ fontSize: "clamp(14px, 1.1vw, 19px)" }}
                    >
                      {d.desc}
                    </p>
                    <button
                      type="button"
                      className="text-text-accent self-start bg-transparent hover:underline"
                      style={{ fontSize: "clamp(14px, 1.1vw, 19px)" }}
                    >
                      Открыть
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
