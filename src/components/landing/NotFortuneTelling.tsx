import { Section } from "./Section";

const THESES = [
  {
    n: "01",
    title: "Арифметика и астрономия",
    text: "Матрица, нумерология и натальная карта считаются по одним и тем же правилам. Одинаковые данные всегда дают одинаковый результат",
  },
  {
    n: "02",
    title: "Настоящее небо",
    text: "Позиции планет берутся из астрономических эфемерид — тех же таблиц, по которым работают обсерватории",
  },
  {
    n: "03",
    title: "ИИ читает, а не сочиняет",
    text: "Искусственный интеллект не придумывает твой разбор. Он объясняет словами готовый расчёт",
  },
];

export function NotFortuneTelling() {
  return (
    <Section title="Расчёт, а не выдумка">
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
        {THESES.map((t) => (
          <div key={t.n}>
            <div className="font-mono text-text-accent" style={{ fontSize: 40, lineHeight: 1 }}>
              {t.n}
            </div>
            <h3
              className="mt-4 font-display text-text-primary"
              style={{ fontSize: 24, fontWeight: 400, letterSpacing: "0.01em" }}
            >
              {t.title}
            </h3>
            <p className="mt-2 text-text-secondary" style={{ fontSize: 16 }}>
              {t.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
