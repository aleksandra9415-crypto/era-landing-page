const LINKS = [
  { label: "Направления", href: "#directions" },
  { label: "Как это работает", href: "#how" },
  { label: "Тарифы", href: "#pricing" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12">
      <span className="font-display text-text-primary text-[20px]" style={{ letterSpacing: "0.02em", fontWeight: 500 }}>
        Моя.Эра
      </span>
      <nav className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-text-secondary hover:text-text-accent text-[15px] transition-colors"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
