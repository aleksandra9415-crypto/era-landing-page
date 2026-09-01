import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — Моя Эра" },
      {
        name: "description",
        content: "Вход в профиль Моя Эра: расчёты, дневник и профили близких в одном месте.",
      },
      { property: "og:title", content: "Вход — Моя Эра" },
      {
        property: "og:description",
        content: "Профиль хранит твои расчёты и дневник наблюдений.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const fieldCls =
  "w-full bg-surface-1 border text-text-primary placeholder:text-text-secondary px-4 outline-none focus-visible:border-text-accent";
const fieldStyle = { height: "52px", borderRadius: "12px", borderColor: "var(--border)" } as const;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);

    if (signInError) {
      const msg = (signInError.message || "").toLowerCase();
      if (msg.includes("credentials") || msg.includes("invalid") || msg.includes("confirm")) {
        setError("Неверная почта или пароль");
      } else {
        setError("Что-то пошло не так. Попробуй ещё раз");
      }
      return;
    }

    navigate({ to: "/cabinet" });
  }

  return (
    <main className="relative min-h-screen w-full bg-bg-page">
      <div className="relative h-[110px] w-full">
        <Header />
      </div>

      <div
        className="mx-auto w-full max-w-[420px] px-[clamp(24px,5vw,40px)]"
        style={{
          paddingTop: "clamp(100px, 14vh, 180px)",
          paddingBottom: "clamp(100px, 14vh, 180px)",
        }}
      >
        <h1
          className="font-display text-text-primary"
          style={{ fontSize: "clamp(30px, 3vw, 46px)", lineHeight: 1.08 }}
        >
          Вход
        </h1>
        <p className="mt-[10px] text-[15px] text-text-secondary">
          Профиль хранит твои расчёты и дневник
        </p>

        <form onSubmit={onSubmit} noValidate>
          <div className="mt-8">
            <input
              type="email"
              placeholder="Почта"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
            />
          </div>
          <div className="mt-3">
            <input
              type="password"
              placeholder="Пароль"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
            />
          </div>

          {error && (
            <p className="mt-2 text-[13px]" style={{ color: "var(--text-danger)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full text-[15px] text-primary-foreground transition-opacity disabled:opacity-40"
            style={{ height: "52px", borderRadius: "12px", background: "var(--accent)" }}
          >
            Войти
          </button>
        </form>

        <div className="mt-[18px] flex flex-col items-center gap-2">
          <Link to="/register" className="text-text-accent text-[15px] hover:underline">
            Создать профиль
          </Link>
          <Link
            to="/login"
            search={{ recover: true }}
            className="text-[13px] text-text-secondary hover:underline"
          >
            Забыл пароль
          </Link>
        </div>

        <Link to="/" className="mt-8 inline-block text-text-accent hover:underline">
          ← На главную
        </Link>
      </div>

      <Footer />
    </main>
  );
}
