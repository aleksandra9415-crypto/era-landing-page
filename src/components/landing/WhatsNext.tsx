import { Section } from "./Section";

const ITEMS = [
  {
    title: "Дневник наблюдений",
    text: "Отмечай, что совпало, а что нет. Через месяц ты видишь свой рисунок не в тексте, а в собственном поведении",
  },
  {
    title: "Каждый день",
    text: "Карта дня и состояние по твоей карте — коротко, утром, по делу",
  },
  {
    title: "Telegram",
    text: "Короткий инсайт приходит сам. Не нужно заходить на сайт",
  },
  {
    title: "Близкие люди",
    text: "Профили партнёра, ребёнка, коллеги — и совместимость между ними",
  },
];

export function WhatsNext() {
  return (
    <Section
      title="Что происходит дальше"
      subtitle="Разбор — не финал. С него всё начинается"
    >
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {ITEMS.map((i) => (
          <div
            key={i.title}
            className="rounded-[20px] border border-border bg-surface-1 p-8"
          >
            <h3
              className="font-display text-text-primary"
              style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.01em" }}
            >
              {i.title}
            </h3>
            <p className="mt-2 text-text-secondary" style={{ fontSize: 15 }}>
              {i.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
