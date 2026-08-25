export type Direction = {
  id: "matrix" | "natal" | "humandesign" | "numerology" | "tarot" | "synastry";
  title: string;
  desc: string;
};

/** Single source of truth for the wheel. */
export const directions: Direction[] = [
  { id: "matrix", title: "Матрица судьбы", desc: "Твой рисунок в 22 арканах" },
  { id: "natal", title: "Натальная карта", desc: "Небо в минуту твоего рождения" },
  { id: "humandesign", title: "Дизайн человека", desc: "Как ты устроен на самом деле" },
  { id: "numerology", title: "Нумерология", desc: "Числа, из которых ты собран" },
  { id: "tarot", title: "Таро", desc: "Вопрос, заданный вовремя" },
  { id: "synastry", title: "Совместимость", desc: "Вы двое как одна система" },
];
