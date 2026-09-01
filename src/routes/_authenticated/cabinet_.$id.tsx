import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { OtherDirections } from "@/components/landing/OtherDirections";
import { directions, type Direction } from "@/lib/directions";
import { directionLines } from "@/lib/directionLines";
import { arcana, centralArcanum } from "@/lib/arcana";
import { lifePath, lifePathNumber } from "@/lib/numerology";
import { sunSign } from "@/lib/natal";
import { dayArcanum, todayIso } from "@/lib/dayCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";

const IDS = directions.map((d) => d.id) as Direction["id"][];

export const Route = createFileRoute("/_authenticated/cabinet_/$id")({
  beforeLoad: ({ params }) => {
    if (!IDS.includes(params.id as Direction["id"])) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Разбор — Моя Эра" },
      {
        name: "description",
        content: "Разбор по направлению в личном кабинете Моя Эра: открытая часть и разделы полного разбора.",
      },
      { property: "og:title", content: "Разбор — Моя Эра" },
      { property: "og:description", content: "Открытая часть разбора и состав полного разбора." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReadingPage,
});

type Profile = {
  id: string;
  name: string;
  birth_date: string | null;
  birth_time: string | null;
  birth_place: string | null;
};

function parseDate(iso: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { day: d, month: m, year: y };
}

type Head =
  | { kind: "value"; number: string; name: string }
  | { kind: "note"; note: string };

function buildReading(
  id: Direction["id"],
  birth: { day: number; month: number; year: number },
  userId: string,
): { head: Head; openText: string | null } {
  if (id === "matrix") {
    const n = centralArcanum(birth.day, birth.month, birth.year);
    const card = arcana.find((a) => a.n === n);
    return {
      head: { kind: "value", number: String(n), name: card?.name ?? "" },
      openText: card?.detail ?? null,
    };
  }
  if (id === "numerology") {
    const n = lifePathNumber(birth.day, birth.month, birth.year);
    const item = lifePath.find((l) => l.n === n);
    return {
      head: { kind: "value", number: String(n), name: item?.title ?? "" },
      openText: item?.detail ?? null,
    };
  }
  if (id === "natal") {
    const { sign } = sunSign(birth.day, birth.month);
    return {
      head: { kind: "value", number: sign.symbol ?? "", name: sign.name },
      openText: sign.detail ?? null,
    };
  }
  if (id === "tarot") {
    const n = dayArcanum(userId, todayIso());
    const card = arcana.find((a) => a.n === n);
    return {
      head: { kind: "value", number: String(n), name: card?.name ?? "" },
      openText: card?.draw ?? null,
    };
  }
  if (id === "synastry") {
    return {
      head: {
        kind: "note",
        note: "Аркан пары считается по двум датам рождения. Второй профиль пока не добавлен",
      },
      openText: null,
    };
  }
  return {
    head: {
      kind: "note",
      note: "Бодиграф считается по двум картам и требует точного времени рождения",
    },
    openText: null,
  };
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: "var(--text-secondary)", opacity: 0.5, flexShrink: 0 }}
    >
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ReadingPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const direction = directions.find((d) => d.id === id)!;
  const lines = directionLines[direction.id];

  useEffect(() => {
    if (!user) return;
    let alive = true;
    supabase
      .from("profiles")
      .select("id, name, birth_date, birth_time, birth_place")
      .eq("user_id", user.id)
      .eq("is_owner", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (!alive) return;
        setProfile((data?.[0] as Profile | undefined) ?? null);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  const birth = parseDate(profile?.birth_date ?? null);

  const reading = useMemo(
    () => (birth ? buildReading(direction.id, birth, user?.id ?? "") : null),
    [direction.id, birth?.day, birth?.month, birth?.year, user?.id],
  );

  const openSection = reading?.openText ? lines[0] : null;
  const lockedSections = openSection ? lines.slice(1) : lines;

  return (
    <main className="relative min-h-screen w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <div
        className="mx-auto w-full max-w-[860px] px-[clamp(20px,5vw,40px)]"
        style={{
          paddingTop: "clamp(60px, 8vh, 110px)",
          paddingBottom: "clamp(60px, 8vh, 110px)",
        }}
      >
        <Link
          to="/cabinet"
          className="inline-block text-text-accent hover:opacity-80"
          style={{ fontSize: 14 }}
        >
          ← Все направления
        </Link>

        {!loading && !birth ? (
          <div className="mt-8">
            <h1
              className="font-display text-text-primary"
              style={{ fontSize: "clamp(30px, 3vw, 48px)", lineHeight: 1.08 }}
            >
              {direction.title}
            </h1>
            <p
              className="mt-4 text-text-secondary"
              style={{ fontSize: "clamp(15px, 1.2vw, 18px)" }}
            >
              Заполни дату рождения в профиле
            </p>
            <Link
              to="/cabinet"
              className="mt-4 inline-block text-text-accent hover:opacity-80"
              style={{ fontSize: 15 }}
            >
              Перейти в кабинет
            </Link>
          </div>
        ) : (
          <>
            <h1
              className="mt-8 font-display text-text-primary"
              style={{ fontSize: "clamp(30px, 3vw, 48px)", lineHeight: 1.08 }}
            >
              {direction.title}
            </h1>

            {reading && reading.head.kind === "value" ? (
              <div className="flex items-baseline gap-4" style={{ marginTop: 14 }}>
                <span
                  className="text-text-accent"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(36px, 3.2vw, 56px)",
                    lineHeight: 1,
                  }}
                >
                  {reading.head.number}
                </span>
                <span
                  className="font-display text-text-primary"
                  style={{ fontSize: "clamp(22px, 1.9vw, 32px)", lineHeight: 1.15 }}
                >
                  {reading.head.name}
                </span>
              </div>
            ) : (
              <p
                className="text-text-secondary"
                style={{ marginTop: 14, fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.6 }}
              >
                {reading?.head.kind === "note" ? reading.head.note : "…"}
              </p>
            )}

            {openSection && (
              <section>
                <h2
                  className="font-display text-text-primary"
                  style={{ marginTop: 44, fontSize: "clamp(22px, 1.8vw, 30px)", lineHeight: 1.2 }}
                >
                  {openSection.title}
                </h2>
                <p
                  className="text-text-primary"
                  style={{
                    marginTop: 16,
                    fontSize: "clamp(16px, 1.25vw, 20px)",
                    lineHeight: 1.7,
                  }}
                >
                  {reading?.openText}
                </p>
              </section>
            )}

            <div className="flex flex-col" style={{ marginTop: 32, gap: 14 }}>
              {lockedSections.map((l) => (
                <div
                  key={l.n}
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="font-display text-text-primary"
                      style={{
                        fontSize: "clamp(18px, 1.4vw, 24px)",
                        lineHeight: 1.2,
                        opacity: 0.7,
                      }}
                    >
                      {l.title}
                    </h3>
                    <LockIcon />
                  </div>
                  <p
                    className="text-text-secondary"
                    style={{
                      marginTop: 10,
                      fontSize: "clamp(14px, 1.05vw, 16px)",
                      lineHeight: 1.6,
                      opacity: 0.6,
                    }}
                  >
                    {l.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Блок перехода к оплате */}
            <div
              style={{
                marginTop: 44,
                background: "var(--surface-1)",
                border: "1px solid var(--text-accent)",
                borderRadius: 20,
                padding: "clamp(24px, 2.4vw, 40px)",
                boxShadow: "0 0 44px rgba(122, 93, 168, 0.18)",
              }}
            >
              <h2
                className="font-display text-text-primary"
                style={{ fontSize: "clamp(22px, 1.9vw, 32px)", lineHeight: 1.15 }}
              >
                Открыть разбор целиком
              </h2>
              <p
                className="text-text-secondary"
                style={{ marginTop: 12, fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}
              >
                {`Ещё ${numWord(lockedSections.length)} ${sectionWord(lockedSections.length)} по этому направлению и полные разборы по остальным пяти системам`}
              </p>
              <div className="flex items-baseline gap-3" style={{ marginTop: 20 }}>
                <span
                  className="text-text-primary"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(28px, 2.4vw, 40px)",
                    lineHeight: 1,
                  }}
                >
                  249 ₽
                </span>
                <span className="text-text-secondary" style={{ fontSize: 14 }}>
                  за три дня полного доступа
                </span>
              </div>
              <button
                type="button"
                onClick={() => {}}
                className="inline-flex h-[54px] items-center justify-center px-7 text-[16px] transition-opacity hover:opacity-90"
                style={{
                  marginTop: 20,
                  background: "var(--accent)",
                  color: "var(--accent-foreground, #12100e)",
                  borderRadius: 12,
                }}
              >
                Открыть пробный доступ
              </button>
              <p
                className="text-text-secondary"
                style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}
              >
                Через три дня — 690 ₽ в месяц, если не отменить
              </p>
            </div>
          </>
        )}
      </div>

      <OtherDirections currentId={direction.id} cabinetLinks />

      <Footer />
    </main>
  );
}

const WORDS = ["ноль", "один", "два", "три", "четыре", "пять", "шесть"];

function numWord(n: number) {
  return WORDS[n] ?? String(n);
}

function sectionWord(n: number) {
  if (n === 1) return "раздел";
  if (n >= 2 && n <= 4) return "раздела";
  return "разделов";
}
