import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { SectionStars } from "@/components/common/SectionStars";
import { Grain } from "@/components/hero/Grain";
import { OrbitStage } from "@/components/quick-calc/Orbits";
import { ARC_H, arcTransitionStyle } from "@/components/common/ArcTransition";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { arcana, MONTHS, digitSum, reduceTo22, isValidDate } from "@/lib/arcana";
import matrixAsset from "@/assets/matrix.png.asset.json";

const TITLE = "Рассчитать матрицу судьбы по дате рождения — Моя Эра";
const DESCRIPTION =
  "Бесплатный расчёт матрицы судьбы онлайн. Центральный аркан и базовые числа по дате рождения, с объяснением, откуда взялось каждое число.";

export const Route = createFileRoute("/matrica-sudby")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://destiny-canvas-arc.lovable.app/matrica-sudby" }],
  }),
  component: MatricaSudbyPage,
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

export type MatrixNumbers = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
};

function MatricaSudbyPage() {
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
  const [numbers, setNumbers] = useState<MatrixNumbers | null>(null);
  const [fast, setFast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      if (slowTimer.current) clearTimeout(slowTimer.current);
    },
    [],
  );

  const complete = day !== "" && month !== "" && year !== "";
  const dateInvalid = complete && !isValidDate(Number(day), Number(month), Number(year));

  const handleSubmit = () => {
    if (!complete || dateInvalid) return;
    const a = reduceTo22(Number(day));
    const b = Number(month);
    const c = reduceTo22(digitSum(Number(year)));
    const d = reduceTo22(a + b + c);
    const e = reduceTo22(a + b + c + d);
    setStage("loading");
    if (!reduced) setFast(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setNumbers({ a, b, c, d, e });
        setStage("result");
        if (slowTimer.current) clearTimeout(slowTimer.current);
        slowTimer.current = setTimeout(() => setFast(false), 100);
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(
          () => {
            aboutRef.current?.scrollIntoView({
              behavior: reduced ? "auto" : "smooth",
              block: "start",
            });
          },
          reduced ? 0 : 900,
        );
      },
      reduced ? 200 : 1200,
    );
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    setNumbers(null);
    setFast(false);
    setStage("form");
  };

  const card = numbers ? arcana.find((x) => x.n === numbers.e) : null;


  return (
    <main className="relative w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <section className="ms-hero -mt-[110px] w-full">
        {/* 1 — photo */}
        <img
          src={matrixAsset.url}
          alt="Матрица судьбы — расчёт по дате рождения"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />

        {/* 2/4 — shade (responsive) */}
        <div aria-hidden="true" className="ms-hero-shade z-[1]" />

        {/* 3 — подсветка у горизонта (её режет чёрная кромка перехода) */}
        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute bottom-0 left-0 right-0 z-[2]"
        />

        {/* 4 — stars (следят за курсором) */}
        <CursorStarField count={70} opacity={0.6} className="z-[3]" />


        {/* 5 — grain */}
        <Grain />

        {/* 6 — content */}
        <div className="ms-hero-content">
          <div className="ms-hero-text">
            <h1
              className="font-display text-text-primary"
              style={{ fontSize: "clamp(34px, 3.8vw, 68px)", lineHeight: 1.1 }}
            >
              РАССЧИТАТЬ <span className="whitespace-nowrap">МАТРИЦУ СУДЬБЫ</span>{" "}
              <span className="whitespace-nowrap">по дате рождения</span>
            </h1>

            {stage !== "result" ? (
              <>
                <p
                  className="text-text-secondary"
                  style={{ marginTop: 18, fontSize: "clamp(15px, 1.2vw, 20px)" }}
                >
                  Бесплатно и без регистрации. Покажем центральный аркан и четыре числа, из которых
                  он собирается
                </p>

                <div className="flex flex-col gap-3 md:flex-row" style={{ marginTop: 32 }}>
                  <div className="relative flex-1">
                    <label className="sr-only" htmlFor="ms-day">
                      День
                    </label>
                    <select
                      id="ms-day"
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
                    <label className="sr-only" htmlFor="ms-month">
                      Месяц
                    </label>
                    <select
                      id="ms-month"
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
                    <label className="sr-only" htmlFor="ms-year">
                      Год
                    </label>
                    <select
                      id="ms-year"
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
                  {stage === "loading" ? "Считаем" : "Рассчитать"}
                </button>
              </>
            ) : (
              <div style={{ animation: reduced ? "none" : "qc-result-in 800ms ease-out both" }}>
                <div
                  className="ms-arcana-number font-mono text-text-accent"
                  style={{ marginTop: 24, lineHeight: 1 }}
                >
                  {numbers?.e}
                </div>
                <div
                  className="font-display text-text-primary"
                  style={{ marginTop: 4, fontSize: "clamp(28px, 2.6vw, 48px)", lineHeight: 1.1 }}
                >
                  {card?.name}
                </div>
                <p
                  className="text-text-secondary"
                  style={{ marginTop: 14, maxWidth: 460, fontSize: "clamp(15px, 1.2vw, 19px)" }}
                >
                  {card?.line}
                </p>

                <div className="flex flex-wrap" style={{ marginTop: 28, gap: 28 }}>
                  {[
                    { v: numbers?.a, label: "день" },
                    { v: numbers?.b, label: "месяц" },
                    { v: numbers?.c, label: "год" },
                    { v: numbers?.d, label: "сумма" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div
                        className="font-mono text-text-primary"
                        style={{ fontSize: "clamp(22px, 1.8vw, 32px)", lineHeight: 1.1 }}
                      >
                        {item.v}
                      </div>
                      <div className="text-[12px] text-text-secondary">{item.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
                  style={{ marginTop: 32, height: 54, paddingInline: 40 }}
                >
                  Открыть полный разбор
                </button>
                <p className="text-[13px] text-text-secondary" style={{ marginTop: 12 }}>
                  В полном разборе раскрываются все 22 позиции матрицы
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="bg-transparent text-[15px] text-text-accent underline-offset-4 hover:underline"
                  style={{ marginTop: 14 }}
                >
                  Другая дата
                </button>
              </div>
            )}
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
        {/* растворение чёрного в фон страницы */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), var(--bg-page))" }}
        />
        <div
          className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-col-reverse items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-[6%]"
          style={{ paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "clamp(24px, 5vw, 80px)" }}
        >
          {/* left column */}
          <div className="w-full md:w-[50%]">
            {stage !== "result" ? (
              <div>
                <h2
                  className="font-display text-text-primary"
                  style={{ fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
                >
                  Что показывает матрица судьбы
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
                    Матрица судьбы раскладывает дату рождения на 22 позиции — по числу старших
                    арканов. Каждая позиция отвечает за свою область: характер, отношения, деньги,
                    здоровье, связь с родом.
                  </p>
                  <p>
                    Центральный аркан стоит в середине этой схемы. Через него проходят все остальные
                    линии, поэтому с него и начинают: он описывает, к чему человек возвращается снова
                    и снова, что даётся ему легче всего и что становится главным уроком.
                  </p>
                  <p>
                    Матрица не говорит, что случится. Она описывает устройство: какие качества
                    заложены сильнее, какие слабее, где твоя опора, а где место, которое стоит
                    замечать.
                  </p>
                  <p>
                    Расчёт целиком арифметический. Одна и та же дата всегда даёт одну и ту же матрицу
                    — это не интерпретация, а сложение.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ animation: reduced ? "none" : "ms-detail-in 600ms ease-out both" }}>
                <div
                  className="uppercase text-text-secondary"
                  style={{ fontSize: 13, letterSpacing: "0.08em" }}
                >
                  Твой центральный аркан
                </div>
                <h2
                  className="font-display text-text-primary"
                  style={{ marginTop: 8, fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
                >
                  {card?.n} · {card?.name}
                </h2>

                <div
                  className="relative overflow-hidden"
                  style={{ marginTop: 20, height: 240 }}
                >
                  <p
                    className="text-text-primary"
                    style={{ fontSize: "clamp(16px, 1.25vw, 21px)", lineHeight: 1.7 }}
                  >
                    {card?.detail}
                  </p>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0"
                    style={{
                      height: 120,
                      background: "linear-gradient(to bottom, rgba(3,25,30,0), var(--bg-page))",
                    }}
                  />
                </div>

                <p
                  className="text-text-secondary"
                  style={{ marginTop: 4, fontSize: "clamp(15px, 1.15vw, 18px)" }}
                >
                  Дальше — в полном разборе
                </p>

                <button
                  type="button"
                  className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
                  style={{ marginTop: 20, height: 54, paddingInline: 40 }}
                >
                  Открыть полный разбор
                </button>
              </div>
            )}
          </div>

          {/* right column — orbits */}
          <div className="w-full md:w-[44%]">
            <OrbitStage
              value={stage === "result" ? (numbers?.e ?? null) : null}
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

