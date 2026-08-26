import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { CursorStarField } from "@/components/common/CursorStarField";
import { Grain } from "@/components/hero/Grain";
import { OrbitStage } from "@/components/quick-calc/Orbits";
import { ARC_H, arcTransitionStyle } from "@/components/common/ArcTransition";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MONTHS, isValidDate } from "@/lib/arcana";
import { lifePath, lifePathNumber, pythagoras, squareLabels } from "@/lib/numerology";
import numerologyAsset from "@/assets/numerology.png.asset.json";

const TITLE = "Нумерология по дате рождения: расчёт числа судьбы — Моя Эра";
const DESCRIPTION =
  "Бесплатный расчёт числа жизненного пути и квадрата Пифагора по дате рождения. С объяснением, как считается каждая цифра.";

export const Route = createFileRoute("/numerologiya")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://destiny-canvas-arc.lovable.app/numerologiya" }],
  }),
  component: NumerologiyaPage,
});

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const selectClass =
  "qc-focus h-14 w-full appearance-none rounded-[12px] border border-border bg-surface-1 px-4 pr-10 text-[17px] text-text-primary transition-colors focus:border-text-accent";

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-text-secondary"
    >
      <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function NumerologiyaPage() {
  const reduced = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: currentYear - 1930 + 1 }, (_, i) => currentYear - i),
    [currentYear],
  );

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [stage, setStage] = useState<"form" | "loading" | "result">("form");
  const [result, setResult] = useState<{
    path: number;
    counts: Record<number, number>;
  } | null>(null);
  const [fast, setFast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (slowTimer.current) clearTimeout(slowTimer.current);
    },
    [],
  );

  const complete = day !== "" && month !== "" && year !== "";
  const dateInvalid = complete && !isValidDate(Number(day), Number(month), Number(year));

  const handleSubmit = () => {
    if (!complete || dateInvalid) return;
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    const path = lifePathNumber(d, m, y);
    const { counts } = pythagoras(d, m, y);
    setStage("loading");
    if (!reduced) setFast(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setResult({ path, counts });
        setStage("result");
        if (slowTimer.current) clearTimeout(slowTimer.current);
        slowTimer.current = setTimeout(() => setFast(false), 100);
        aboutRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
      },
      reduced ? 200 : 700,
    );
  };

  const card = result ? lifePath.find((x) => x.n === result.path) : null;

  return (
    <main className="relative w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <section className="ms-hero -mt-[110px] w-full">
        <img
          src={numerologyAsset.url}
          alt="Нумерология — расчёт по дате рождения"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />

        <div aria-hidden="true" className="ms-hero-shade z-[1]" />

        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute bottom-0 left-0 right-0 z-[2]"
        />

        <CursorStarField count={70} opacity={0.6} className="z-[3]" />

        <Grain />

        <div className="ms-hero-content">
          <div className="ms-hero-text">
            <h1
              className="font-display text-text-primary"
              style={{ fontSize: "clamp(34px, 3.8vw, 68px)", lineHeight: 1.1 }}
            >
              Нумерология <span className="whitespace-nowrap">по дате рождения</span>
            </h1>

            <p
              className="text-text-secondary"
              style={{ marginTop: 18, fontSize: "clamp(15px, 1.2vw, 20px)" }}
            >
              Бесплатно и без регистрации. Число жизненного пути и квадрат Пифагора — за один клик
            </p>

            <div className="flex flex-col gap-3 md:flex-row" style={{ marginTop: 32 }}>
              <div className="relative flex-1">
                <label className="sr-only" htmlFor="nm-day">
                  День
                </label>
                <select
                  id="nm-day"
                  className={selectClass}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  <option value="">День</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>

              <div className="relative flex-1">
                <label className="sr-only" htmlFor="nm-month">
                  Месяц
                </label>
                <select
                  id="nm-month"
                  className={selectClass}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Месяц</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>

              <div className="relative flex-1">
                <label className="sr-only" htmlFor="nm-year">
                  Год
                </label>
                <select
                  id="nm-year"
                  className={selectClass}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Год</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            {dateInvalid && (
              <p className="mt-3 text-[15px] text-text-danger">
                Такой даты не существует — проверь день и месяц
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!complete || dateInvalid || stage === "loading"}
              className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed"
              style={{
                marginTop: 20,
                height: 54,
                paddingInline: 40,
                opacity: !complete || dateInvalid || stage === "loading" ? 0.4 : 1,
              }}
            >
              {stage === "loading" ? "Считаем" : result ? "Пересчитать" : "Рассчитать"}
            </button>
          </div>
        </div>
      </section>

      <section
        ref={aboutRef}
        className="relative z-[30] w-full overflow-hidden"
        style={{
          ...arcTransitionStyle,
          minHeight: "90vh",
          paddingTop: `calc(${ARC_H} + 40px + clamp(64px, 8vh, 120px))`,
          paddingBottom: "clamp(64px, 8vh, 120px)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), var(--bg-page))" }}
        />

        <div
          className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-col-reverse items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-[6%]"
          style={{ paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "clamp(24px, 5vw, 80px)" }}
        >
          <div className="w-full md:w-[50%]">
            {stage !== "result" || !result ? (
              <div>
                <h2
                  className="font-display text-text-primary"
                  style={{ fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
                >
                  Что показывает нумерология
                </h2>
                <div
                  className="flex flex-col text-text-secondary"
                  style={{
                    marginTop: 24,
                    gap: 16,
                    fontSize: "clamp(15px, 1.15vw, 19px)",
                    lineHeight: 1.65,
                  }}
                >
                  <p>
                    Нумерология работает с датой рождения как с числовой записью. Цифры складываются
                    по одним и тем же правилам, и из них получаются два разных инструмента.
                  </p>
                  <p>
                    Число жизненного пути — одна цифра, которая описывает основной способ
                    действовать: с чего человек начинает, к чему возвращается, что даётся легче
                    всего.
                  </p>
                  <p>
                    Квадрат Пифагора устроен иначе. В нём считается, сколько раз каждая цифра от 1 до
                    9 встречается в дате и производных числах. Пустая ячейка и ячейка с четырьмя
                    повторами говорят о разном, и именно из этих плотностей складывается картина.
                  </p>
                  <p>
                    Никакой интерпретации на этом шаге нет — только сложение. Одна и та же дата
                    всегда даёт один и тот же результат.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ animation: reduced ? "none" : "ms-detail-in 600ms ease-out both" }}>
                <div
                  className="uppercase text-text-secondary"
                  style={{ fontSize: 13, letterSpacing: "0.08em" }}
                >
                  Твоё число пути
                </div>
                <h2
                  className="font-display text-text-primary"
                  style={{ marginTop: 8, fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
                >
                  {card?.n} · {card?.title}
                </h2>
                <p
                  className="text-text-secondary"
                  style={{ marginTop: 12, fontSize: "clamp(15px, 1.15vw, 19px)", lineHeight: 1.65 }}
                >
                  {card?.line}
                </p>

                <div
                  className="grid grid-cols-3"
                  style={{ marginTop: 28, gap: "clamp(10px, 1vw, 16px)", width: "fit-content" }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const count = result.counts[n] ?? 0;
                    return (
                      <div key={n} className="flex flex-col items-center">
                        <div
                          className="flex items-center justify-center rounded-[12px] border border-border bg-surface-1"
                          style={{
                            width: "clamp(64px, 6vw, 96px)",
                            height: "clamp(64px, 6vw, 96px)",
                          }}
                        >
                          {count > 0 ? (
                            <span
                              className="font-mono text-text-primary"
                              style={{ fontSize: "clamp(18px, 1.5vw, 24px)" }}
                            >
                              {String(n).repeat(count)}
                            </span>
                          ) : (
                            <span
                              className="font-mono text-text-secondary"
                              style={{ fontSize: "clamp(18px, 1.5vw, 24px)", opacity: 0.4 }}
                            >
                              —
                            </span>
                          )}
                        </div>
                        <span className="text-text-secondary" style={{ marginTop: 6, fontSize: 11 }}>
                          {squareLabels[n - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
                  style={{ marginTop: 28, height: 54, paddingInline: 40 }}
                >
                  Открыть полный разбор
                </button>
              </div>
            )}
          </div>

          <div className="w-full md:w-[44%]">
            <OrbitStage
              value={stage === "result" ? (result?.path ?? null) : null}
              speedFactor={fast ? 4 : 1}
              still={reduced}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
