import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const PHRASES = [
  {
    l1: "ОДНА",
    l2: "ТОЧКА",
    sub: "Дата, время и место рождения. Больше для расчёта ничего не нужно",
  },
  {
    l1: "ШЕСТЬ",
    l2: "СИСТЕМ",
    sub: "Матрица судьбы, натальная карта, дизайн человека, нумерология, таро и совместимость считают тебя независимо друг от друга",
  },
  {
    l1: "ВСЁ",
    l2: "СОВПАДАЕТ",
    sub: "Шесть независимых расчётов описывают одного человека — и сходятся между собой",
  },
];


const LAST = PHRASES.length - 1;

export function Headline() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(LAST);

  useEffect(() => {
    if (reduced) {
      setIndex(LAST);
      return;
    }
    const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), 3000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col items-start justify-center overflow-visible">
      {/* All phrases stay in the DOM for SEO; visibility is CSS-driven. */}
      <h1
        className="relative w-full text-left font-display uppercase text-text-primary text-[clamp(34px,13vw,72px)] md:text-[clamp(52px,9.2vw,240px)]"
        style={{
          lineHeight: 0.95,
          height: "1.9em",
          letterSpacing: "0.02em",
          fontWeight: 400,
        }}
      >
        {PHRASES.map((p, i) => (
          <span
            key={p.l2}
            className={`word-slot whitespace-nowrap ${
              i === index ? "word-slot-active" : "word-slot-leaving"
            }`}
          >
            {p.l1}
            <br />
            {p.l2}
          </span>
        ))}
      </h1>

      <div className="relative mt-[24px] h-[6em] w-full md:h-[4.5em]">

        {PHRASES.map((p, i) => (
          <p
            key={p.l2}
            aria-hidden={i !== index}
            className={`word-slot text-left text-text-secondary text-[clamp(15px,1.2vw,22px)] ${
              i === index ? "word-slot-active" : "word-slot-leaving"
            }`}
            style={{ lineHeight: 1.5 }}
          >
            {p.sub}
          </p>
        ))}
      </div>

      <button
        type="button"
        className="bg-accent mt-[32px] self-start rounded-lg text-[16px] text-white transition-opacity hover:opacity-90"
        style={{ padding: "16px 32px" }}
      >
        Рассчитать бесплатно
      </button>
    </div>
  );
}
