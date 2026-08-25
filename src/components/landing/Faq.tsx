import { Section } from "./Section";

const ITEMS = [
  {
    q: "Это точные предсказания?",
    a: "Нет, и это честно. Расчёты точные — арифметика и положения планет не меняются. А разбор — это описание качеств и склонностей, а не событий, которые обязаны произойти. Мы сервис самопознания, а не предсказаний.",
  },
  {
    q: "Я не знаю точное время рождения. Что делать?",
    a: "Матрице судьбы и нумерологии время не нужно — хватит даты. Для натальной карты и Дизайна человека время важно: чем точнее, тем точнее карта. Его часто можно найти в документах роддома или уточнить у родных.",
  },
  {
    q: "Как отменить подписку?",
    a: "В один шаг в личном кабинете. Без звонков, писем в поддержку и удерживающих предложений.",
  },
  {
    q: "Откуда берутся расчёты?",
    a: "Матрица и нумерология — арифметика от даты рождения. Натальная карта и Дизайн человека — положения планет из астрономических эфемерид. ИИ не придумывает результат, он объясняет готовый расчёт словами.",
  },
  {
    q: "Что происходит с моими данными?",
    a: "Дата, время и место рождения используются только для расчёта. Мы не передаём их третьим лицам. Подробности — в политике обработки данных.",
  },
];

export function Faq() {
  return (
    <Section id="faq" title="Вопросы">
      <div className="mx-auto mt-12 w-full max-w-[860px]">
        {ITEMS.map((item, i) => (
          <div key={item.q} className="border-b border-border">
            <input
              type="checkbox"
              id={`faq-${i}`}
              className="peer sr-only"
              defaultChecked={false}
            />
            <label
              htmlFor={`faq-${i}`}
              className="flex cursor-pointer items-center justify-between gap-6 py-6 text-text-primary"
              style={{ fontSize: 17 }}
            >
              {item.q}
              <span className="text-text-accent" aria-hidden="true">
                +
              </span>
            </label>
            <div className="hidden pb-6 peer-checked:block">
              <p className="text-text-secondary" style={{ fontSize: 17 }}>
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
