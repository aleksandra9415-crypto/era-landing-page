import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/legal/DocPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика обработки персональных данных — Моя Эра" },
      { name: "description", content: "Политика обработки персональных данных сервиса Моя Эра." },
      { property: "og:title", content: "Политика обработки персональных данных — Моя Эра" },
      { property: "og:description", content: "Политика обработки персональных данных сервиса Моя Эра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DocPage
      title="Политика обработки персональных данных"
      body="Текст документа готовится к публикации."
      draftNotice
    />
  ),
});
