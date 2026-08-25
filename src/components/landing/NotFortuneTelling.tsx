import { Section } from "./Section";

const NUM_SIZE = "clamp(30px, 2.4vw, 44px)";
const TITLE_SIZE = "clamp(19px, 1.5vw, 26px)";
const TEXT_SIZE = "clamp(14px, 1.05vw, 17px)";
const MONO_SIZE = "clamp(13px, 1vw, 15px)";

const RULE = "1px solid color-mix(in srgb, var(--border) 35%, transparent)";

const PLANETS: Array<[string, string]> = [
  ["Солнце", "03°15′ Лев"],
  ["Луна", "28°15′ Дева"],
  ["Меркурий", "25°34′ Лев"],
];

function ColumnOneArtifact() {
  return (
    <div className="font-mono" style={{ fontSize: MONO_SIZE, lineHeight: 1.7 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="text-text-primary">
          26.07.1990
          <span className="text-text-accent">{"  →  5"}</span>
        </div>
      ))}
    </div>
  );
}

function ColumnTwoArtifact() {
  return (
    <div className="font-mono whitespace-pre" style={{ fontSize: MONO_SIZE, lineHeight: 1.7 }}>
      {PLANETS.map(([name, pos]) => (
        <div key={name}>
          <span className="text-text-secondary">{name.padEnd(11, " ")}</span>
          <span className="text-text-primary">{pos}</span>
        </div>
      ))}
    </div>
  );
}

function ColumnThreeArtifact() {
  return (
    <div>
      <div className="font-mono text-text-accent" style={{ fontSize: MONO_SIZE, lineHeight: 1.7 }}>
        аркан 5
      </div>
      <div
        className="font-mono text-text-secondary"
        style={{ fontSize: 14, opacity: 0.6, marginTop: 8, marginBottom: 8, lineHeight: 1 }}
      >
        ↓
      </div>
      <div className="text-text-primary" style={{ fontSize: "clamp(14px, 1.05vw, 16px)", lineHeight: 1.5 }}>
        Поиск смысла и своей системы правил
      </div>
    </div>
  );
}

const COLUMNS = [
  {
    n: "01",
    title: "Арифметика и астрономия",
    text: "Матрица, нумерология и натальная карта считаются по одним и тем же правилам. Одинаковые данные всегда дают одинаковый результат",
    artifact: <ColumnOneArtifact />,
    caption: "Один и тот же результат, всегда",
  },
  {
    n: "02",
    title: "Настоящее небо",
    text: "Позиции планет берутся из астрономических эфемерид — тех же таблиц, по которым работают обсерватории",
    artifact: <ColumnTwoArtifact />,
    caption: "Фрагмент расчёта на 26 июля 1990",
  },
  {
    n: "03",
    title: "ИИ читает, а не сочиняет",
    text: "Искусственный интеллект не придумывает твой разбор. Он объясняет словами готовый расчёт",
    artifact: <ColumnThreeArtifact />,
    caption: "Число из расчёта — объяснение словами",
  },
];

export function NotFortuneTelling() {
  return (
    <Section title="Расчёт, а не выдумка">
      <div className="mx-auto mt-12 w-full max-w-[1240px]">
        <div className="nft-grid">
          {COLUMNS.map((c) => (
            <div key={c.n} className="nft-col">
              <div className="font-mono text-text-accent" style={{ fontSize: NUM_SIZE, lineHeight: 1 }}>
                {c.n}
              </div>
              <h3
                className="font-display text-text-primary"
                style={{ fontSize: TITLE_SIZE, fontWeight: 400, letterSpacing: "0.01em", lineHeight: 1.15, marginTop: 14 }}
              >
                {c.title}
              </h3>
              <p className="text-text-secondary" style={{ fontSize: TEXT_SIZE, marginTop: 12, lineHeight: 1.55 }}>
                {c.text}
              </p>
              <div style={{ marginTop: 24, width: "100%", borderTop: RULE }} />
              <div style={{ marginTop: 20 }}>{c.artifact}</div>
              <div className="text-text-secondary" style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
                {c.caption}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, borderTop: RULE }} />
        <p
          className="nft-closing text-text-secondary"
          style={{ marginTop: 32, maxWidth: 720, fontSize: "clamp(16px, 1.25vw, 21px)", lineHeight: 1.5 }}
        >
          Мы не обещаем предсказать будущее. Мы показываем рисунок, который можно прочитать — и проверить
        </p>
      </div>

      <style>{`
        .nft-grid { display: grid; grid-template-columns: 1fr; }
        .nft-col + .nft-col {
          margin-top: 32px;
          padding-top: 32px;
          border-top: ${RULE};
        }
        .nft-closing { text-align: left; margin-left: 0; margin-right: auto; }
        @media (min-width: 768px) {
          .nft-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 56px; align-items: start; }
          .nft-col + .nft-col {
            margin-top: 0;
            padding-top: 0;
            border-top: none;
            border-left: ${RULE};
            padding-left: 28px;
            margin-left: -28px;
          }
          .nft-closing { text-align: center; margin-left: auto; margin-right: auto; }
        }
      `}</style>
    </Section>
  );
}
