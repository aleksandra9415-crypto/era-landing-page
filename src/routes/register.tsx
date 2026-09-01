import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Создать профиль — Моя Эра" },
      {
        name: "description",
        content:
          "Регистрация в Моя Эра: профиль хранит расчёты по шести системам, дневник и профили близких.",
      },
      { property: "og:title", content: "Создать профиль — Моя Эра" },
      {
        property: "og:description",
        content: "Профиль хранит твои расчёты, дневник и профили близких.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const fieldCls =
  "w-full bg-surface-1 border text-text-primary placeholder:text-text-secondary px-4 outline-none focus-visible:border-text-accent";
const fieldStyle = { height: "52px", borderRadius: "12px", borderColor: "var(--border)" } as const;

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    let invalid = false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Проверь адрес почты");
      invalid = true;
    }
    if (password.length < 8) {
      setPasswordError("Пароль должен быть не короче 8 символов");
      invalid = true;
    }
    if (invalid) return;

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);

    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        setEmailError("Такая почта уже зарегистрирована");
      } else if (msg.includes("email") && msg.includes("invalid")) {
        setEmailError("Проверь адрес почты");
      } else if (msg.includes("password")) {
        setPasswordError("Пароль должен быть не короче 8 символов");
      } else {
        setFormError("Что-то пошло не так. Попробуй ещё раз");
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
          Создать профиль
        </h1>
        <p className="mt-[10px] text-[15px] text-text-secondary">
          Профиль хранит твои расчёты, дневник и профили близких
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
            {emailError && (
              <p className="mt-2 text-[13px]" style={{ color: "var(--text-danger)" }}>
                {emailError}
              </p>
            )}
          </div>

          <div className="mt-3">
            <input
              type="password"
              placeholder="Пароль"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
            />
            {passwordError && (
              <p className="mt-2 text-[13px]" style={{ color: "var(--text-danger)" }}>
                {passwordError}
              </p>
            )}
          </div>

          <label className="mt-4 flex items-start gap-3 text-[13px] text-text-secondary">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-[2px] h-4 w-4 shrink-0"
              style={{ accentColor: "var(--accent)" }}
            />
            <span>
              Согласен на{" "}
              <Link to="/consent" className="text-text-accent hover:underline">
                обработку персональных данных
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed || busy}
            className="mt-5 w-full text-[15px] text-primary-foreground transition-opacity disabled:opacity-40"
            style={{ height: "52px", borderRadius: "12px", background: "var(--accent)" }}
          >
            Создать профиль
          </button>

          {formError && (
            <p className="mt-3 text-[13px]" style={{ color: "var(--text-danger)" }}>
              {formError}
            </p>
          )}
        </form>

        <div className="mt-[18px] text-center">
          <Link to="/login" className="text-text-accent text-[15px] hover:underline">
            Уже есть профиль? Войти
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
