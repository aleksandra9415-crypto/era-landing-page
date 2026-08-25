import { Section } from "./Section";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

const REVIEWS = [
  {
    name: "Анна К.",
    topic: "Матрица судьбы",
    avatar: avatar1,
    text: "Понравилось, что видно, откуда взялось каждое число. Это не «поверь мне», это можно проверить самой",
  },
  {
    name: "Дарья М.",
    topic: "Совместимость",
    avatar: avatar2,
    text: "Считали с мужем. Читали разбор вслух и половину вечера обсуждали — давно так не разговаривали",
  },
  {
    name: "Ольга В.",
    topic: "Натальная карта",
    avatar: avatar3,
    text: "Веду дневник третью неделю. Интереснее всего сравнивать, что совпадает, а что нет",
  },
];

export function Reviews() {
  return (
    <Section title="Что говорят">
      <div className="mx-auto mt-12 grid w-full max-w-[1240px] grid-cols-1 gap-8 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="group relative aspect-square w-[88vw] rounded-[20px] border border-border bg-surface-1 transition duration-300 hover:border-text-accent/50 hover:-translate-y-1 md:w-full motion-reduce:hover:translate-y-0"
            style={{ padding: "clamp(24px, 2.2vw, 36px)" }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-5 font-display text-text-accent"
              style={{ fontSize: "clamp(48px, 4.5vw, 84px)", opacity: 0.18, lineHeight: 1 }}
            >
              «
            </span>

            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="h-16 w-16 rounded-full border border-border object-cover md:h-[clamp(64px,6vw,96px)] md:w-[clamp(64px,6vw,96px)]"
                />
                <div className="ml-4">
                  <div
                    className="text-text-primary"
                    style={{ fontSize: "clamp(15px, 1.2vw, 19px)" }}
                  >
                    {r.name}
                  </div>
                  <div
                    className="mt-[3px] text-text-secondary"
                    style={{ fontSize: "clamp(12px, 0.95vw, 14px)" }}
                  >
                    {r.topic}
                  </div>
                </div>
              </div>

              <blockquote
                className="text-text-secondary"
                style={{
                  fontSize: "clamp(15px, 1.15vw, 18px)",
                  lineHeight: 1.55,
                }}
              >
                {r.text}
              </blockquote>
            </div>
          </figure>
        ))}
      </div>
    </Section>
  );
}
