import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo.svg.asset.json";

const LINKS = [
  { label: "Направления", href: "/#directions" },
  { label: "Как это работает", href: "/#how" },
  { label: "Тарифы", href: "/#pricing" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, email, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b transition-all duration-300"
        style={{
          height: "clamp(76px, 6.5vh, 104px)",
          paddingLeft: "clamp(20px, 4vw, 64px)",
          paddingRight: "clamp(20px, 4vw, 64px)",
          background: scrolled ? "rgba(3, 25, 30, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
          borderColor: scrolled
            ? "color-mix(in srgb, var(--border) 40%, transparent)"
            : "transparent",
        }}
      >
        <Link to="/" className="flex items-center">
          <img
            src={logoAsset.url}
            alt="Моя Эра"
            className="w-auto"
            style={{ height: "clamp(44px, 3.6vw, 72px)" }}
          />
        </Link>

        <nav className="hidden items-center md:flex">
          <div className="flex items-center gap-8">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-text-secondary hover:text-text-accent text-[15px] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="ml-[28px]">
            {loading ? null : isAuthenticated ? <AccountBlock email={email} /> : <LoginButton />}
          </div>
        </nav>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          {open ? (
            <>
              <span className="block h-[2px] w-6 translate-y-[4px] rotate-45 bg-text-primary" />
              <span className="block h-[2px] w-6 -translate-y-[4px] -rotate-45 bg-text-primary" />
            </>
          ) : (
            <>
              <span className="block h-[2px] w-6 bg-text-primary" />
              <span className="block h-[2px] w-6 bg-text-primary" />
              <span className="block h-[2px] w-6 bg-text-primary" />
            </>
          )}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6 md:hidden"
          style={{ background: "rgba(3, 25, 30, 0.97)" }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-text-primary text-[20px]"
            >
              {l.label}
            </a>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/cabinet"
                onClick={() => setOpen(false)}
                className="text-text-accent text-[20px]"
              >
                Мой кабинет
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="text-text-secondary text-[20px]"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-text-accent text-[20px]">
              Войти
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function LoginButton() {
  return (
    <Link
      to="/login"
      className="flex items-center justify-center text-text-accent transition-colors"
      style={{
        height: "42px",
        paddingInline: "22px",
        borderRadius: "10px",
        border: "1px solid color-mix(in srgb, var(--text-accent) 50%, transparent)",
        fontSize: "clamp(14px, 1vw, 16px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--text-accent)";
        e.currentTarget.style.background = "rgba(122, 93, 168, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          "color-mix(in srgb, var(--text-accent) 50%, transparent)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      Войти
    </Link>
  );
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.assign("/");
}

function AccountBlock({ email }: { email: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const initial = (email ?? "?").charAt(0).toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = () => setMenuOpen(false);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-3"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text-primary text-[15px]">
          {initial}
        </span>
        <span className="text-text-secondary text-[15px]">Мой кабинет</span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] min-w-[180px] overflow-hidden border bg-surface-1"
          style={{ borderRadius: "12px", borderColor: "var(--border)" }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              navigate({ to: "/cabinet" });
            }}
            className="block w-full px-4 py-3 text-left text-[15px] text-text-primary hover:text-text-accent"
          >
            Мой кабинет
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              void signOut();
            }}
            className="block w-full px-4 py-3 text-left text-[15px] text-text-secondary hover:text-text-accent"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
