import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const WORDS = [
  { word: "ТОЧКА", sub: "Дата, время, место. С этого начинается всё" },
  { word: "СУДЬБА", sub: "Не приговор. Рисунок, который можно прочитать" },
  { word: "СХОДИТСЯ", sub: "Шесть систем считают тебя по-разному. И сходятся" },
];

export function Headline() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (reduced) {
      setIndex(1);
      return;
    }
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 3500);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col items-start justify-center overflow-visible">
      {/* All words stay in the DOM for SEO; visibility is CSS-driven. */}
      {/* The invisible longest word fixes the container width so the left */}
      {/* alignment line does not shift when the active word changes. */}
      <h1
        className="relative whitespace-nowrap text-left font-display uppercase text-text-primary leading-[1.05] text-[clamp(48px,7.5vw,200px)]"
        style={{ minHeight: "1.05em", letterSpacing: "0.02em" }}
      >
        {WORDS.map((w, i) => (
          <span
            key={w.word}
            className={`word-slot ${i === index ? "word-slot-active" : "word-slot-leaving"}`}
          >
            {w.word}
          </span>
        ))}
        <span className="invisible">СХОДИТСЯ</span>
      </h1>

      <div className="relative mt-[20px] h-[2.75em] w-full md:h-[1.5em]">
        {WORDS.map((w, i) => (
          <p
            key={w.word}
            aria-hidden={i !== index}
            className={`word-slot text-left text-text-secondary text-[clamp(15px,1.2vw,22px)] leading-snug md:whitespace-nowrap ${
              i === index ? "word-slot-active" : "word-slot-leaving"
            }`}
          >
            {w.sub}
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
