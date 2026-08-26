import { Link } from "@tanstack/react-router";
import { directions, type Direction } from "@/lib/directions";

const CARD_GRADIENT =
  "linear-gradient(to bottom, rgba(3,25,30,0) 40%, rgba(3,25,30,0.6) 62%, rgba(3,25,30,0.9) 82%, rgba(3,25,30,0.97) 100%)";

type Props = {
  currentId?: Direction["id"];
  title?: string;
  subtitle?: string;
};

export function OtherDirections({
  currentId,
  title = "Эти пять считают тебя иначе",
  subtitle = "Матрица описывает устройство. Остальные пять смотрят с других сторон и складываются с ней в один профиль",
}: Props = {}) {
  const items = directions.filter((d) => d.id !== currentId);

  return (
    <section
      className="relative w-full bg-bg-page"
      style={{
        paddingTop: "clamp(80px, 9vh, 140px)",
        paddingBottom: "clamp(80px, 9vh, 140px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,40px)]">
        <h2
          className="text-center font-display text-text-primary"
          style={{ fontSize: "clamp(30px, 3vw, 52px)", lineHeight: 1.1 }}
        >
          {title}
        </h2>
        <p
          className="mx-auto mt-[14px] max-w-[760px] text-center text-text-secondary"
          style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.55 }}
        >
          {subtitle}
        </p>

        <div className="other-dirs-track mt-11 flex gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-5">
          {items.map((d) => (
            <Link
              key={d.id}
              to={d.path}
              className="group relative aspect-square w-[62vw] shrink-0 overflow-hidden rounded-[18px] border border-border transition duration-300 hover:-translate-y-[6px] hover:border-text-accent/60 motion-reduce:hover:translate-y-0 md:w-auto md:shrink"
              style={{ scrollSnapAlign: "start" }}
            >
              <img
                src={d.image}
                alt={d.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundImage: CARD_GRADIENT }}
              />
              <span
                className="absolute inset-x-0 bottom-0 block px-4 pb-4 font-display text-text-primary"
                style={{ fontSize: "clamp(16px, 1.3vw, 21px)", lineHeight: 1.2 }}
              >
                {d.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
