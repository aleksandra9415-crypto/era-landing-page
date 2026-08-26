const matrixLines = [
  {
    n: "01",
    title: "Характер",
    text: "Центральный аркан и линия личности: сильные стороны, слепые зоны и то, к чему возвращаешься снова и снова",
  },
  {
    n: "02",
    title: "Отношения",
    text: "Что ищешь в паре, что готов давать и какие сценарии повторяются от партнёра к партнёру",
  },
  {
    n: "03",
    title: "Деньги",
    text: "Через что приходят ресурсы, какая работа даётся легче и что чаще всего мешает доводить до денег",
  },
  {
    n: "04",
    title: "Реализация",
    text: "Линия таланта и социального проявления: в чём ты сильнее среднего и где это применимо",
  },
  {
    n: "05",
    title: "Род",
    text: "Что пришло по материнской и отцовской линии — качества, которые достались до того, как ты начал выбирать",
  },
  {
    n: "06",
    title: "Повторения",
    text: "Сценарии, которые возвращаются, пока их не заметишь. Не приговор — описание петли и того, где у неё вход",
  },
];

export function MatrixLines() {
  return (
    <section
      className="relative w-full bg-bg-page"
      style={{
        paddingTop: "clamp(80px, 9vh, 140px)",
        paddingBottom: "clamp(80px, 9vh, 140px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-[4vw] md:px-6">
        <h2
          className="text-center font-display text-text-primary"
          style={{ fontSize: "clamp(30px, 3vw, 52px)", lineHeight: 1.1 }}
        >
          Что входит в разбор
        </h2>
        <p
          className="mx-auto text-center text-text-secondary"
          style={{ marginTop: 14, fontSize: "clamp(15px, 1.2vw, 19px)", maxWidth: 720 }}
        >
          22 позиции матрицы разложены по шести линиям
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 24, marginTop: 48 }}
        >
          {matrixLines.map((l) => (
            <div
              key={l.n}
              className="bg-surface-1"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: 28,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--text-accent)" }}>
                {l.n}
              </div>
              <h3
                className="font-display text-text-primary"
                style={{ marginTop: 10, fontSize: "clamp(19px, 1.5vw, 25px)", lineHeight: 1.2 }}
              >
                {l.title}
              </h3>
              <p
                className="text-text-secondary"
                style={{ marginTop: 10, fontSize: "clamp(14px, 1.05vw, 16px)", lineHeight: 1.6 }}
              >
                {l.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
