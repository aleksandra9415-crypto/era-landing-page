import { createFileRoute } from "@tanstack/react-router";
import { OrbitStage } from "@/components/quick-calc/Orbits";
import {
  DirectionPage,
  directionHead,
  type CalculatorApi,
  type ResultCtx,
} from "@/components/direction/DirectionPage";
import { DateCalculator } from "@/components/direction/DateCalculator";
import {
  lifePath,
  lifePathNumber,
  pythagoras,
  squareLabels,
  type PythagorasResult,
} from "@/lib/numerology";
import { MONTHS } from "@/lib/arcana";
import numerologyAsset from "@/assets/numerology.png.asset.json";

const TITLE =
  "Нумерология по дате рождения: число судьбы и квадрат Пифагора — Моя Эра";
const DESCRIPTION =
  "Бесплатный расчёт числа жизненного пути и квадрата Пифагора по дате рождения, с объяснением каждого шага.";

export const Route = createFileRoute("/numerologiya")({
  head: directionHead({
    title: TITLE,
    description: DESCRIPTION,
    canonical: "https://destiny-canvas-arc.lovable.app/numerologiya",
  }),
  component: NumerologyPage,
});

type NumerologyResult = {
  path: number;
  square: PythagorasResult;
  date: { day: number; month: number; year: number };
};

const ABOUT_PARAGRAPHS = [
  "Нумерология работает с датой рождения как с числовой записью. Цифры складываются по одним и тем же правилам, и из них получаются два разных инструмента.",
  "Число жизненного пути — одна цифра, которая описывает основной способ действовать: с чего человек начинает, к чему возвращается, что даётся легче остального.",
  "Квадрат Пифагора устроен иначе. В нём считается, сколько раз каждая цифра от 1 до 9 встречается в дате и производных числах. Пустая ячейка и ячейка с четырьмя повторами говорят о разном.",
  "Никакой интерпретации на этом шаге нет — только сложение. Одна и та же дата всегда даёт один и тот же результат.",
];

const LINES = [
  {
    n: "01",
    title: "Число пути",
    text: "Из полной даты. Основной способ действовать и то, к чему возвращаешься в любой ситуации",
  },
  {
    n: "02",
    title: "Число дня",
    text: "Из числа рождения. Что даётся от природы, без усилия и обучения",
  },
  {
    n: "03",
    title: "Квадрат Пифагора",
    text: "Девять ячеек и плотность каждой цифры. Пустые ячейки говорят не меньше, чем заполненные",
  },
  {
    n: "04",
    title: "Линии квадрата",
    text: "Устойчивые сочетания по строкам и столбцам: целеустремлённость, семья, темперамент, быт",
  },
  {
    n: "05",
    title: "Личный год",
    text: "В какой фазе девятилетнего цикла ты сейчас и чем эта фаза отличается от соседних",
  },
  {
    n: "06",
    title: "Связь с матрицей",
    text: "Где числа и арканы говорят одно и то же, а где расходятся. Расхождения обычно интереснее совпадений",
  },
];

const SAMPLE_PARAGRAPHS = [
  "Седьмое число пути ставит человека в положение наблюдателя раньше, чем участника. Ты сначала разбираешься, как устроено, и только потом входишь — и это не осторожность, а способ, которым ты вообще способен действовать. Попытки заставить себя «просто начать» обычно заканчиваются откатом.",
  "В квадрате при этом важна не сама семёрка, а её плотность. Две семёрки в твоей дате означают, что интерес к устройству вещей достаточно силён, чтобы быть профессией, но не настолько, чтобы вытеснять всё остальное.",
  "Отдельного внимания заслуживает пустая ячейка на пятёрке. Отсутствующая цифра не означает нехватки — она означает, что это качество не встроено по умолчанию и набирается опытом. В твоём случае это касается того,",
];

const FAQ = [
  {
    q: "Чем число пути отличается от числа судьбы",
    a: "Число пути считается из полной даты рождения и описывает способ действовать. Числом судьбы в разных школах называют разное — чаще всего расчёт по имени, а не по дате. Мы работаем только с датой, поэтому используем однозначные названия.",
  },
  {
    q: "Почему 11 и 22 не сворачиваются",
    a: "Это мастер-числа. В классической нумерологии считается, что они несут собственное значение, которое теряется при свёртке до 2 и 4. Мы следуем этому правилу.",
  },
  {
    q: "Что означает пустая ячейка в квадрате",
    a: "Не недостаток, а отсутствие врождённой опоры: качество не даётся по умолчанию и набирается опытом. Пустых ячеек у всех несколько — квадрат без пробелов не встречается.",
  },
  {
    q: "Влияет ли смена имени или фамилии",
    a: "На расчёт по дате — нет. Дата рождения не меняется, поэтому и число пути, и квадрат остаются прежними всю жизнь.",
  },
  {
    q: "Нумерология предсказывает события",
    a: "Нет. Она описывает способ действовать и плотность качеств. Личный год говорит о фазе цикла, а не о том, что в этой фазе произойдёт.",
  },
];

const DEMO_DATE = { day: 26, month: 7, year: 1990 };

/** Порядок ячеек по столбцам: 1-4-7, 2-5-8, 3-6-9. */
const CELL_ORDER = [1, 4, 7, 2, 5, 8, 3, 6, 9];

function formatDate(d: { day: number; month: number; year: number }) {
  return `${d.day} ${MONTHS[d.month - 1]?.toLowerCase() ?? ""} ${d.year}`;
}

function NumerologyCalculator({ stage, submit }: CalculatorApi<NumerologyResult>) {
  return (
    <DateCalculator
      idPrefix="num"
      stage={stage}
      onSubmit={(date) =>
        submit({
          path: lifePathNumber(date.day, date.month, date.year),
          square: pythagoras(date.day, date.month, date.year),
          date,
        })
      }
    />
  );
}

function NumerologyResultContent({ result }: ResultCtx<NumerologyResult>) {
  const card = lifePath.find((x) => x.n === result.path);
  return (
    <>
      <h2
        className="font-display text-text-primary"
        style={{ marginTop: 8, fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
      >
        {card?.n} · {card?.title}
      </h2>

      <p
        className="text-text-secondary"
        style={{ marginTop: 12, fontSize: "clamp(15px, 1.15vw, 19px)", lineHeight: 1.65 }}
      >
        {card?.line}
      </p>

      {card?.detail ? (
        <div className="relative overflow-hidden" style={{ marginTop: 20, height: 240 }}>
          <p
            className="text-text-primary"
            style={{ fontSize: "clamp(16px, 1.25vw, 21px)", lineHeight: 1.7 }}
          >
            {card.detail}
          </p>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: 120,
              background: "linear-gradient(to bottom, rgba(0,0,0,0), #000000)",
            }}
          />
        </div>
      ) : null}

      <p
        className="text-text-secondary"
        style={{ marginTop: 4, fontSize: "clamp(15px, 1.15vw, 18px)" }}
      >
        Дальше — в полном разборе
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

function SquareBlock({ ctx }: { ctx: ResultCtx<NumerologyResult> | null }) {
  const date = ctx?.result.date ?? DEMO_DATE;
  const square = ctx?.result.square ?? pythagoras(DEMO_DATE.day, DEMO_DATE.month, DEMO_DATE.year);

  const working: { label: string; value: number }[] = [
    { label: "первое", value: square.first },
    { label: "второе", value: square.second },
    { label: "третье", value: square.third },
    { label: "четвёртое", value: square.fourth },
  ];

  return (
    <section
      className="relative w-full"
      style={{
        paddingTop: "clamp(64px, 8vh, 120px)",
        paddingBottom: "clamp(64px, 8vh, 120px)",
        paddingLeft: "clamp(24px, 5vw, 80px)",
        paddingRight: "clamp(24px, 5vw, 80px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <h2
          className="font-display text-text-primary"
          style={{ fontSize: "clamp(28px, 2.6vw, 46px)", lineHeight: 1.1 }}
        >
          {ctx ? "Твой квадрат Пифагора" : "Квадрат Пифагора"}
        </h2>
        <p
          className="text-text-secondary"
          style={{ marginTop: 14, fontSize: "clamp(15px, 1.15vw, 19px)", lineHeight: 1.6 }}
        >
          Девять ячеек и плотность каждой цифры. Пустая ячейка говорит не меньше, чем заполненная
        </p>

        <div
          className="flex flex-col items-start gap-10 md:flex-row md:items-start"
          style={{ marginTop: 40, gap: "clamp(32px, 5vw, 80px)" }}
        >
          <div className="grid grid-cols-3" style={{ gap: "clamp(10px, 1.2vw, 18px)" }}>
            {CELL_ORDER.map((n) => {
              const count = square.counts[n] ?? 0;
              return (
                <div key={n} className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center rounded-[12px] border border-border bg-surface-1"
                    style={{
                      width: "clamp(72px, 7vw, 110px)",
                      height: "clamp(72px, 7vw, 110px)",
                    }}
                  >
                    {count > 0 ? (
                      <span
                        className="font-mono text-text-primary"
                        style={{ fontSize: "clamp(18px, 1.6vw, 26px)" }}
                      >
                        {String(n).repeat(count)}
                      </span>
                    ) : (
                      <span
                        className="font-mono text-text-secondary"
                        style={{ fontSize: "clamp(18px, 1.6vw, 26px)", opacity: 0.4 }}
                      >
                        —
                      </span>
                    )}
                  </div>
                  <span className="text-text-secondary" style={{ marginTop: 8, fontSize: 11 }}>
                    {squareLabels[n - 1]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col" style={{ gap: 14 }}>
            <div className="text-text-secondary" style={{ fontSize: 13, letterSpacing: "0.04em" }}>
              {formatDate(date)}
            </div>
            {working.map((w) => (
              <div
                key={w.label}
                className="font-mono text-text-secondary"
                style={{ fontSize: "clamp(14px, 1.1vw, 17px)" }}
              >
                {w.value} <span style={{ opacity: 0.7 }}>— {w.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NumerologyPage() {
  return (
    <DirectionPage<NumerologyResult>
      id="numerology"
      h1="Нумерология по дате рождения"
      heroDescription="Число жизненного пути и квадрат Пифагора. Бесплатно, без регистрации"
      heroImage={numerologyAsset.url}
      heroImageAlt="Нумерология — расчёт по дате рождения"
      aboutTitle="Что показывает нумерология"
      aboutParagraphs={ABOUT_PARAGRAPHS}
      resultLabel="Твоё число пути"
      linesTitle="Что входит в разбор"
      linesSubtitle="Число пути — только начало. В полном разборе считаются шесть позиций"
      lines={LINES}
      exampleTitle="Как выглядит разбор"
      exampleSubtitle="Фрагмент настоящего текста. Дата 26 июля 1990, число пути 7"
      exampleParagraphs={SAMPLE_PARAGRAPHS}
      exampleFooter="Полный разбор — шесть позиций и связь с остальными системами"
      faqTitle="Вопросы о нумерологии"
      faq={FAQ}
      otherTitle="Эти пять считают тебя иначе"
      otherSubtitle="Нумерология работает с цифрами даты. Остальные пять смотрят с других сторон и складываются с ней в один профиль"
      finalTitle="Посчитай свои числа"
      finalSubtitle="Число пути и квадрат Пифагора бесплатно"
      calculator={(api) => <NumerologyCalculator {...api} />}
      resultVisual={({ result, fast, reduced }) => (
        <OrbitStage value={result.path} speedFactor={fast ? 4 : 1} still={reduced} />
      )}
      resultContent={(ctx) => <NumerologyResultContent {...ctx} />}
      explainBlock={(ctx) => <SquareBlock ctx={ctx} />}
    />
  );
}
