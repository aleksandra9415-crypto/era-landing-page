import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/hero/Header";
import { Footer } from "@/components/landing/Footer";

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

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mt-8">
            <input type="email" placeholder="Почта" className={fieldCls} style={fieldStyle} />
          </div>
          <div className="mt-3">
            <input type="password" placeholder="Пароль" className={fieldCls} style={fieldStyle} />
          </div>
          <button
            type="submit"
            className="mt-5 w-full text-[15px] text-primary-foreground"
            style={{ height: "52px", borderRadius: "12px", background: "var(--accent)" }}
          >
            Войти
          </button>
        </form>

        <div className="mt-[18px] text-center">
          <button type="button" className="text-text-accent text-[15px] hover:underline">
            Создать профиль
          </button>
        </div>

        <p className="mt-10 text-[13px] text-text-secondary opacity-60">
          Страница-заготовка. Авторизация пока не подключена.
        </p>

        <Link to="/" className="mt-8 inline-block text-text-accent hover:underline">
          ← На главную
        </Link>
      </div>

      <Footer />
    </main>
  );
}
