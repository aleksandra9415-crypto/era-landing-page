import { directions } from "@/lib/directions";
import { Section } from "./Section";

export function DirectionsGrid() {
  return (
    <Section
      id="directions"
      title="Шесть систем, один профиль"
      subtitle="Обычно сервисы считают одну-две системы. Здесь — все шесть, и они видят друг друга"
    >
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {directions.map((d) => (
          <article key={d.id} className="flex flex-col">
            <div className="overflow-hidden rounded-[20px] border border-border">
              <img
                src={d.image}
                alt={d.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
            <h3
              className="mt-5 font-display text-text-primary"
              style={{ fontSize: 26, fontWeight: 400, letterSpacing: "0.01em" }}
            >
              {d.title}
            </h3>
            <p className="mt-2 text-text-secondary" style={{ fontSize: 15 }}>
              {d.desc}
            </p>
            <a
              href="#quick-calc"
              className="mt-4 self-start text-text-accent underline-offset-4 hover:underline"
              style={{ fontSize: 15 }}
            >
              Подробнее
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}
