import tarotImg from "@/assets/tarot.png.asset.json";
import { Section, CARD_GRADIENT } from "./Section";

const STEPS = [
  { title: "Точка", text: "Ты вводишь дату, время и место рождения" },
  { title: "Расчёт", text: "Шесть систем считают тебя независимо друг от друга" },
  { title: "Разбор", text: "Ты получаешь один текст, в котором они сходятся" },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      title="Три шага"
      subtitle="Как устроен путь от даты рождения до разбора"
    >
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="relative overflow-hidden rounded-[20px] border border-border"
            style={{ aspectRatio: "2 / 3" }}
          >
            <img
              src={tarotImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: CARD_GRADIENT }} />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3
                className="font-display text-text-primary"
                style={{ fontSize: 24, fontWeight: 400, letterSpacing: "0.01em" }}
              >
                {s.title}
              </h3>
              <p className="mt-2 text-text-secondary" style={{ fontSize: 15 }}>
                {s.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
