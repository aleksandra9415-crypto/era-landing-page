const LEGAL = [
  "Оферта",
  "Политика обработки персональных данных",
  "Условия подписки и возврата",
];

export function Footer() {
  return (
    <footer
      className="w-full border-t border-border"
      style={{ background: "color-mix(in srgb, var(--bg-page) 80%, black)" }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-[4vw] py-16 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div
            className="font-display text-text-primary"
            style={{ fontSize: 20, letterSpacing: "0.02em" }}
          >
            Моя Эра
          </div>

          <nav className="flex flex-col gap-3">
            {LEGAL.map((l) => (
              <a
                key={l}
                href="#"
                className="text-text-accent underline-offset-4 hover:underline"
                style={{ fontSize: 15 }}
              >
                {l}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <a
              href="#"
              className="text-text-accent underline-offset-4 hover:underline"
              style={{ fontSize: 15 }}
            >
              Telegram
            </a>
            <a
              href="#"
              className="text-text-accent underline-offset-4 hover:underline"
              style={{ fontSize: 15 }}
            >
              Поддержка
            </a>
          </nav>
        </div>

        <p className="mt-12 w-full text-text-secondary" style={{ fontSize: 13 }}>
          Моя Эра — сервис самопознания и развлечения. Разборы описывают качества и
          склонности и не являются предсказанием событий, медицинской, психологической,
          юридической или финансовой консультацией.
        </p>
      </div>
    </footer>
  );
}
