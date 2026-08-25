import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/legal/DocPage";

export const Route = createFileRoute("/subscription-terms")({
  head: () => ({
    meta: [
      { title: "Условия подписки и возврата — Моя Эра" },
      { name: "description", content: "Условия подписки и возврата средств в сервисе Моя Эра." },
      { property: "og:title", content: "Условия подписки и возврата — Моя Эра" },
      { property: "og:description", content: "Условия подписки и возврата средств в сервисе Моя Эра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DocPage
      title="Условия подписки и возврата"
      body="Текст документа готовится к публикации."
      draftNotice
    />
  ),
});
