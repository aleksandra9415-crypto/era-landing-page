import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DirectionPage,
  directionHead,
  type CalculatorApi,
  type DirectionLine,
  type FaqItem,
} from "@/components/direction/DirectionPage";
import { DateSelects, type DateParts } from "@/components/direction/DateCalculator";
import { isValidDate } from "@/lib/arcana";
import hdAsset from "@/assets/humandesign2.png.asset.json";

export const Route = createFileRoute("/dizayn-cheloveka")({
  head: directionHead({
    title: "Дизайн человека: рассчитать бодиграф по дате рождения — Моя Эра",
    description:
      "Тип, стратегия и авторитет по дате, времени и месту рождения. Расчёт по реальным положениям планет.",
    canonical: "https://destiny-canvas-arc.lovable.app/dizayn-cheloveka",
  }),
  component: HumanDesignPage,
});

type HdInput = {
  date: DateParts;
  hour: string;
  minute: string;
  place: string;
};

const ABOUT_PARAGRAPHS = [
  "Дизайн человека соединяет несколько старых систем — И-цзин, астрологию, каббалу и чакры — в одну схему из девяти центров. Схема называется бодиграфом и рассчитывается по положению планет.",
  "Главное в ней — тип и стратегия. Тип описывает, как устроен твой обмен энергией с миром, а стратегия — способ принимать решения, при котором ты тратишь меньше сил и реже упираешься в сопротивление.",
  "Определённые центры показывают, что в тебе устойчиво и не зависит от окружения. Неопределённые — то, что ты берёшь от людей рядом и усиливаешь. Это объясняет, почему в одной компании ты один, а в другой совсем другой.",
  "В отличие от матрицы и нумерологии, дизайн человека нельзя посчитать по одной дате. Нужны время и место рождения, и не одна карта, а две.",
];

const LINES: DirectionLine[] = [
  {
    n: "01",
    title: "Тип",
    text: "Генератор, Проектор, Манифестор или Рефлектор. От типа зависит всё остальное",
  },
  {
    n: "02",
    title: "Стратегия",
    text: "Способ принимать решения, при котором тратится меньше сил и реже возникает сопротивление",
  },
  {
    n: "03",
    title: "Авторитет",
    text: "На что опираться в момент выбора: на тело, на эмоцию, на паузу или на разговор",
  },
  {
    n: "04",
    title: "Профиль",
    text: "Две цифры, описывающие роль: как ты учишься сам и что даёшь другим",
  },
  {
    n: "05",
    title: "Центры",
    text: "Что в тебе устойчиво, а что зависит от людей рядом. Отсюда разница между компаниями",
  },
  {
    n: "06",
    title: "Каналы и ворота",
    text: "Конкретные механизмы, из которых собран твой тип. Самая подробная часть разбора",
  },
];

const SAMPLE_PARAGRAPHS = [
  "Проектор устроен так, что не производит энергию сам, а направляет чужую. Отсюда главная сложность: работать наравне с генераторами ты можешь, но недолго, и расплата приходит не в тот же день, а через неделю усталости, которую не с чем связать.",
  "Стратегия проектора — ждать приглашения. Звучит пассивно, а на деле означает другое: твоя работа видна и востребована ровно тогда, когда о ней попросили. Инициатива без запроса чаще всего упирается в вежливое согласие и ничем не заканчивается.",
  "Эмоциональный авторитет добавляет к этому вторую задачу. Решение, принятое на подъёме, и решение, принятое на спаде, у тебя будут разными — и оба покажутся верными в момент. Отсюда единственное правило, которое действительно меняет качество выбора, и оно про то,",
];

const FAQ: FaqItem[] = [
  {
    q: "Почему расчёт не бесплатный",
    a: "Бодиграф считается по двум картам сразу: на момент рождения и на точку примерно за 88 дней до него. Обе требуют астрономических эфемерид, и в браузере такой расчёт не делается. Это единственное из шести направлений с таким ограничением, и мы предпочли сказать об этом прямо, а не показывать приблизительный результат.",
  },
  {
    q: "Обязательно ли знать время рождения",
    a: "Да. Тип и авторитет зависят от положения планет в конкретный час, и без времени расчёт даст неверный результат. Время часто есть в выписке из роддома или его помнят родные.",
  },
  {
    q: "Чем дизайн человека отличается от натальной карты",
    a: "Обе системы работают с положением планет, но отвечают на разные вопросы. Натальная карта описывает характер и обстоятельства. Дизайн человека — способ принимать решения и обмениваться энергией с людьми.",
  },
  {
    q: "Что делать, если тип не совпадает с ощущением себя",
    a: "Это частая ситуация, особенно у проекторов и рефлекторов: многие годами живут по чужой стратегии и привыкают считать её своей. Бодиграф описывает не привычку, а устройство, и расхождение между ними обычно и есть самое полезное в разборе.",
  },
  {
    q: "Дизайн человека предсказывает события",
    a: "Нет. Он описывает механику решений и энергии, а не то, что произойдёт.",
  },
];

const selectClass =
  "qc-focus h-14 w-full appearance-none rounded-[12px] border border-border bg-surface-1 px-4 pr-10 text-[17px] text-text-primary transition-colors focus:border-text-accent";

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-text-secondary"
    >
      <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Форма первого экрана: дата, время, место. Бесплатного расчёта нет. */
function HdCalculator({ stage, submit }: CalculatorApi<HdInput>) {
  const [date, setDate] = useState<DateParts>({ day: "", month: "", year: "" });
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [place, setPlace] = useState("");

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const dateComplete = date.day !== "" && date.month !== "" && date.year !== "";
  const dateInvalid =
    dateComplete && !isValidDate(Number(date.day), Number(date.month), Number(date.year));
  const complete =
    dateComplete && !dateInvalid && hour !== "" && minute !== "" && place.trim().length > 1;
  const disabled = !complete || stage === "loading";

  return (
    <>
      <div style={{ marginTop: 32 }}>
        <DateSelects idPrefix="hd" value={date} onChange={setDate} />
      </div>

      <div className="flex flex-col md:flex-row" style={{ marginTop: 12, gap: 12 }}>
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="hd-hour">
            Часы
          </label>
          <select
            id="hd-hour"
            className={selectClass}
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          >
            <option value="">Часы</option>
            {hours.map((h) => (
              <option key={h} value={h}>
                {pad(h)}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative flex-1">
          <label className="sr-only" htmlFor="hd-minute">
            Минуты
          </label>
          <select
            id="hd-minute"
            className={selectClass}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
          >
            <option value="">Минуты</option>
            {minutes.map((m) => (
              <option key={m} value={m}>
                {pad(m)}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="sr-only" htmlFor="hd-place">
          Место рождения
        </label>
        <input
          id="hd-place"
          type="text"
          autoComplete="off"
          placeholder="Город"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="qc-focus h-14 w-full rounded-[12px] border border-border bg-surface-1 px-4 text-[17px] text-text-primary transition-colors placeholder:text-text-secondary focus:border-text-accent"
        />
      </div>

      {dateInvalid ? (
        <p className="text-text-secondary" style={{ marginTop: 10, fontSize: 14 }}>
          Такой даты не существует
        </p>
      ) : null}

      <div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && submit({ date, hour, minute, place: place.trim() })}
          className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground transition-opacity"
          style={{ marginTop: 24, height: 54, paddingInline: 40, opacity: disabled ? 0.4 : 1 }}
        >
          {stage === "loading" ? "Считаем" : "Рассчитать бодиграф"}
        </button>
      </div>

      <p className="text-text-secondary" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5 }}>
        Единственное направление без бесплатного расчёта. Бодиграф входит в пробный доступ —
        объясняем почему ниже
      </p>
    </>
  );
}

const CENTERS: { points: string; label: string }[] = [
  { points: "35,26 65,26 50,8", label: "Голова" },
  { points: "35,34 65,34 50,52", label: "Аджна" },
  { points: "38,60 62,60 62,80 38,80", label: "Горло" },
  { points: "50,84 64,98 50,112 36,98", label: "Самость" },
  { points: "68,90 80,90 74,100", label: "Воля" },
  { points: "38,120 62,120 62,138 38,138", label: "Сакральный" },
  { points: "14,108 32,116 14,124", label: "Селезёнка" },
  { points: "86,108 68,116 86,124", label: "Солнечное сплетение" },
  { points: "38,148 62,148 62,166 38,166", label: "Корневой" },
];

const HUB = {
  head: [50, 26] as const,
  ajna: [50, 34] as const,
  throatTop: [50, 60] as const,
  throatBottom: [50, 80] as const,
  throatRight: [62, 70] as const,
  throatLeft: [38, 70] as const,
  selfTop: [50, 84] as const,
  selfBottom: [50, 112] as const,
  selfLeft: [36, 98] as const,
  selfRight: [64, 98] as const,
  willLeft: [68, 95] as const,
  sacralTop: [50, 120] as const,
  sacralBottom: [50, 138] as const,
  sacralLeft: [38, 129] as const,
  sacralRight: [62, 129] as const,
  spleen: [26, 116] as const,
  solar: [74, 116] as const,
  rootTop: [50, 148] as const,
  rootLeft: [38, 152] as const,
  rootRight: [62, 152] as const,
};

const CHANNELS: readonly [readonly [number, number], readonly [number, number]][] = [
  [HUB.head, HUB.ajna],
  [HUB.ajna, HUB.throatTop],
  [HUB.throatBottom, HUB.selfTop],
  [HUB.throatRight, HUB.willLeft],
  [HUB.throatLeft, HUB.spleen],
  [HUB.throatRight, HUB.solar],
  [HUB.selfBottom, HUB.sacralTop],
  [HUB.selfLeft, HUB.spleen],
  [HUB.selfRight, HUB.willLeft],
  [HUB.sacralBottom, HUB.rootTop],
  [HUB.spleen, HUB.rootLeft],
  [HUB.solar, HUB.rootRight],
  [HUB.sacralLeft, HUB.spleen],
  [HUB.sacralRight, HUB.solar],
];

/** Пустой бодиграф: девять контурных центров и каналы. */
function EmptyBodygraph() {
  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="aspect-square"
        style={{ width: "min(30vw, 46vh)", minWidth: 260, maxWidth: "100%" }}
      >
        <svg
          viewBox="0 0 100 170"
          role="img"
          aria-label="Пустой бодиграф: девять центров без заполнения"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {CHANNELS.map(([a, b], i) => (
            <line
              key={i}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="var(--border)"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          ))}
          {CENTERS.map((c) => (
            <polygon
              key={c.label}
              points={c.points}
              fill="none"
              stroke="var(--border)"
              strokeOpacity={0.55}
              strokeWidth={1}
            />
          ))}
        </svg>
      </div>
      <p
        className="text-center text-text-secondary"
        style={{ marginTop: 18, fontSize: 13, lineHeight: 1.5 }}
      >
        Все центры пусты: расчёт ещё не сделан
      </p>
    </div>
  );
}

function HdResultContent() {
  return (
    <div>
      <h2
        className="font-display text-text-primary"
        style={{ marginTop: 14, fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
      >
        Бодиграф не считается по дате
      </h2>
      <div
        className="flex flex-col text-text-primary"
        style={{
          marginTop: 24,
          gap: 16,
          fontSize: "clamp(16px, 1.25vw, 20px)",
          lineHeight: 1.7,
        }}
      >
        <p>
          Дизайн человека — единственная из шести систем, которую нельзя посчитать в браузере.
          Бодиграф строится по двум картам: на момент рождения и на точку примерно за 88 дней до
          него. Обе требуют астрономических эфемерид, и приблизительный результат здесь хуже, чем
          никакого — тип определяется однозначно или не определяется вовсе.
        </p>
        <p>
          Твои данные сохранены. Расчёт входит в пробный доступ на три дня за 249 ₽ вместе с
          остальными пятью направлениями.
        </p>
      </div>
      <a
        href="#start"
        className="qc-focus inline-flex items-center justify-center rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
        style={{ marginTop: 28, height: 54, paddingInline: 40 }}
      >
        Открыть пробный доступ
      </a>
    </div>
  );
}

/** Блок «как считается»: шкала двух карт с интервалом 88 дней. */
function TwoChartsBlock() {
  const dot = {
    width: 14,
    height: 14,
    boxShadow: "0 0 16px rgba(122, 93, 168, 0.45)",
  } as const;

  return (
    <section
      className="relative w-full"
      style={{ paddingTop: "clamp(64px, 8vh, 120px)", paddingBottom: "clamp(64px, 8vh, 120px)" }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-[4vw] md:px-6">
        <h2
          className="font-display text-text-primary"
          style={{ fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
        >
          Почему карт две
        </h2>
        <p
          className="text-text-secondary"
          style={{ marginTop: 14, fontSize: "clamp(15px, 1.15vw, 19px)", lineHeight: 1.6 }}
        >
          Дизайн человека считает не один момент, а два
        </p>

        <div className="mx-auto w-full" style={{ maxWidth: 720, marginTop: "clamp(48px, 6vw, 80px)" }}>
          <div className="relative w-full" style={{ height: 96 }}>
            {/* линия */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 bg-border"
              style={{ top: 48, height: 1 }}
            />

            {/* 88 дней */}
            <span
              className="absolute -translate-x-1/2 font-mono text-text-secondary"
              style={{ left: "50%", top: 26, fontSize: "clamp(13px, 1.05vw, 16px)" }}
            >
              88 дней
            </span>

            {[
              { left: "12%", top: "Дизайн", bottom: "примерно за 88 дней до рождения" },
              { left: "88%", top: "Личность", bottom: "момент рождения" },
            ].map((p) => (
              <div key={p.left} className="absolute" style={{ left: p.left, top: 0 }}>
                <span
                  className="absolute -translate-x-1/2 whitespace-nowrap text-text-primary"
                  style={{ top: 0, fontSize: "clamp(14px, 1.1vw, 17px)" }}
                >
                  {p.top}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -translate-x-1/2 rounded-full bg-text-accent"
                  style={{ ...dot, top: 42 }}
                />
                <span
                  className="absolute -translate-x-1/2 text-center text-text-secondary"
                  style={{ top: 66, fontSize: 12, lineHeight: 1.35, width: 150 }}
                >
                  {p.bottom}
                </span>
              </div>
            ))}
          </div>

          <p
            className="text-text-secondary"
            style={{ marginTop: 32, fontSize: "clamp(14px, 1.05vw, 17px)", lineHeight: 1.65 }}
          >
            Первая карта отвечает за то, что ты осознаёшь в себе, вторая — за то, что работает без
            твоего участия и обычно заметнее со стороны. Бодиграф получается наложением обеих,
            поэтому одной даты для него недостаточно.
          </p>
        </div>
      </div>
    </section>
  );
}

function HumanDesignPage() {
  return (
    <DirectionPage<HdInput>
      id="humandesign"
      h1="Дизайн человека: рассчитать бодиграф"
      heroDescription="Тип, стратегия и авторитет — по дате, времени и месту рождения"
      heroImage={hdAsset.url}
      heroImageAlt="Дизайн человека — расчёт бодиграфа"
      aboutTitle="Что показывает дизайн человека"
      aboutParagraphs={ABOUT_PARAGRAPHS}
      resultLabel="Почему нужен расчёт"
      linesTitle="Что входит в разбор"
      linesSubtitle="Полный бодиграф: девять центров, каналы и ворота"
      lines={LINES}
      exampleTitle="Как выглядит разбор"
      exampleSubtitle="Фрагмент настоящего текста. Проектор, эмоциональный авторитет"
      exampleParagraphs={SAMPLE_PARAGRAPHS}
      exampleFooter="Полный разбор — тип, стратегия, авторитет, профиль, все центры и каналы"
      faqTitle="Вопросы о дизайне человека"
      faq={FAQ}
      otherTitle="Эти пять считают тебя иначе"
      otherSubtitle="Дизайн человека описывает обмен энергией. Остальные пять смотрят с других сторон и складываются с ним в один профиль"
      finalTitle="Рассчитать свой бодиграф"
      finalSubtitle="Входит в пробный доступ на три дня"
      calculator={(api) => <HdCalculator {...api} />}
      placeholderVisual={<EmptyBodygraph />}
      resultVisual={() => <EmptyBodygraph />}
      resultContent={() => <HdResultContent />}
      explainBlock={<TwoChartsBlock />}
    />
  );
}
