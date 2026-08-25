import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/legal/DocPage";

export const Route = createFileRoute("/offer")({
  head: () => ({
    meta: [
      { title: "Публичная оферта — Моя Эра" },
      { name: "description", content: "Публичная оферта сервиса Моя Эра. Документ готовится к публикации." },
      { property: "og:title", content: "Публичная оферта — Моя Эра" },
      { property: "og:description", content: "Публичная оферта сервиса Моя Эра. Документ готовится к публикации." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DocPage
      title="Публичная оферта"
      body="Текст документа готовится к публикации. До его размещения оформление платных тарифов недоступно."
      draftNotice
    />
  ),
});
