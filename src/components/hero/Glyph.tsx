import type { Direction } from "@/lib/directions";

export function Glyph({ name, size = 28 }: { name: Direction["glyph"]; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "matrix":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="20" height="20" transform="rotate(45 16 16)" />
          <path d="M16 4v24M4 16h24" />
        </svg>
      );
    case "natal":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="4" />
          <path d="M16 5v6M16 21v6M5 16h6M21 16h6" />
        </svg>
      );
    case "human":
      return (
        <svg {...common}>
          <circle cx="16" cy="6" r="3" />
          <circle cx="16" cy="16" r="3" />
          <circle cx="16" cy="26" r="3" />
          <path d="M16 9v4M16 19v4M9 16h4M19 16h4" />
        </svg>
      );
    case "numbers":
      return (
        <svg {...common}>
          <path d="M8 8h6v16M20 8h4v16M20 16h4" />
          <path d="M8 24h8" />
        </svg>
      );
    case "tarot":
      return (
        <svg {...common}>
          <rect x="8" y="4" width="16" height="24" rx="2" />
          <path d="M16 9l3 5-3 5-3-5 3-5Z" />
        </svg>
      );
    case "sync":
      return (
        <svg {...common}>
          <circle cx="12" cy="16" r="8" />
          <circle cx="20" cy="16" r="8" />
        </svg>
      );
  }
}
