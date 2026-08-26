import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/landing/SoonPage";

const TITLE = "Нумерология — Моя Эра";
const DESCRIPTION = "Нумерология: расчёт по дате рождения в сервисе Моя Эра. Страница готовится.";

export const Route = createFileRoute("/numerologiya")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <SoonPage title="Нумерология" />,
});
