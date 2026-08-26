import { Section } from "@/components/landing/Section";

export function MatrixSample() {
  return (
    <Section
      id="sample"
      title="Как выглядит разбор"
      className="!pt-[clamp(80px,9vh,140px)] !pb-[clamp(80px,9vh,140px)]"
    >
      <div className="mx-auto mt-14 w-full max-w-[860px]">
        <p
          className="text-center text-text-secondary"
          style={{ fontSize: "clamp(15px, 1.2vw, 19px)" }}
        >
          Фрагмент настоящего текста. Дата 26 июля 1990, центральный аркан 5
        </p>

        <div
          className="relative mt-9 overflow-hidden"
          style={{ height: "clamp(360px, 42vh, 520px)" }}
        >
          <div
            className="flex flex-col text-text-primary"
            style={{
              fontSize: "clamp(16px, 1.25vw, 20px)",
              lineHeight: 1.75,
              gap: 18,
            }}
          >
            <p>
              Центральный аркан 5 ставит тебя в положение человека, которому нужна не подсказка, а
              устройство. Ты плохо переносишь ответы без объяснения: даже верный совет, поданный как
              готовый вывод, вызывает сопротивление. Зато любая система, в которой видно, как одно
              следует из другого, схватывается быстро и надолго.
            </p>
            <p>
              В отношениях это проявляется мягче, чем можно ожидать. Тебе важно не согласие, а
              понятность: почему человек поступает так, откуда у него это взялось, по каким правилам
              он живёт. Партнёр, который не может объяснить себя, утомляет сильнее, чем партнёр,
              который открыто не согласен.
            </p>
            <p>
              В работе пятый аркан почти всегда выводит к роли объясняющего. Это не обязательно
              преподавание — чаще это позиция человека, к которому приходят разобраться. Со временем
              возникает побочный эффект, о котором редко предупреждают: чем лучше ты объясняешь
              чужие системы, тем
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
            style={{
              height: 180,
              background: "linear-gradient(to bottom, rgba(3,25,30,0), var(--bg-page))",
            }}
          />
        </div>

        <p
          className="text-center text-text-secondary"
          style={{ marginTop: 8, fontSize: "clamp(15px, 1.15vw, 18px)" }}
        >
          Полный разбор — около 20 страниц по шести линиям
        </p>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
            style={{ height: 54, paddingInline: 40 }}
          >
            Открыть полный разбор
          </button>
        </div>
      </div>
    </Section>
  );
}
