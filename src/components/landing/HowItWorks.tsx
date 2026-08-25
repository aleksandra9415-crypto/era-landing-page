import { useState, type KeyboardEvent, useRef } from "react";
import cardBack from "@/assets/card-back.jpg.asset.json";
import face1 from "@/assets/step-1.jpg.asset.json";
import face2 from "@/assets/step-2.jpg.asset.json";
import face3 from "@/assets/step-3.jpg.asset.json";
import { Section } from "./Section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";


const STEPS = [
  {
    numeral: "I",
    title: "ТОЧКА",
    face: face1.url,
    flips: false,
    tilt: -2.5,
    text: "Ты вводишь дату, время и место рождения",
  },
  {
    numeral: "II",
    title: "РАСЧЁТ",
    face: face2.url,
    flips: true,
    tilt: 0,
    text: "Шесть систем считают тебя независимо друг от друга",
  },
  {
    numeral: "III",
    title: "РАЗБОР",
    face: face3.url,
    flips: true,
    tilt: 2.5,
    text: "Ты получаешь один текст, в котором они сходятся",
  },
];

const FACE_GRADIENT =
  "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.82) 72%, rgba(0,0,0,0.95) 100%)";

function TarotCard({ step }: { step: (typeof STEPS)[number] }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const flipped = !step.flips || pinned || hovered;

  const toggle = () => {
    if (!step.flips) return;
    setPinned((p) => !p);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!step.flips) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className="tarot-wrap"
      style={{ ["--tilt" as string]: `${step.tilt}deg` }}
    >
      <div
        className={`tarot-card${flipped ? " is-flipped" : ""}`}
        role={step.flips ? "button" : undefined}
        tabIndex={step.flips ? 0 : undefined}
        aria-expanded={step.flips ? flipped : undefined}
        aria-label={step.flips ? `${step.title}: ${step.text}` : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        {/* Back */}
        <div className="tarot-side tarot-back">
          <img
            src={cardBack.url}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            className="pointer-events-none absolute rounded-[8px]"
            style={{
              inset: 10,
              border: "1px solid color-mix(in srgb, var(--border) 40%, transparent)",
            }}
          />
        </div>

        {/* Face */}
        <div className="tarot-side tarot-face">
          <img
            src={step.face}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            className="pointer-events-none absolute inset-0"
            style={{ background: FACE_GRADIENT }}
          />
          <span
            className="pointer-events-none absolute rounded-[8px]"
            style={{
              inset: 10,
              border:
                "1px solid color-mix(in srgb, var(--text-accent) 45%, transparent)",
            }}
          />

          <div className="relative flex h-full flex-col items-center justify-between">
            <span
              className="font-display text-text-accent"
              style={{
                marginTop: 26,
                fontSize: "clamp(20px, 1.6vw, 28px)",
                letterSpacing: "0.14em",
              }}
            >
              {step.numeral}
            </span>

            <div
              className="flex w-full flex-col items-center"
              style={{ paddingBottom: 26, paddingLeft: 22, paddingRight: 22 }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: 40,
                  height: 1,
                  marginBottom: 12,
                  background: "var(--text-accent)",
                  opacity: 0.5,
                }}
              />
              <h3
                className="text-center font-display text-text-primary"
                style={{
                  fontSize: "clamp(20px, 1.7vw, 30px)",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-center text-text-secondary"
                style={{ marginTop: 10, fontSize: "clamp(13px, 0.95vw, 15px)" }}
              >
                {step.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <Section
      id="how"
      title="Три шага"
      subtitle="Как устроен путь от даты рождения до разбора"
    >
      <div
        className="mt-12 flex flex-col items-center justify-center md:flex-row md:items-start"
        style={{ gap: "clamp(24px, 3vw, 56px)" }}
      >
        {STEPS.map((s) => (
          <TarotCard key={s.title} step={s} />
        ))}
      </div>
    </Section>
  );
}
