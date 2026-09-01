import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { DateSelects, type DateParts } from "@/components/direction/DateCalculator";
import { directions } from "@/lib/directions";
import { formatBirthDate, takeProfileSaveError, toIsoDate } from "@/lib/pendingBirth";
import { arcana, centralArcanum, isValidDate, MONTHS } from "@/lib/arcana";
import { lifePath, lifePathNumber } from "@/lib/numerology";
import { sunSign } from "@/lib/natal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/_authenticated/cabinet")({
  head: () => ({
    meta: [
      { title: "Мой кабинет — Моя Эра" },
      {
        name: "description",
        content: "Личный кабинет Моя Эра: расчёты по шести системам, карта дня и профиль.",
      },
      { property: "og:title", content: "Мой кабинет — Моя Эра" },
      {
        property: "og:description",
        content: "Твой профиль, карта дня и расчёты по шести системам.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CabinetPage,
});

type Profile = {
  id: string;
  name: string;
  birth_date: string | null;
  birth_time: string | null;
  birth_place: string | null;
};

const cardStyle = {
  background: "var(--surface-1)",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  padding: "28px",
} as const;

const capStyle = {
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
} as const;

/** Детерминированный выбор карты дня: id пользователя + дата. */
function dayArcanum(userId: string, isoDay: string): number {
  const seed = `${userId}:${isoDay}`;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (Math.abs(h) % 22) + 1;
}

function parseDate(iso: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { day: d, month: m, year: y };
}

function todayIso() {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

function CabinetPage() {
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (takeProfileSaveError()) setSaveError(true);
  }, []);

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

  function startEditing() {
    setEditing(true);
    profileRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="relative min-h-screen w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <div
        className="mx-auto w-full max-w-[1240px] px-[clamp(24px,5vw,40px)]"
        style={{
          paddingTop: "clamp(60px, 8vh, 110px)",
          paddingBottom: "clamp(60px, 8vh, 110px)",
        }}
      >
        <h1
          className="font-display text-text-primary"
          style={{ fontSize: "clamp(30px, 3vw, 48px)", lineHeight: 1.08 }}
        >
          Мой кабинет
        </h1>
        <p
          className="mt-[10px] text-text-secondary"
          style={{ fontSize: "clamp(14px, 1.1vw, 17px)" }}
        >
          {profile?.birth_date
            ? formatBirthDate(profile.birth_date)
            : "Дата рождения не заполнена"}
        </p>

        {saveError && (
          <p
            className="mt-6 text-[14px]"
            style={{
              background: "var(--surface-1)",
              borderRadius: "10px",
              padding: "14px",
              color: "var(--text-danger)",
            }}
          >
            Не удалось сохранить дату рождения. Заполни её в профиле
          </p>
        )}

        {/* Первый ряд */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row">
          <div className="md:w-[42%]" ref={profileRef}>
            <ProfileCard
              profile={profile}
              loading={loading}
              editing={editing}
              onEdit={startEditing}
              onCancel={() => setEditing(false)}
              onSaved={(next) => {
                setProfile(next);
                setEditing(false);
              }}
            />
          </div>
          <div className="md:w-[54%]">
            <DayCard userId={user?.id ?? ""} />
          </div>
        </div>

        {/* Второй ряд */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {directions.map((d) => (
            <DirectionTile key={d.id} id={d.id} title={d.title} birth={birth} onFill={startEditing} />
          ))}
        </div>

        {/* Третий ряд */}
        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <div>
            <div className="text-text-secondary" style={capStyle}>
              Твой тариф
            </div>
            <div
              className="mt-1 font-display text-text-primary"
              style={{ fontSize: "clamp(18px, 1.4vw, 24px)" }}
            >
              Бесплатный
            </div>
          </div>
          <a
            href="#pricing"
            className="inline-flex h-[54px] items-center justify-center px-7 text-[16px] transition-opacity hover:opacity-90"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground, #12100e)",
              borderRadius: "12px",
            }}
          >
            Открыть пробный доступ
          </a>
        </div>

        <div className="mt-8">
          <Pricing />
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4"
      style={{ fontSize: "clamp(14px, 1.05vw, 16px)" }}
    >
      <span className="text-text-secondary">{label}</span>
      {value ? (
        <span className="text-text-primary">{value}</span>
      ) : (
        <span className="text-text-secondary opacity-50">не указано</span>
      )}
    </div>
  );
}

function ProfileCard({
  profile,
  loading,
  editing,
  onEdit,
  onCancel,
  onSaved,
}: {
  profile: Profile | null;
  loading: boolean;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSaved: (next: Profile) => void;
}) {
  const [name, setName] = useState(profile?.name ?? "Мой профиль");
  const [place, setPlace] = useState(profile?.birth_place ?? "");
  const parsed = parseDate(profile?.birth_date ?? null);
  const [date, setDate] = useState<DateParts>({
    day: parsed ? String(parsed.day) : "",
    month: parsed ? String(parsed.month) : "",
    year: parsed ? String(parsed.year) : "",
  });
  const time = (profile?.birth_time ?? "").slice(0, 5).split(":");
  const [hour, setHour] = useState(time[0] ?? "");
  const [minute, setMinute] = useState(time[1] ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) return;
    setName(profile?.name ?? "Мой профиль");
    setPlace(profile?.birth_place ?? "");
    const p = parseDate(profile?.birth_date ?? null);
    setDate({
      day: p ? String(p.day) : "",
      month: p ? String(p.month) : "",
      year: p ? String(p.year) : "",
    });
    const t = (profile?.birth_time ?? "").slice(0, 5).split(":");
    setHour(t[0] ?? "");
    setMinute(t[1] ?? "");
    setError(null);
  }, [editing, profile]);

  async function save() {
    if (!profile) return;
    const d = Number(date.day);
    const m = Number(date.month);
    const y = Number(date.year);
    const hasDate = date.day !== "" && date.month !== "" && date.year !== "";
    if (hasDate && !isValidDate(d, m, y)) {
      setError("Такой даты не существует");
      return;
    }
    setBusy(true);
    const next = {
      name: name.trim() || "Мой профиль",
      birth_date: hasDate ? toIsoDate(d, m, y) : null,
      birth_time: hour !== "" && minute !== "" ? `${hour}:${minute}` : null,
      birth_place: place.trim() || null,
    };
    const { error: updateError } = await supabase
      .from("profiles")
      .update(next)
      .eq("id", profile.id);
    setBusy(false);
    if (updateError) {
      setError("Не удалось сохранить. Попробуй ещё раз");
      return;
    }
    onSaved({ ...profile, ...next });
  }

  const timeSelect =
    "qc-focus h-14 w-full appearance-none rounded-[12px] border border-border bg-surface-1 px-4 text-[17px] text-text-primary transition-colors focus:border-text-accent";
  const inputClass =
    "qc-focus h-14 w-full rounded-[12px] border border-border bg-surface-1 px-4 text-[17px] text-text-primary transition-colors focus:border-text-accent";

  return (
    <div style={cardStyle} className="h-full">
      <div className="text-text-secondary" style={capStyle}>
        Профиль
      </div>

      {editing && profile ? (
        <div className="mt-4 flex flex-col gap-3">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Имя профиля"
            maxLength={60}
          />
          <DateSelects idPrefix="cab-date" value={date} onChange={setDate} />
          <div className="flex gap-3">
            <select
              className={timeSelect}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              aria-label="Часы"
            >
              <option value="">Часы</option>
              {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              className={timeSelect}
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              aria-label="Минуты"
            >
              <option value="">Минуты</option>
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <input
            className={inputClass}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Место рождения"
            aria-label="Место рождения"
            maxLength={120}
          />
          {error && <p className="text-[13px]" style={{ color: "var(--text-danger)" }}>{error}</p>}
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex h-[50px] items-center justify-center px-6 text-[16px] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground, #12100e)",
                borderRadius: "12px",
              }}
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-[15px] text-text-secondary hover:text-text-primary"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="mt-[10px] font-display text-text-primary"
            style={{ fontSize: "clamp(20px, 1.6vw, 26px)" }}
          >
            {loading ? "…" : (profile?.name ?? "Мой профиль")}
          </div>

          <div className="mt-4 flex flex-col" style={{ gap: 10 }}>
            <Row
              label="Дата"
              value={profile?.birth_date ? formatBirthDate(profile.birth_date) : null}
            />
            <Row label="Время" value={profile?.birth_time?.slice(0, 5) ?? null} />
            <Row label="Место" value={profile?.birth_place ?? null} />
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="mt-[18px] block text-[15px] text-text-accent hover:opacity-80"
          >
            Изменить
          </button>

          {(!profile?.birth_time || !profile?.birth_place) && (
            <p className="mt-2 text-[13px] text-text-secondary">
              Добавь время и место — откроются натальная карта и дизайн человека
            </p>
          )}
        </>
      )}
    </div>
  );
}

function DayCard({ userId }: { userId: string }) {
  const iso = useMemo(todayIso, []);
  const n = useMemo(() => (userId ? dayArcanum(userId, iso) : 1), [userId, iso]);
  const card = arcana.find((a) => a.n === n);
  const [y, m, d] = iso.split("-").map(Number);
  const dateWords = `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;

  return (
    <div style={cardStyle} className="h-full">
      <div className="flex items-baseline gap-3 text-text-secondary" style={capStyle}>
        <span>Карта дня</span>
        <span style={{ textTransform: "none", letterSpacing: 0 }}>{dateWords}</span>
      </div>

      <div
        className="mt-3 text-text-accent"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(44px, 4vw, 72px)", lineHeight: 1 }}
      >
        {n}
      </div>
      <div
        className="mt-1 font-display text-text-primary"
        style={{ fontSize: "clamp(22px, 1.8vw, 30px)" }}
      >
        {card?.name}
      </div>
      <p
        className="mt-[14px] text-text-secondary"
        style={{
          fontSize: "clamp(14px, 1.1vw, 17px)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {card?.draw}
      </p>
      <a href="/taro" className="mt-3 inline-block text-[15px] text-text-accent hover:opacity-80">
        Открыть целиком
      </a>
    </div>
  );
}

type Birth = { day: number; month: number; year: number } | null;

function tileResult(id: string, birth: Birth): { value: string; mono?: boolean } | { status: string } {
  if (id === "tarot") return { status: "Расклад доступен" };
  if (id === "humandesign") return { status: "Нужен полный расчёт" };
  if (!birth) return { status: "Заполни дату рождения" };

  if (id === "matrix") {
    const n = centralArcanum(birth.day, birth.month, birth.year);
    const card = arcana.find((a) => a.n === n);
    return { value: `${n} · ${card?.name ?? ""}`, mono: true };
  }
  if (id === "numerology") {
    const n = lifePathNumber(birth.day, birth.month, birth.year);
    const item = lifePath.find((l) => l.n === n);
    return { value: `${n} · ${item?.title ?? ""}`, mono: true };
  }
  if (id === "natal") {
    const { sign } = sunSign(birth.day, birth.month);
    return { value: sign.title };
  }
  return { status: "Добавь профиль близкого" };
}

function DirectionTile({
  id,
  title,
  birth,
  onFill,
}: {
  id: string;
  title: string;
  birth: Birth;
  onFill: () => void;
}) {
  const res = tileResult(id, birth);
  const needsDate = !birth && id !== "tarot";

  const body = (
    <>
      <div className="font-display text-text-primary" style={{ fontSize: "clamp(18px, 1.4vw, 24px)" }}>
        {title}
      </div>
      <div className="mt-3">
        {"value" in res ? (
          <span
            className="text-text-accent"
            style={{
              fontSize: "clamp(20px, 1.7vw, 28px)",
              fontFamily: res.mono ? "'JetBrains Mono', monospace" : undefined,
            }}
          >
            {res.value}
          </span>
        ) : (
          <span
            className="text-text-secondary"
            style={{ fontSize: "clamp(14px, 1.05vw, 16px)" }}
          >
            {res.status}
          </span>
        )}
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-4 right-5 text-text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        →
      </span>
    </>
  );

  const className =
    "group relative block w-full text-left transition-all duration-300 hover:-translate-y-1";
  const style = {
    background: "var(--surface-1)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "24px",
  } as const;

  if (needsDate) {
    return (
      <button type="button" onClick={onFill} className={`${className} cab-tile`} style={style}>
        {body}
      </button>
    );
  }

  return (
    <a href={`/cabinet/${id}`} className={`${className} cab-tile`} style={style}>
      {body}
    </a>
  );
}
