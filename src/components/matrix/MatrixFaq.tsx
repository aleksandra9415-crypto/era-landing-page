import { Section } from "@/components/landing/Section";

const ITEMS = [
  {
    q: "Что такое матрица судьбы и откуда она взялась",
    a: "Метод появился в конце XX века и соединяет два старых языка: 22 старших аркана Таро и числовую свёртку из нумерологии. Дата рождения раскладывается по схеме из восьмиконечной звезды, и каждая позиция получает своё число от 1 до 22.",
  },
  {
    q: "Чем матрица отличается от натальной карты",
    a: "Матрица считается только из даты и описывает устройство характера и повторяющиеся сценарии. Натальная карта считается из даты, времени и места, использует реальные положения планет и говорит больше о ритме и обстоятельствах. Они не спорят между собой, а смотрят с разных сторон.",
  },
  {
    q: "Нужно ли время рождения",
    a: "Нет. Для матрицы достаточно даты. Время и место понадобятся, если захочешь посмотреть натальную карту или Дизайн человека.",
  },
  {
    q: "Почему у меня и у знакомого одинаковый центральный аркан",
    a: "Центральный аркан — одно число из двадцати двух, поэтому совпадения встречаются часто. Различает людей не он один, а вся схема целиком: шесть линий и связи между ними у двух человек с одинаковым центром будут разными.",
  },
  {
    q: "Матрица предсказывает события",
    a: "Нет. Она описывает качества, склонности и повторяющиеся сценарии. Что с этим делать — остаётся за тобой, и именно поэтому в сервисе есть дневник наблюдений.",
  },
];

export function MatrixFaq() {
  return (
    <Section
      id="matrix-faq"
      title="Вопросы о матрице"
      style={{
        paddingBottom:
          "calc(clamp(80px, 10vh, 160px) + var(--transition-depth) + 24px)",
      }}
    >
      <div className="mx-auto mt-12 w-full max-w-[860px]">
        {ITEMS.map((item) => (
          <details key={item.q} className="group border-b border-border/35">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-[22px] text-text-primary">
              <span style={{ fontSize: 17 }}>{item.q}</span>
              <span
                className="relative mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center text-text-accent"
                aria-hidden="true"
              >
                <span className="absolute transition-opacity duration-200 ease-out group-open:opacity-0">
                  +
                </span>
                <span className="absolute opacity-0 transition-opacity duration-200 ease-out group-open:opacity-100">
                  −
                </span>
              </span>
            </summary>
            <div className="pb-[22px]">
              <p className="text-text-secondary" style={{ fontSize: 17 }}>
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
