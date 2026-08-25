import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/legal/DocPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О сервисе — Моя Эра" },
      { name: "description", content: "О сервисе Моя Эра: шесть систем расчёта складываются в один профиль." },
      { property: "og:title", content: "О сервисе — Моя Эра" },
      { property: "og:description", content: "О сервисе Моя Эра: шесть систем расчёта складываются в один профиль." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <DocPage title="О сервисе" body="Текст страницы готовится." />,
});
