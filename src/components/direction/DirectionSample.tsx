import { Section } from "@/components/landing/Section";

export function DirectionSample({
  title,
  subtitle,
  paragraphs,
  footer,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
  footer: string;
}) {
  return (
    <Section
      id="sample"
      title={title}
      className="!pt-[clamp(80px,9vh,140px)] !pb-[clamp(80px,9vh,140px)]"
    >
      <div className="mx-auto mt-14 w-full max-w-[860px]">
        <p
          className="text-center text-text-secondary"
          style={{ fontSize: "clamp(15px, 1.2vw, 19px)" }}
        >
          {subtitle}
        </p>

        <div
          className="relative mt-9 overflow-hidden"
          style={{ height: "clamp(360px, 42vh, 520px)" }}
        >
          <div
            className="flex flex-col text-text-primary"
            style={{
              fontSize: "clamp(16px, 1.25vw, 20px)",
              lineHeight: 1.75,
              gap: 18,
            }}
          >
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
            style={{
              height: 180,
              background: "linear-gradient(to bottom, rgba(3,25,30,0), var(--bg-page))",
            }}
          />
        </div>

        <p
          className="text-center text-text-secondary"
          style={{ marginTop: 8, fontSize: "clamp(15px, 1.15vw, 18px)" }}
        >
          {footer}
        </p>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            className="qc-focus rounded-[12px] bg-accent text-[17px] font-medium text-primary-foreground"
            style={{ height: 54, paddingInline: 40 }}
          >
            Открыть полный разбор
          </button>
        </div>
      </div>
    </Section>
  );
}
