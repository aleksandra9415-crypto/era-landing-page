import { Section } from "./Section";

const REVIEWS = [
  {
    name: "Анна К.",
    initials: "АК",
    direction: "Матрица судьбы",
    text: "Понравилось, что видно, откуда взялось каждое число. Это не «поверь мне», это можно проверить самой",
  },
  {
    name: "Дарья М.",
    initials: "ДМ",
    direction: "Совместимость",
    text: "Считали с мужем. Читали разбор вслух и половину вечера обсуждали — давно так не разговаривали",
  },
  {
    name: "Ольга В.",
    initials: "ОВ",
    direction: "Натальная карта",
    text: "Веду дневник третью неделю. Интереснее всего сравнивать, что совпадает, а что нет",
  },
];

export function Reviews() {
  return (
    <Section title="Что говорят">
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="rounded-[20px] border border-border bg-surface-1 p-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-primary">
                <span style={{ fontSize: 15 }}>{r.initials}</span>
              </div>
              <div>
                <div className="text-text-primary" style={{ fontSize: 16 }}>
                  {r.name}
                </div>
                <div className="text-text-secondary" style={{ fontSize: 13 }}>
                  {r.direction}
                </div>
              </div>
            </div>
            <blockquote className="mt-5 text-text-secondary" style={{ fontSize: 15 }}>
              {r.text}
            </blockquote>
          </figure>
        ))}
      </div>
    </Section>
  );
}
