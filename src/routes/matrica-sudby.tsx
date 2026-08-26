import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { SectionStars } from "@/components/common/SectionStars";
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
  component: MatricaSudbyPage;
});

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const CARD_GRADIENT =
  "linear-gradient(to bottom, rgba(3,25,30,0) 40%, rgba(3,25,30,0.6) 62%, rgba(3,25,30,0.9) 82%, rgba(3,25,30,0.97) 100%)";

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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
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
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setNumbers({ a, b, c, d, e });
        setStage("result");
      },
      reduced ? 200 : 1200,
    );
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setNumbers(null);
    setStage("form");
  };

  const card = numbers ? arcana.find((x) => x.n === numbers.e) : null;

  return (
    <main className="relative w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "88vh",
          paddingTop: "clamp(40px, 6vh, 90px)",
          paddingBottom: "clamp(60px, 8vh, 110px)",
        }}
      >
        <SectionStars count={70} />

        <div
          className="relative z-[1] mx-auto flex w-full max-w-[1320px] flex-col-reverse items-center gap-12 px-[clamp(24px,5vw,48px)] md:flex-row md:justify-between md:gap-[6%]"
          style={{ minHeight: "70vh" }}
        >
          {/* left column */}
          <div className="w-full md:w-[52%]">
            <h1
              className="font-display text-text-primary"
              style={{ fontSize: "clamp(32px, 3.4vw, 60px)", lineHeight: 1.1 }}
            >
              Рассчитать матрицу судьбы по дате рождения
            </h1>

            {stage !== "result" ? (
              <>
                <p
                  className="text-text-secondary"
                  style={{
                    marginTop: 18,
                    maxWidth: 520,
                    fontSize: "clamp(15px, 1.2vw, 20px)",
                  }}
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
                  className="font-mono text-text-accent"
                  style={{ marginTop: 24, fontSize: "clamp(64px, 6vw, 120px)", lineHeight: 1 }}
                >
                  {numbers?.e}
                </div>
                <div
                  className="font-display text-text-primary"
                  style={{ marginTop: 6, fontSize: "clamp(26px, 2.4vw, 44px)", lineHeight: 1.1 }}
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

          {/* right column */}
          <div className="flex w-full justify-center md:w-[42%]">
            <div
              className="relative overflow-hidden"
              style={{
                width: "min(38vw, 52vh)",
                height: "min(38vw, 52vh)",
                minWidth: 260,
                minHeight: 260,
                borderRadius: 20,
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={matrixAsset.url}
                alt="Матрица судьбы — расчёт по дате рождения"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: CARD_GRADIENT }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
