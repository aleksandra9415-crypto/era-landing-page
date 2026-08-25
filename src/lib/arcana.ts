export const arcana = [
  { n: 1, name: "Маг", line: "Умение начинать и делать своими руками" },
  { n: 2, name: "Жрица", line: "Внутреннее знание, которое приходит раньше объяснений" },
  { n: 3, name: "Императрица", line: "Способность создавать и заботиться" },
  { n: 4, name: "Император", line: "Опора, структура, умение держать форму" },
  { n: 5, name: "Иерофант", line: "Поиск смысла и своей системы правил" },
  { n: 6, name: "Влюблённые", line: "Выбор, который делается сердцем" },
  { n: 7, name: "Колесница", line: "Движение вперёд и умение им управлять" },
  { n: 8, name: "Справедливость", line: "Чувство меры и внутренний баланс" },
  { n: 9, name: "Отшельник", line: "Потребность в тишине и собственном темпе" },
  { n: 10, name: "Колесо Фортуны", line: "Умение видеть циклы и попадать в момент" },
  { n: 11, name: "Сила", line: "Мягкая устойчивость, которая не ломает" },
  { n: 12, name: "Повешенный", line: "Способность посмотреть на всё под другим углом" },
  { n: 13, name: "Перерождение", line: "Умение отпускать и начинать заново" },
  { n: 14, name: "Умеренность", line: "Искусство соединять несоединимое" },
  { n: 15, name: "Искушение", line: "Сила желания и умение с ней обходиться" },
  { n: 16, name: "Обновление", line: "Быстрые перемены, которые расчищают место" },
  { n: 17, name: "Звезда", line: "Ясность цели и способность вдохновлять" },
  { n: 18, name: "Луна", line: "Чуткость к тому, что скрыто от других" },
  { n: 19, name: "Солнце", line: "Открытость и умение согревать" },
  { n: 20, name: "Пробуждение", line: "Способность честно оценивать и меняться" },
  { n: 21, name: "Мир", line: "Целостность и широкий взгляд" },
  { n: 22, name: "Шут", line: "Свобода и готовность к неизвестному" },
] as const;

export const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/** Свёртка: пока число больше 22 — складываем его цифры. */
export function reduceTo22(value: number): number {
  let n = value;
  while (n > 22) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

export function digitSum(value: number): number {
  return String(value)
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
}

/** Центральный аркан матрицы судьбы: число от 1 до 22. */
export function centralArcanum(day: number, month: number, year: number): number {
  const a = reduceTo22(day);
  const b = month;
  const c = reduceTo22(digitSum(year));
  const d = reduceTo22(a + b + c);
  return reduceTo22(a + b + c + d);
}

export function isValidDate(day: number, month: number, year: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
}
