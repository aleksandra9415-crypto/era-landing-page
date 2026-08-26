export const lifePath = [
  { n: 1, title: "Начало", line: "Умение начинать и вести за собой" },
  { n: 2, title: "Согласие", line: "Чуткость к другим и способность договариваться" },
  { n: 3, title: "Выражение", line: "Лёгкость слова и умение находить точную формулировку" },
  { n: 4, title: "Опора", line: "Порядок и терпение в долгой работе" },
  { n: 5, title: "Перемена", line: "Тяга к новому и способность быстро перестраиваться" },
  { n: 6, title: "Забота", line: "Ответственность за близкий круг и умение держать дом" },
  { n: 7, title: "Понимание", line: "Потребность разбираться в устройстве вещей" },
  { n: 8, title: "Масштаб", line: "Способность управлять ресурсами и держать большое" },
  { n: 9, title: "Широта", line: "Дальний взгляд и умение отпускать" },
  { n: 11, title: "Чувствование", line: "Обострённая чуткость к тому, что не проговаривают" },
  {
    n: 22,
    title: "Воплощение",
    line: "Способность доводить крупные замыслы до конкретного результата",
  },
] as const;

export const squareLabels = [
  "характер",
  "энергия",
  "интерес",
  "здоровье",
  "логика",
  "труд",
  "удача",
  "долг",
  "память",
];

const digits = (s: string) => s.split("").map(Number);

/** Все цифры даты в формате день, месяц, год. */
export function dateDigits(day: number, month: number, year: number): number[] {
  return digits(`${day}${month}${year}`);
}

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

/** Число жизненного пути. 11 и 22 не сворачиваются. */
export function lifePathNumber(day: number, month: number, year: number): number {
  let total = sum(dateDigits(day, month, year));
  while (total > 9 && total !== 11 && total !== 22) {
    total = sum(digits(String(total)));
  }
  return total;
}

export type PythagorasResult = {
  first: number;
  second: number;
  third: number;
  fourth: number;
  /** counts[1..9] */
  counts: Record<number, number>;
};

export function pythagoras(day: number, month: number, year: number): PythagorasResult {
  const dd = dateDigits(day, month, year);
  const first = sum(dd);
  const second = sum(digits(String(first)));
  const firstDayDigit = Number(String(day)[0]);
  const third = first - 2 * firstDayDigit;
  const fourth = sum(digits(String(Math.abs(third))));

  const all = [
    ...dd,
    ...digits(String(first)),
    ...digits(String(second)),
    ...digits(String(Math.abs(third))),
    ...digits(String(fourth)),
  ];

  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  for (const d of all) if (d >= 1 && d <= 9) counts[d] = (counts[d] ?? 0) + 1;

  return { first, second, third, fourth, counts };
}
