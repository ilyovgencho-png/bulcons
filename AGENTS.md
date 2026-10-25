# Булконс landing page – бележки за агенти

Едностранична маркетингова страница на Булконс Първомай ЕООД (B2B: ишлеме и private label). Целият текст е на български.

## Архитектура

- `src/routes/__root.tsx`: shell на документа, мета тагове, JSON-LD (Organization) и инлайн скрипт, който добавя клас `js` на `<html>`, за да се скриват елементите за scroll-reveal само когато има JS.
- `src/routes/index.tsx`: рендира `MarketingPage` и добавя FAQPage JSON-LD.
- `src/routes/privacy.tsx`: страница „Политика за поверителност“ (текстът е в `privacy` в `site.ts`).
- `src/components/MarketingPage.tsx`: секциите Header (+`MobileMenu`), Hero, Why (`#about`), PrivateLabel, Products, Faq, Contact, Footer и лепкав бутон за мобилни, който се скрива при `#contact`.
- `src/components/InquiryForm.tsx`: формата за запитване (AJAX POST към `/api/inquiry`; успех само при `{ ok: true }`).
- `src/routes/api.inquiry.ts`: server route (Cloudflare Worker). Проверява `Origin`, валидира и изпраща имейл; ботове (honeypot) получават 200 без имейл.
- `src/server/inquiry.ts`: чиста логика (парсване, валидация, `buildEmail`, `sendInquiry` към Resend). Тества се без Cloudflare.
- `wrangler.jsonc`: конфигурация на Worker-а; `INQUIRY_TO` и `INQUIRY_FROM` са vars, `RESEND_API_KEY` е secret (`.dev.vars` локално).
- `src/data/site.ts`: **всички текстове**. Редактирай съдържанието тук, не в JSX.
- `src/styles.css`: Tailwind v4 `@theme` токени (paper, ink, signal, pine, graphite), `.btn*`, `.blueprint`, анимации (`rise`, `.reveal`). Всичко уважава `prefers-reduced-motion`.

## Конвенции

- Ползвай токените от темата (`bg-paper`, `text-ink`, `text-signal`), не суров hex. Един акцент: signal orange.
- Почти квадратни ъгли (2px), плътни отместени сенки (`shadow-[6px_6px_0_var(--color-ink)]`), моно `.eyebrow` етикети.
- Шрифтовете трябва да имат кирилица (Fraunces и Instrument Sans нямат). Self-hosted през `@fontsource-variable`, не от Google Fonts.
- Не измисляй фактически данни (сертификати, минимални количества, срокове). Питай собственика.
- Env променливите се четат с `import { env } from 'cloudflare:workers'` само в route файлове (типовете са в `src/cloudflare-env.d.ts`).
- Нови полета във формата се добавят на три места: `InquiryForm.tsx`, `LIMITS`/`buildEmail` в `src/server/inquiry.ts` и тестовете.
