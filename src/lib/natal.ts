export type SunSign = {
  key: string;
  name: string;
  line: string;
  detail: string;
};

export const sunSigns: SunSign[] = [
  { key: "aries", name: "Овен", line: "Действие раньше сомнения", detail: "" },
  { key: "taurus", name: "Телец", line: "Устойчивость и вкус к осязаемому", detail: "" },
  { key: "gemini", name: "Близнецы", line: "Скорость мысли и лёгкость связей", detail: "" },
  { key: "cancer", name: "Рак", line: "Память, дом и чувство своих", detail: "" },
  { key: "leo", name: "Лев", line: "Потребность в отклике и щедрость", detail: "" },
  { key: "virgo", name: "Дева", line: "Внимание к деталям и польза", detail: "" },
  { key: "libra", name: "Весы", line: "Чувство меры и потребность в другом", detail: "" },
  { key: "scorpio", name: "Скорпион", line: "Глубина и неспособность к полумерам", detail: "" },
  { key: "sagittarius", name: "Стрелец", line: "Дальний горизонт и вера в дорогу", detail: "" },
  { key: "capricorn", name: "Козерог", line: "Терпение и работа вдолгую", detail: "" },
  { key: "aquarius", name: "Водолей", line: "Своя логика и дистанция к общему", detail: "" },
  { key: "pisces", name: "Рыбы", line: "Чуткость и подвижные границы", detail: "" },
];

/** Границы знаков: [день начала, месяц начала, день конца, месяц конца] */
type SignKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

const RANGES: Record<SignKey, [number, number, number, number]> = {
  aries: [21, 3, 19, 4],
  taurus: [20, 4, 20, 5],
  gemini: [21, 5, 20, 6],
  cancer: [21, 6, 22, 7],
  leo: [23, 7, 22, 8],
  virgo: [23, 8, 22, 9],
  libra: [23, 9, 22, 10],
  scorpio: [23, 10, 21, 11],
  sagittarius: [22, 11, 21, 12],
  capricorn: [22, 12, 19, 1],
  aquarius: [20, 1, 18, 2],
  pisces: [19, 2, 20, 3],
};

const ORDER = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type SunSignResult = {
  sign: SunSign;
  /** true, если дата попадает на первый или последний день диапазона знака */
  onCusp: boolean;
};

/** Знак Солнца по дню и месяцу рождения. */
export function sunSign(day: number, month: number): SunSignResult {
  for (const key of ORDER) {
    const [sd, sm, ed, em] = RANGES[key];
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd = month < em || (month === em && day <= ed);
    if (afterStart && beforeEnd) {
      const onCusp = (month === sm && day === sd) || (month === em && day === ed);
      return { sign: sunSigns.find((s) => s.key === key)!, onCusp };
    }
  }
  // не должно случиться для валидной даты
  return { sign: sunSigns[11], onCusp: false };
}
