import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/legal/DocPage";

export const Route = createFileRoute("/consent")({
  head: () => ({
    meta: [
      { title: "Согласие на обработку персональных данных — Моя Эра" },
      { name: "description", content: "Согласие на обработку персональных данных в сервисе Моя Эра." },
      { property: "og:title", content: "Согласие на обработку персональных данных — Моя Эра" },
      { property: "og:description", content: "Согласие на обработку персональных данных в сервисе Моя Эра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DocPage
      title="Согласие на обработку персональных данных"
      body="Текст документа готовится к публикации."
      draftNotice
    />
  ),
});
