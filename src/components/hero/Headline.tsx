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
    <div className="flex flex-col items-start">
      {/* All words stay in the DOM for SEO; visibility is CSS-driven. */}
      <h1
        className="relative w-full max-w-[9ch] font-display font-bold uppercase text-text-primary leading-[1.05] text-[48px] md:w-[9ch] md:text-[88px]"
        style={{ minHeight: "1.05em" }}
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

      <div className="relative mt-6 h-[48px] w-full max-w-[420px] md:h-[56px] md:w-[32vw] md:max-w-none">
        {WORDS.map((w, i) => (
          <p
            key={w.word}
            aria-hidden={i !== index}
            className={`word-slot text-text-secondary text-[15px] leading-snug md:text-[18px] ${
              i === index ? "word-slot-active" : "word-slot-leaving"
            }`}
          >
            {w.sub}
          </p>
        ))}
      </div>

      <button
        type="button"
        className="bg-accent mt-2 rounded-lg text-[16px] text-white transition-opacity hover:opacity-90"
        style={{ padding: "16px 32px" }}
      >
        Рассчитать бесплатно
      </button>
    </div>
  );
}
