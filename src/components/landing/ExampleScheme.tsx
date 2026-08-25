import { Section } from "./Section";

export function ExampleScheme() {
  return (
    <Section
      title="Каждое число можно проверить"
      subtitle="Матрица — это арифметика. Мы показываем, откуда взялось каждое число в твоём разборе"
    >
      <div
        className="mt-12 flex items-center justify-center rounded-[20px] border border-border bg-surface-1"
        style={{ height: 480 }}
      >
        <p className="text-text-secondary" style={{ fontSize: 15 }}>
          Здесь будет интерактивная схема расчёта
        </p>
      </div>
    </Section>
  );
}
