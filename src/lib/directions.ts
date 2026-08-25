export type Direction = {
  id: string;
  title: string;
  description: string;
  /** simple line glyph, drawn on a 32x32 viewBox */
  glyph: "matrix" | "natal" | "human" | "numbers" | "tarot" | "sync";
};

/** Single source of truth for the ring and its center card. */
export const DIRECTIONS: Direction[] = [
  {
    id: "matrix",
    title: "Матрица судьбы",
    description: "Твой рисунок в 22 арканах",
    glyph: "matrix",
  },
  {
    id: "natal",
    title: "Натальная карта",
    description: "Небо в минуту твоего рождения",
    glyph: "natal",
  },
  {
    id: "human",
    title: "Дизайн человека",
    description: "Как ты устроен на самом деле",
    glyph: "human",
  },
  {
    id: "numbers",
    title: "Нумерология",
    description: "Числа, из которых ты собран",
    glyph: "numbers",
  },
  { id: "tarot", title: "Таро", description: "Вопрос, заданный вовремя", glyph: "tarot" },
  { id: "sync", title: "Совместимость", description: "Вы двое как одна система", glyph: "sync" },
];
