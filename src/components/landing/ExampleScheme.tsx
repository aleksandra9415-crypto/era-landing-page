import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { centralArcanum, digitSum, reduceTo22 } from "@/lib/arcana";

const demoDate = { day: 26, month: 7, year: 1990 };

const A = reduceTo22(demoDate.day);
const B = demoDate.month;
const C = reduceTo22(digitSum(demoDate.year));
const D = reduceTo22(A + B + C);
const E = centralArcanum(demoDate.day, demoDate.month, demoDate.year);

type NodeId = "A" | "B" | "C" | "D" | "E";
type SourceId = NodeId | "date-day" | "date-month" | "date-year";

type SchemeNode = {
  id: NodeId;
  value: number;
  label: string;
  sum: string;
  reduce: string;
  text: string;
  sources: SourceId[];
  x: number;
  y: number;
};

const nodes: SchemeNode[] = [
  {
    id: "A",
    value: A,
    label: "день",
    sum: "день = 26",
    reduce: "26 → 2 + 6 = 8",
    text: "Если число дня не больше 22, оно берётся как есть. Если больше — цифры складываются между собой",
    sources: ["date-day"],
    x: 6,
    y: 50,
  },
  {
    id: "B",
    value: B,
    label: "месяц",
    sum: "июль = 7",
    reduce: "",
    text: "Номер месяца всегда от 1 до 12, свёртка не нужна",
    sources: ["date-month"],
    x: 50,
    y: 6,
  },
  {
    id: "C",
    value: C,
    label: "год",
    sum: "1 + 9 + 9 + 0 = 19",
    reduce: "",
    text: "Цифры года складываются между собой. Девятнадцать не больше 22, поэтому свёртка на этом заканчивается",
    sources: ["date-year"],
    x: 94,
    y: 50,
  },
  {
    id: "D",
    value: D,
    label: "сумма",
    sum: "8 + 7 + 19 = 34",
    reduce: "34 → 3 + 4 = 7",
    text: "Сумма первых трёх. Всё, что больше 22, сворачивается сложением цифр",
    sources: ["A", "B", "C"],
    x: 50,
    y: 94,
  },
  {
    id: "E",
    value: E,
    label: "центр",
    sum: "8 + 7 + 19 + 7 = 41",
    reduce: "41 → 4 + 1 = 5",
    text: "Сумма всех четырёх. Это центральный аркан — Иерофант",
    sources: ["A", "B", "C", "D"],
    x: 50,
    y: 50,
  },
];

const edges: [NodeId, NodeId][] = [
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["D", "A"],
  ["A", "E"],
  ["B", "E"],
  ["C", "E"],
  ["D", "E"],
];

const spokes: NodeId[] = ["A", "B", "C", "D"];
const cycle: NodeId[] = ["E", "A", "B", "C", "D"];

const byId = (id: NodeId) => nodes.find((n) => n.id === id)!;

export function ExampleScheme() {
  const reduced = useReducedMotion();
  
  const [pinned, setPinned] = useState<NodeId>("E");
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const [autoOn, setAutoOn] = useState(true);
  const autoRef = useRef(true);

  useEffect(() => {
    if (reduced) {
      setAutoOn(false);
      autoRef.current = false;
    }
  }, [reduced]);

  useEffect(() => {
    if (!autoOn || reduced) return;
    const t = setInterval(() => setAutoIndex((i) => (i + 1) % cycle.length), 3500);
    return () => clearInterval(t);
  }, [autoOn, reduced]);

  const stopAuto = () => {
    if (autoRef.current) {
      autoRef.current = false;
      setAutoOn(false);
    }
  };

  const activeId: NodeId = autoOn && !reduced ? cycle[autoIndex]! : (hovered ?? pinned);
  const active = byId(activeId);

  const isSource = (id: SourceId) => active.sources.includes(id);
  const edgeActive = (a: NodeId, b: NodeId) =>
    (a === activeId && isSource(b)) || (b === activeId && isSource(a));

  const datePart = (id: "date-day" | "date-month" | "date-year", text: string) => (
    <span
      id={id}
      className="scheme-transition"
      style={{ color: isSource(id) ? "var(--text-accent)" : "var(--text-primary)" }}
    >
      {text}
    </span>
  );

  return (
    <Section
      title="Каждое число можно проверить"
      subtitle="Матрица — это арифметика. Мы показываем, откуда взялось каждое число в твоём разборе"
    >
      <div className="scheme-layout mx-auto mt-12 flex max-w-[1240px] flex-col gap-10 md:mt-16">
        {/* 1 — date */}
        <div className="scheme-date">
          <p
            className="text-text-secondary"
            style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Пример даты рождения
          </p>
          <div
            className="flex items-baseline gap-2"
            style={{
              marginTop: 10,
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(30px, 2.6vw, 48px)",
              color: "var(--text-primary)",
            }}
          >
            {datePart("date-day", "26")}
            <span>.</span>
            {datePart("date-month", "07")}
            <span>.</span>
            {datePart("date-year", "1990")}
          </div>
        </div>

        {/* 2 — diamond */}
        <div className="scheme-diagram flex flex-col items-center">
          <div
            className="relative w-[min(320px,86vw)] md:w-[min(520px,42vw)]"
            style={{ aspectRatio: "1 / 1" }}
          >
            <div className="scheme-halo pointer-events-none absolute inset-0" aria-hidden="true" />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {edges.map(([a, b]) => {
                const na = byId(a);
                const nb = byId(b);
                const on = edgeActive(a, b);
                return (
                  <line
                    key={`${a}${b}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    vectorEffect="non-scaling-stroke"
                    className="scheme-transition"
                    stroke={on ? "var(--text-accent)" : "var(--border)"}
                    strokeWidth={on ? 1.5 : 1}
                    strokeOpacity={on ? 0.8 : 0.4}
                  />
                );
              })}
            </svg>

            {!reduced &&
              spokes.map((id) => (
                <span
                  key={`pulse-${id}`}
                  aria-hidden="true"
                  className={`scheme-pulse scheme-pulse-${id.toLowerCase()}`}
                />
              ))}

            {nodes.map((n) => {
              const isActive = n.id === activeId;
              const source = isSource(n.id);
              const center = n.id === "E";
              const select = () => {
                stopAuto();
                setPinned(n.id);
              };
              return (
                <div
                  key={n.id}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`${n.label}: ${n.value}`}
                    onMouseEnter={() => {
                      stopAuto();
                      setHovered(n.id);
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => {
                      stopAuto();
                      setHovered(n.id);
                    }}
                    onBlur={() => setHovered(null)}
                    onClick={select}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select();
                      }
                    }}
                    className="scheme-node scheme-transition relative flex cursor-pointer items-center justify-center rounded-full bg-surface-1"
                    style={{
                      width: center ? "var(--node-center)" : "var(--node-size)",
                      height: center ? "var(--node-center)" : "var(--node-size)",
                      border: isActive
                        ? "2px solid var(--text-accent)"
                        : source
                          ? "1.5px solid rgba(195, 174, 228, 0.6)"
                          : "1px solid var(--border)",
                      boxShadow: isActive ? "0 0 24px rgba(122, 93, 168, 0.35)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: center ? "var(--node-font-center)" : "var(--node-font)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {n.value}
                    </span>
                  </div>
                  <span
                    className="mt-2 whitespace-nowrap text-text-secondary"
                    style={{ fontSize: 13 }}
                  >
                    {n.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 — panel, note, button */}
        <div className="scheme-panel-col">
          <div className="relative" style={{ minHeight: 190 }}>
            {nodes.map((n) => (
              <div
                key={n.id}
                aria-hidden={n.id !== activeId}
                className="scheme-panel absolute inset-0"
                style={{
                  opacity: n.id === activeId ? 1 : 0,
                  pointerEvents: n.id === activeId ? "auto" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(22px, 1.9vw, 34px)",
                    color: "var(--text-accent)",
                    lineHeight: 1.3,
                  }}
                >
                  {n.sum}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(17px, 1.4vw, 24px)",
                    color: "var(--text-accent)",
                    opacity: 0.75,
                    marginTop: 6,
                    lineHeight: 1.3,
                    minHeight: "1.3em",
                  }}
                >
                  {n.reduce || "\u00A0"}
                </p>
                <p
                  className="text-text-secondary"
                  style={{
                    fontSize: "clamp(15px, 1.15vw, 19px)",
                    marginTop: 18,
                    lineHeight: 1.5,
                  }}
                >
                  {n.text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-text-secondary" style={{ marginTop: 40, fontSize: 15 }}>
            В полном разборе так раскрывается каждое из 22 чисел матрицы
          </p>

          <button
            type="button"
            onClick={() => {}}
            className="w-full text-white transition-opacity hover:opacity-90 md:w-auto"
            style={{
              marginTop: 20,
              background: "var(--accent)",
              borderRadius: 12,
              height: 54,
              paddingLeft: 40,
              paddingRight: 40,
              fontSize: 16,
            }}
          >
            Узнать свои числа
          </button>
        </div>
      </div>
    </Section>
  );
}
