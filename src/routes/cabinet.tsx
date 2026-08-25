import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { directions } from "@/lib/directions";

export const Route = createFileRoute("/cabinet")({
  head: () => ({
    meta: [
      { title: "Мой кабинет — Моя Эра" },
      {
        name: "description",
        content: "Личный кабинет Моя Эра: расчёты по шести системам, дневник и профили близких.",
      },
      { property: "og:title", content: "Мой кабинет — Моя Эра" },
      {
        property: "og:description",
        content: "Здесь появятся твои расчёты, дневник и профили близких.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CabinetPage,
});

function CabinetPage() {
  return (
    <main className="relative min-h-screen w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <div
        className="mx-auto w-full max-w-[1100px] px-[clamp(24px,5vw,40px)]"
        style={{
          paddingTop: "clamp(100px, 14vh, 180px)",
          paddingBottom: "clamp(100px, 14vh, 180px)",
        }}
      >
        <h1
          className="font-display text-text-primary"
          style={{ fontSize: "clamp(30px, 3vw, 46px)", lineHeight: 1.08 }}
        >
          Мой кабинет
        </h1>
        <p className="mt-[10px] text-[15px] text-text-secondary">
          Здесь появятся твои расчёты, дневник и профили близких
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {directions.map((d) => (
            <div
              key={d.id}
              className="border bg-surface-1 opacity-60"
              style={{ borderRadius: "16px", padding: "24px", borderColor: "var(--border)" }}
            >
              <div className="font-display text-text-primary text-[20px]">{d.title}</div>
              <div className="mt-2 text-[13px] text-text-secondary">Пока не рассчитано</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[13px] text-text-secondary opacity-60">
          Страница-заготовка. Личный кабинет в разработке.
        </p>
      </div>

      <Footer />
    </main>
  );
}
