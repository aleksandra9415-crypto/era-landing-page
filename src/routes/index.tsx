import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { StarField } from "@/components/hero/StarField";
import { DirectionWheel } from "@/components/hero/DirectionWheel";
import { ForegroundArc } from "@/components/hero/ForegroundArc";
import { Headline } from "@/components/hero/Headline";
import { Grain } from "@/components/hero/Grain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Моя.Эра — шесть систем, один твой рисунок" },
      {
        name: "description",
        content:
          "Матрица судьбы, натальная карта, дизайн человека, нумерология, таро и совместимость — шесть расчётов по дате рождения в одном сервисе.",
      },
      { property: "og:title", content: "Моя.Эра — шесть систем, один твой рисунок" },
      {
        property: "og:description",
        content:
          "Шесть систем считают тебя по-разному. И сходятся. Начни с бесплатного расчёта в Моя.Эра.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-bg-page">
      <StarField />
      <ForegroundArc />
      <Grain />
      <Header />

      <div className="absolute inset-0 z-[12]">
        <DirectionWheel />
      </div>

      <div className="pointer-events-none relative z-[15] mx-auto flex h-full max-w-[1440px] items-start px-6 pt-28 md:items-center md:justify-end md:px-12 md:pt-0">
        <div className="pointer-events-auto md:max-w-[46%]">
          <Headline />
        </div>
      </div>
    </main>
  );
}
