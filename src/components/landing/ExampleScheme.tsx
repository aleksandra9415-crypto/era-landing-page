import { useState } from "react";
import { Section } from "./Section";
import { centralArcanum, digitSum, reduceTo22 } from "@/lib/arcana";

const demoDate = { day: 15, month: 7, year: 1990 };

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
  formula: string;
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
    formula: `день = ${A}`,
    text: "Число дня берётся как есть, если оно не больше 22",
    sources: ["date-day"],
    x: 6,
    y: 50,
  },
  {
    id: "B",
    value: B,
    label: "месяц",
    formula: `июль = ${B}`,
    text: "Номер месяца всегда от 1 до 12, свёртка не нужна",
    sources: ["date-month"],
    x: 50,
    y: 6,
  },
  {
    id: "C",
    value: C,
    label: "год",
    formula: `${String(demoDate.year).split("").join(" + ")} = ${C}`,
    text: "Цифры года складываются между собой",
    sources: ["date-year"],
    x: 94,
    y: 50,
  },
  {
    id: "D",
    value: D,
    label: "сумма",
    formula: `${A} + ${B} + ${C} = ${A + B + C} → ${String(A + B + C)
      .split("")
      .join(" + ")} = ${D}`,
    text: "Сумма первых трёх. Всё, что больше 22, сворачивается сложением цифр",
    sources: ["A", "B", "C"],
    x: 50,
    y: 94,
  },
  {
    id: "E",
    value: E,
    label: "центр",
    formula: `${A} + ${B} + ${C} + ${D} = ${A + B + C + D} → ${String(A + B + C + D)
      .split("")
      .join(" + ")} = ${E}`,
    text: "Сумма всех четырёх. Это центральный аркан — Колесо Фортуны",
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

const byId = (id: NodeId) => nodes.find((n) => n.id === id)!;

export function ExampleScheme() {
  const [pinned, setPinned] = useState<NodeId>("E");
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const activeId = hovered ?? pinned;
  const active = byId(activeId);

  const isSource = (id: SourceId) => active.sources.includes(id);
  const edgeActive = (a: NodeId, b: NodeId) =>
    (a === activeId && isSource(b)) || (b === activeId && isSource(a));

  const datePart = (id: "date-day" | "date-month" | "date-year", text: string) => (
    <span
      id={id}
      className="scheme-transition"
      style={{ color: isSource(id) ? "var(--text-accent)" : "var(--text-secondary)" }}
    >
      {text}
    </span>
  );

  return (
    <Section
      title="Каждое число можно проверить"
      subtitle="Матрица — это арифметика. Мы показываем, откуда взялось каждое число в твоём разборе"
    >
      <div className="mt-12 flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-10">
        {/* Left: scheme */}
        <div className="flex w-full flex-col items-center md:w-[55%]">
          <div
            className="flex items-baseline gap-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(22px, 1.8vw, 32px)",
              color: "var(--text-secondary)",
            }}
          >
            {datePart("date-day", "15")}
            <span>.</span>
            {datePart("date-month", "07")}
            <span>.</span>
            {datePart("date-year", "1990")}
          </div>

          <div
            className="relative mt-8 w-[min(320px,86vw)] md:w-[min(440px,40vw)]"
            style={{ aspectRatio: "1 / 1" }}
          >
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

            {nodes.map((n) => {
              const isActive = n.id === activeId;
              const source = isSource(n.id);
              const center = n.id === "E";
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
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(n.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setPinned(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPinned(n.id);
                      }
                    }}
                    className="scheme-node scheme-transition flex cursor-pointer items-center justify-center rounded-full bg-surface-1"
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

        {/* Right: explanation panel */}
        <div className="w-full md:w-[45%]">
          <div className="relative" style={{ minHeight: 200 }}>
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
                    fontSize: "clamp(20px, 1.7vw, 30px)",
                    color: "var(--text-accent)",
                    lineHeight: 1.3,
                  }}
                >
                  {n.formula}
                </p>
                <p
                  className="text-text-secondary"
                  style={{ fontSize: "clamp(15px, 1.15vw, 19px)", marginTop: 16, lineHeight: 1.5 }}
                >
                  {n.text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary" style={{ marginTop: 32, fontSize: 15 }}>
            В полном разборе так раскрывается каждое из 22 чисел матрицы
          </p>
        </div>
      </div>
    </Section>
  );
}
