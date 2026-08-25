import { Section } from "./Section";

const PLANS = [
  {
    id: "free",
    name: "Знакомство",
    price: "0 ₽",
    content: "Расчёт матрицы и базовый разбор",
    main: false,
  },
  {
    id: "sub",
    name: "Подписка",
    price: "690 ₽/мес или 4 900 ₽/год",
    content: "Всё без ограничений",
    main: true,
  },
  {
    id: "trial",
    name: "Пробный доступ",
    price: "49 ₽ / 3 дня",
    content: "Всё без ограничений на 3 дня",
    main: false,
  },
];

/** Mobile order puts «Подписка» first; desktop keeps Знакомство / Пробный / Подписка. */
const DESKTOP_ORDER: Record<string, string> = {
  free: "md:order-1",
  trial: "md:order-2",
  sub: "md:order-3",
};

export function Pricing() {
  return (
    <Section
      id="pricing"
      title="Тарифы"
      subtitle="Один тариф открывает всё. Никаких докупок внутри"
    >
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col rounded-[20px] bg-surface-1 p-8 ${DESKTOP_ORDER[p.id]}`}
            style={{
              border: p.main ? "1px solid var(--text-accent)" : "1px solid var(--border)",
            }}
          >
            {p.main && (
              <div className="text-text-accent" style={{ fontSize: 13 }}>
                Основной
              </div>
            )}
            <h3
              className={`font-display text-text-primary ${p.main ? "mt-1" : ""}`}
              style={{ fontSize: 26, fontWeight: 400, letterSpacing: "0.01em" }}
            >
              {p.name}
            </h3>
            <div className="mt-3 text-text-primary" style={{ fontSize: 17 }}>
              {p.price}
            </div>
            <p className="mt-3 flex-1 text-text-secondary" style={{ fontSize: 17 }}>
              {p.content}
            </p>
            {p.main ? (
              <button
                type="button"
                className="mt-8 h-14 w-full rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
              >
                Начать
              </button>
            ) : (
              <a
                href="#quick-calc"
                className="mt-8 self-start text-text-accent underline-offset-4 hover:underline"
                style={{ fontSize: 15 }}
              >
                Попробовать
              </a>
            )}
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-text-secondary" style={{ fontSize: 15 }}>
        Подписка отменяется в один шаг в личном кабинете. Без звонков и писем в поддержку.
      </p>
    </Section>
  );
}
