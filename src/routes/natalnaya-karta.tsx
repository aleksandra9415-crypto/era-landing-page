import { createFileRoute } from "@tanstack/react-router";
import {
  DirectionPage,
  directionHead,
  type CalculatorApi,
  type DirectionLine,
  type FaqItem,
  type ResultCtx,
} from "@/components/direction/DirectionPage";
import { DateCalculator } from "@/components/direction/DateCalculator";
import { Orbits } from "@/components/quick-calc/Orbits";
import natalAsset from "@/assets/natal.png.asset.json";
import { sunSign, type SunSignResult } from "@/lib/natal";

export const Route = createFileRoute("/natalnaya-karta")({
  head: directionHead({
    title: "Натальная карта онлайн по дате рождения — Моя Эра",
    description:
      "Знак Солнца бесплатно по дате рождения. Полная натальная карта — по дате, времени и месту, с реальными положениями планет.",
    canonical: "https://destiny-canvas-arc.lovable.app/natalnaya-karta",
  }),
  component: NatalPage,
});

const ABOUT_PARAGRAPHS = [
  "Натальная карта — это положение планет в момент рождения, рассчитанное для конкретной точки на Земле. Не символическая схема, а реальное небо: те же астрономические таблицы, по которым работают обсерватории.",
  "Из одной даты выводится только знак Солнца — где Солнце стояло в тот день. Это одна позиция из десяти, и по ней видно немного: общий способ проявляться, не больше.",
  "Всё остальное требует времени и места. Луна меняет знак каждые два с половиной дня, асцендент — примерно каждые два часа. Без времени рождения половина карты остаётся неизвестной, и никакой сервис этого не обойдёт.",
  "Поэтому натальная карта — самое требовательное к данным направление из шести. Зато и самое подробное: в полной карте больше сорока позиций.",
];

const LINES: DirectionLine[] = [
  { n: "01", title: "Солнце", text: "Как ты проявляешься и что считаешь собой. Единственная позиция, которую видно по одной дате" },
  { n: "02", title: "Луна", text: "Что нужно, чтобы чувствовать себя в безопасности. Меняет знак каждые два с половиной дня" },
  { n: "03", title: "Асцендент", text: "Каким тебя видят до того, как узнают. Меняется примерно каждые два часа" },
  { n: "04", title: "Планеты в знаках", text: "Десять позиций: от Меркурия до Плутона. Каждая отвечает за свою область" },
  { n: "05", title: "Дома", text: "В каких сферах жизни всё это разворачивается: работа, дом, близкие, деньги" },
  { n: "06", title: "Аспекты", text: "Как позиции спорят и помогают друг другу. Самая интересная часть карты" },
];

const SAMPLE_PARAGRAPHS = [
  "Солнце во Льве даёт потребность в отклике — не в аплодисментах, а в подтверждении, что сделанное замечено. Ты плохо переносишь работу в стол и молчание в ответ. Это не тщеславие: без обратной связи у тебя буквально падает мотивация, и никакая дисциплина этого не компенсирует.",
  "Луна в Деве при этом устроена противоположно. Она успокаивается порядком, деталями и предсказуемостью — тем, что Солнцу во Льве кажется мелким и скучным. Внутри тебя постоянно спорят двое: один хочет размаха, другой сначала проверит расчёты.",
  "Именно на этом сочетании стоит задержаться. Оно объясняет, почему ты берёшься за крупное, а застреваешь на мелочах, и почему отдых у тебя выглядит странно для окружающих. Обычно люди с такой парой светил приходят к одному и тому же решению, и оно связано с тем,",
];

const FAQ: FaqItem[] = [
  {
    q: "Почему по дате видно только знак Солнца",
    a: "Потому что остальные позиции меняются быстрее суток. Луна проходит знак за два с половиной дня, асцендент — за два часа. Без времени рождения их посчитать невозможно, и сервисы, которые обещают полную карту по одной дате, показывают не карту, а гороскоп по знаку.",
  },
  {
    q: "Я не знаю точное время рождения",
    a: "Его часто можно найти в выписке из роддома или уточнить у родных. Если время известно приблизительно, карта всё равно считается — просто позиции асцендента и домов будут указаны с оговоркой.",
  },
  {
    q: "Зачем нужно место рождения",
    a: "Положение планет на небе зависит от точки наблюдения. Для одного и того же момента карта в Москве и во Владивостоке будет разной — прежде всего в части домов и асцендента.",
  },
  {
    q: "Откуда берутся положения планет",
    a: "Из астрономических эфемерид — таблиц, по которым рассчитывают движение небесных тел. Это те же данные, которыми пользуются обсерватории, и они не зависят от того, верите вы в астрологию или нет.",
  },
  {
    q: "Мой знак на границе с соседним",
    a: "Солнце входит в знак в конкретный момент, и в разные годы это разные сутки. Если ваша дата попадает на стык, точный ответ даст только расчёт по времени рождения — мы честно об этом предупредим.",
  },
];

const FULL_CHART_ITEMS = [
  "Луна",
  "Асцендент",
  "Меркурий",
  "Венера",
  "Марс",
  "Юпитер",
  "Сатурн",
  "Двенадцать домов",
  "Аспекты между позициями",
];

function NatalCalculator({ stage, submit }: CalculatorApi<SunSignResult>) {
  return (
    <DateCalculator
      idPrefix="natal"
      stage={stage}
      onSubmit={(date) => submit(sunSign(date.day, date.month))}
    />
  );
}

/** Орбиты + название знака вместо цифры. */
function NatalStage({ result, fast, reduced }: ResultCtx<SunSignResult>) {
  return (
    <div className="relative mx-auto aspect-square w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(122, 93, 168, 0.22) 0%, rgba(122, 93, 168, 0) 55%)",
        }}
      />

      <Orbits speedFactor={fast ? 4 : 1} dim still={reduced} />

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display text-text-accent"
          aria-hidden="true"
          style={{
            fontSize: "clamp(44px, 4.6vw, 96px)",
            lineHeight: 1,
            animation: reduced ? "none" : "qc-result-in 800ms ease-out both",
          }}
        >
          {result.sign.name}
        </span>
      </div>
    </div>
  );
}

function NatalResultContent({ result }: ResultCtx<SunSignResult>) {
  const text = result.sign.detail || result.sign.line;
  return (
    <>
      <h2
        className="font-display text-text-primary"
        style={{ marginTop: 8, fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
      >
        {result.sign.name}
      </h2>

      <p
        className="text-text-primary"
        style={{ marginTop: 20, fontSize: "clamp(16px, 1.25vw, 21px)", lineHeight: 1.7 }}
      >
        {text}
      </p>

      {result.onCusp ? (
        <p className="text-text-secondary" style={{ marginTop: 10, fontSize: 13 }}>
          Дата на границе знаков. Солнце входит в знак в конкретный момент, и в разные годы это
          разные сутки — точный ответ даст расчёт по времени рождения
        </p>
      ) : null}

      <p
        className="text-text-secondary"
        style={{ marginTop: 20, fontSize: "clamp(14px, 1.05vw, 16px)" }}
      >
        Это одна позиция из сорока. Для остальных понадобятся время и место рождения
      </p>

      <button
        type="button"
        className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
        style={{ marginTop: 20, height: 54, paddingInline: 40 }}
      >
        Открыть полный разбор
      </button>
    </>
  );
}

/** Блок «как считается»: что даёт дата и что даёт время. */
function DataVsTimeBlock() {
  const itemStyle = { fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.4 } as const;
  return (
    <section
      className="relative w-full"
      style={{
        paddingTop: "clamp(64px, 8vh, 120px)",
        paddingBottom: "clamp(64px, 8vh, 120px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-[4vw] md:px-6">
        <h2
          className="font-display text-text-primary"
          style={{ fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
        >
          Что даёт дата и что даёт время
        </h2>
        <p
          className="text-text-secondary"
          style={{ marginTop: 14, fontSize: "clamp(15px, 1.15vw, 19px)", lineHeight: 1.6 }}
        >
          Половина карты зависит от часа и места рождения. Это не ограничение сервиса, а свойство
          расчёта
        </p>

        <div
          className="grid grid-cols-1 items-start md:grid-cols-2"
          style={{ marginTop: 40, gap: "clamp(32px, 4vw, 72px)" }}
        >
          <div>
            <div
              className="text-text-secondary"
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              Только по дате
            </div>
            <div className="flex items-center text-text-primary" style={itemStyle}>
              <span
                aria-hidden="true"
                className="rounded-full bg-text-accent"
                style={{ width: 6, height: 6, marginRight: 14, flexShrink: 0 }}
              />
              Солнце
            </div>
          </div>

          <div>
            <div
              className="text-text-secondary"
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              С временем и местом
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {FULL_CHART_ITEMS.map((item) => (
                <div key={item} className="flex items-center text-text-secondary" style={{ ...itemStyle, opacity: 0.55 }}>
                  <span
                    aria-hidden="true"
                    className="rounded-full bg-border"
                    style={{ width: 6, height: 6, marginRight: 14, flexShrink: 0 }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NatalPage() {
  return (
    <DirectionPage<SunSignResult>
      id="natal"
      h1="Натальная карта онлайн"
      heroDescription="Знак Солнца — бесплатно по дате. Полная карта — по дате, времени и месту"
      heroImage={natalAsset.url}
      heroImageAlt="Натальная карта — расчёт по дате рождения"
      aboutTitle="Что показывает натальная карта"
      aboutParagraphs={ABOUT_PARAGRAPHS}
      resultLabel="Твой знак Солнца"
      linesTitle="Что входит в разбор"
      linesSubtitle="Знак Солнца — одна позиция. В полной карте их больше сорока"
      lines={LINES}
      exampleTitle="Как выглядит разбор"
      exampleSubtitle="Фрагмент настоящего текста. Солнце во Льве, Луна в Деве"
      exampleParagraphs={SAMPLE_PARAGRAPHS}
      exampleFooter="Полная карта — больше сорока позиций и связи между ними"
      faqTitle="Вопросы о натальной карте"
      faq={FAQ}
      otherTitle="Эти пять считают тебя иначе"
      otherSubtitle="Натальная карта работает с реальным небом. Остальные пять считаются иначе и складываются с ней в один профиль"
      finalTitle="Узнай свой знак Солнца"
      finalSubtitle="Бесплатно, по одной дате рождения"
      calculator={(api) => <NatalCalculator {...api} />}
      resultVisual={(ctx) => <NatalStage {...ctx} />}
      resultContent={(ctx) => <NatalResultContent {...ctx} />}
      explainBlock={<DataVsTimeBlock />}
    />
  );
}
