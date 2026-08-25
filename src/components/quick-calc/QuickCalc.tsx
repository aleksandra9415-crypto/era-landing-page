import { useMemo, useRef, useState } from "react";
import { arcana, MONTHS, centralArcanum, isValidDate } from "@/lib/arcana";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const selectClass =
  "h-14 w-full appearance-none rounded-[12px] border border-border bg-surface-1 px-4 pr-10 text-[17px] text-text-primary outline-none transition-colors focus:border-text-accent";

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

export function QuickCalc() {
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
  const [result, setResult] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const complete = day !== "" && month !== "" && year !== "";
  const dateInvalid =
    complete && !isValidDate(Number(day), Number(month), Number(year));

  const handleSubmit = () => {
    if (!complete || dateInvalid) return;
    const value = centralArcanum(Number(day), Number(month), Number(year));
    setStage("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setResult(value);
        setStage("result");
      },
      reduced ? 200 : 1200,
    );
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setResult(null);
    setStage("form");
  };

  const card = result ? arcana.find((a) => a.n === result) : null;

  return (
    <section
      id="quick-calc"
      className="relative w-full bg-bg-page"
      style={{
        paddingTop: "clamp(80px, 10vh, 160px)",
        paddingBottom: "clamp(80px, 10vh, 160px)",
      }}
    >
      <div className="mx-auto w-full max-w-[720px] px-[4vw] md:px-6">
        <h2
          className="text-center font-display text-text-primary"
          style={{ fontSize: "clamp(32px, 3.4vw, 64px)", letterSpacing: "0.01em" }}
        >
          Посмотри свой центральный аркан
        </h2>
        <p
          className="mt-4 text-center text-text-secondary"
          style={{ fontSize: "clamp(16px, 1.2vw, 20px)" }}
        >
          Одно число, вокруг которого собирается вся матрица. Считается из даты рождения,
          без регистрации
        </p>

        {stage !== "result" ? (
          <div className="mt-10">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <label className="sr-only" htmlFor="qc-day">
                  День
                </label>
                <select
                  id="qc-day"
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
                <label className="sr-only" htmlFor="qc-month">
                  Месяц
                </label>
                <select
                  id="qc-month"
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
                <label className="sr-only" htmlFor="qc-year">
                  Год
                </label>
                <select
                  id="qc-year"
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
              className="mt-5 h-14 w-full rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed"
              style={{ opacity: !complete || dateInvalid ? 0.4 : 1 }}
            >
              {stage === "loading" ? "Считаем" : "Показать"}
            </button>
          </div>
        ) : (
          <div
            className="mt-10 text-center"
            style={{
              animation: reduced ? "none" : "fade-in 800ms ease-out both",
            }}
          >
            <div
              className="font-mono text-text-accent"
              style={{ fontSize: "clamp(72px, 9vw, 160px)", lineHeight: 1 }}
            >
              {card?.n}
            </div>
            <div
              className="mt-2 font-display text-text-primary"
              style={{ fontSize: "clamp(28px, 3vw, 52px)", letterSpacing: "0.01em" }}
            >
              {card?.name}
            </div>
            <p
              className="mt-4 text-text-secondary"
              style={{ fontSize: "clamp(16px, 1.2vw, 20px)" }}
            >
              {card?.line}
            </p>

            <button
              type="button"
              onClick={() => {}}
              className="mt-8 h-14 rounded-[12px] bg-accent px-8 text-[17px] font-medium text-primary-foreground"
            >
              Открыть полный разбор
            </button>
            <p className="mt-3 text-[14px] text-text-secondary">
              Для полного разбора понадобятся ещё время и место рождения
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 bg-transparent text-[15px] text-text-accent underline-offset-4 hover:underline"
            >
              Другая дата
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
