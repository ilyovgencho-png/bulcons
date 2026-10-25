# Булконс Първомай – landing page за производство под ваша марка

Едностранична маркетингова страница на **Булконс Първомай ЕООД**: ишлеме и private label производство на лютеница, доматени сосове, пюре и кетчуп. Целта е запитване за оферта през формата.

Секции: обява и навигация, hero със статистики, „Защо Булконс“ (`#about`), производство под ваша марка (`#private`), продукти (`#products`), често задавани въпроси (`#faq`), контакти и форма (`#contact`). Отделна страница `/privacy` съдържа политиката за поверителност.

Дизайнът е умишлено „чертожен“: топла хартиена основа, тъмносини „blueprint“ секции и един оранжев акцент. Шрифтове: Literata (заглавия), Golos Text (текст), JetBrains Mono (етикети). И трите имат кирилица и са self-hosted през `@fontsource-variable`, без заявки към Google.

## Технологии

- [TanStack Start](https://tanstack.com/start) + React 19, Tailwind CSS v4
- Cloudflare Workers (хостинг + `/api/inquiry`), имейл през [Resend](https://resend.com)

## Стартиране

```bash
pnpm install
cp .dev.vars.example .dev.vars   # сложете тестов RESEND_API_KEY
pnpm dev                         # http://localhost:3000
pnpm test
pnpm typecheck
pnpm build && pnpm preview       # проверка в Workers runtime
```

## Деплой в Cloudflare + Resend

**1. Resend (имейлите от формата)**
1. Регистрирайте се в [resend.com](https://resend.com) → **Domains → Add Domain** → `bulcons.com`.
2. Добавете DNS записите, които Resend показва (SPF, DKIM), в DNS зоната на домейна. Изчакайте статус *Verified*.
3. **API Keys → Create API Key** (право *Sending access*). Копирайте ключа, показва се само веднъж.

**2. Cloudflare**
1. Ако нямате акаунт, създайте безплатен на [dash.cloudflare.com](https://dash.cloudflare.com).
2. Влезте от терминала и качете сайта:
   ```bash
   pnpm wrangler login
   pnpm wrangler secret put RESEND_API_KEY   # поставете ключа от Resend
   pnpm deploy
   ```
   Първият деплой създава Worker `bulcons-landing` с адрес `bulcons-landing.<акаунт>.workers.dev`.
3. **Свой домейн:** Workers & Pages → `bulcons-landing` → *Settings → Domains & Routes → Add → Custom domain*. Домейнът трябва да е добавен в Cloudflare (DNS зона).
4. По избор: Git деплой. Workers & Pages → *Create → Import a repository*; build команда `pnpm build`, deploy команда `pnpm wrangler deploy`; ключът се добавя в *Settings → Variables and Secrets*.

**3. Настройки**
- Получател и подател се менят в `wrangler.jsonc` (`INQUIRY_TO` може да е няколко адреса, разделени със запетая; `INQUIRY_FROM` трябва да е от потвърдения в Resend домейн).
- След деплой направете тестово запитване и проверете, че имейлът пристига на `INQUIRY_TO`. Отговор (Reply) отива директно при подателя на запитването.
- Препоръчително: в Cloudflare → *Security → WAF → Rate limiting rules* добавете правило за `POST /api/inquiry` (напр. 5 заявки на минута от един IP).

## Редакция на съдържание

Целият текст е в `src/data/site.ts`: обява, навигация, hero, секции, FAQ (`faq`), контакти, форма (`inquiryForm`), футър и политика за поверителност (`privacy`). Структурираните данни за търсачки (Organization, FAQPage) се четат от същите данни.

## Форма за запитване

- Компонент: `src/components/InquiryForm.tsx`; изпраща URL-encoded POST към `/api/inquiry`.
- Сървър: `src/routes/api.inquiry.ts` (маршрут) и `src/server/inquiry.ts` (валидация, имейл през Resend, с тестове).
- Защита: скрито поле `bot-field` (honeypot), проверка на `Origin`, ограничения на дължината, HTML escaping в имейла.
- Задължително е съгласието (`suglasie`) с линк към `/privacy`.

## Преди пускане

- Текстът в `privacy` (споменава Cloudflare и Resend като обработващи данни) е общ образец, съобразен с GDPR. Прегледайте го с юрист и уточнете срока на съхранение.
- Логото и снимките на продуктите се зареждат от bulcons.com. По-устойчиво е да се свалят в `public/` и да се сервират оттук.
- Добавете `og:image` с подходяща снимка и `canonical` с крайния домейн.
- Статистиките „през 2024 г.“ в `hero.stats` са от стара година, обновете ги.
