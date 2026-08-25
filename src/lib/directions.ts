import matrixImg from "@/assets/matrix.png.asset.json";
import natalImg from "@/assets/natal.png.asset.json";
import humandesignImg from "@/assets/humandesign2.png.asset.json";
import numerologyImg from "@/assets/numerology.png.asset.json";
import tarotImg from "@/assets/tarot.png.asset.json";
import synastryImg from "@/assets/synastry2.png.asset.json";

export type Direction = {
  id: "matrix" | "natal" | "humandesign" | "numerology" | "tarot" | "synastry";
  title: string;
  desc: string;
  image: string;
};

/** Single source of truth for the wheel. */
export const directions: Direction[] = [
  { id: "matrix", title: "Матрица судьбы", desc: "Твой рисунок в 22 арканах", image: matrixImg.url },
  { id: "natal", title: "Натальная карта", desc: "Небо в минуту твоего рождения", image: natalImg.url },
  { id: "humandesign", title: "Дизайн человека", desc: "Как ты устроен на самом деле", image: humandesignImg.url },
  { id: "numerology", title: "Нумерология", desc: "Числа, из которых ты собран", image: numerologyImg.url },
  { id: "tarot", title: "Таро", desc: "Вопрос, заданный вовремя", image: tarotImg.url },
  { id: "synastry", title: "Совместимость", desc: "Вы двое как одна система", image: synastryImg.url },
];
