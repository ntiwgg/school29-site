# Архитектура Сайт школы № 29

> Как устроен проект. Правило для всех ИИ и участников: **соблюдай Architecture.md**. Зависимости направлены вниз: слой может использовать только слои ниже себя.

> **Статус:** актуально на 31.08.2026 — этап 4 завершён (Astro-проект создан); этап 5 завершён полностью: 5a (компоненты), 5b-1 (Decap CMS + коллекция news), 5b-2 (все контент-коллекции: announcements, sveden×14, teachers×13, documents, contacts; исправлен критический баг путей Decap — префикс site/ в config.yml), 5c (CI/деплой: GitHub Actions + Pages, сайт опубликован на https://ntiwgg.github.io/school29-site/, base '/school29-site/', хелпер paths.ts). Впереди этап 6 (перенос контента с Nubex).

## Части проекта

- **Astro (SSG):** генерация статических страниц сайта, компонентный подход. Проект — в подпапке `site/` (Astro v7.2.9, шаблон minimal).
- **Decap CMS:** git-based веб-редактор контента для секретаря/учителя. Подключён через CDN decap-cms@^3.16.0 (public/admin/index.html + public/admin/config.yml); backend — GitHub (дефолтный GitHub OAuth), правки публикуются в ветку dev.
- **Контент:** Markdown-файлы в репозитории. Коллекции: news (9 записей в src/content/news/), announcements (4 записи в src/content/announcements/), sveden (14 подразделов в src/content/sveden/), teachers (13 педагогов в src/content/teachers/), documents (4 документа в src/content/documents/), contacts (единый файл src/content/contacts.md, single-file, getEntry); схема — src/content.config.ts (Astro content collections). Все коллекции подключены к Decap.
- **Дизайн-система:** из OpenDesign (токены, стили, компоненты дизайна).

## Слои / ответственность

### Astro-сайт

Структура проекта (site/):

- `src/pages/*.astro` — статичные страницы сайта: index, o-shkole, sveden, sveden-teachers, bezopasnost, contacts (contacts.astro читает единый файл коллекции через getEntry).
- `src/pages/sveden.astro` — страница «Сведения об образовательной организации» (`/sveden/`): карточки 14 подразделов из коллекции sveden (SvedenCard.astro, сортировка по num); «Педагогический состав» ведёт на отдельную страницу /sveden-teachers/.
- `src/pages/sveden/[slug].astro` — страница подраздела (`/sveden/<slug>/`) с хлебными крошками и сайдбаром из 14 подразделов; страница /sveden/pedagogicheskiy-sostav/ не генерируется (подраздел живёт на /sveden-teachers/, 404); подраздел «Документы» (/sveden/dokumenty/) вместо markdown-тела рендерит список документов из коллекции documents (стили .docs-list).
- `src/pages/sveden-teachers.astro` — страница «Педагогический состав» (`/sveden-teachers/`): таблица рендерится из коллекции teachers (сортировка по order, порядок исходной разметки).
- `src/pages/news/index.astro` — лента новостей (`/news/`), собирается из коллекции news.
- `src/pages/news/[slug].astro` — страница новости (`/news/[slug]/`) с хлебными крошками.
- `src/content.config.ts` — схема контент-коллекций (news, announcements, sveden, teachers, documents, contacts).
- `src/content/news/*.md` — записи новостей (9 записей; рубрики, даты).
- `src/content/announcements/*.md` — записи объявлений (4 записи; поле important — маркер важности, иконки alert/calendar/book/utensils).
- `src/content/sveden/*.md` — записи подразделов «Сведений об ОО» (14 записей по приказу № 1493; num — порядок 1–14, title/description — как в карточке на /sveden/, тело — markdown-плейсхолдер «Раздел готовится к наполнению»).
- `src/content/teachers/*.md` — записи педагогов (13 записей 1:1 из разметки; поля по ПП РФ № 1802: name, position, subjects, category, education, degree, profdev, retraining, experience, programs; order — порядок строк в таблице).
- `src/content/documents/*.md` — записи документов (4 примера: устав, отчёт о самообследовании, правила внутреннего распорядка, положение о платных услугах; поля title, doc-type enum, date, file, description).
- `src/content/contacts.md` — единый файл коллекции «Контакты» (single-file, getEntry; поля address/phones/email/workhours/requisites — плейсхолдеры из дизайна, заменить реальными на этапе 6).
- `src/lib/paths.ts` — хелпер `url(path)` для внутренних ссылок с учётом base: Astro не переписывает корневые ссылки в разметке, поэтому пути к страницам и public-ассетам префиксуются через `import.meta.env.BASE_URL`; внешние ссылки (https://…) и якоря (#…) возвращаются без изменений. `src/components/NewsIcon.astro` — справочник 9 иконок рубрик; `src/lib/news.ts` — рубрики и даты новостей; `src/components/AnnouncementIcon.astro` — справочник иконок объявлений (alert, calendar, book, utensils); `src/components/SvedenCard.astro` — карточка подраздела «Сведений об ОО» (num, title, description, ссылка).
- `src/pages/index.astro` — главная страница берёт 4 последние новости из коллекции и рендерит блок объявлений из коллекции announcements.
- `public/assets/` — статические ассеты: `css/styles.css`, `js/main.js`, `img/emblem.svg`.
- `public/admin/` — точка входа Decap CMS: `index.html`, `config.yml`.
- `astro.config.mjs` — `compressHTML: false`: разметка сохраняется 1:1 с HTML-дизайном (в т.ч. пробелы между inline-элементами), чтобы не менять визуал; `base: '/school29-site/'`: сайт публикуется на GitHub Pages по адресу https://ntiwgg.github.io/school29-site/, base нужен, чтобы внутренние ссылки и собранные ассеты указывали на /school29-site/. Редиректы /admin → /admin/index.html удалены: на статическом хостинге GitHub Pages они не работают, а /school29-site/admin/ и так отдаёт public/admin/index.html (статические хостинги для директории автоматически отдают index.html); в dev-режиме /admin/ даёт 404 — админка открывается как /admin/index.html (известный нюанс dev).

Слои (целевая структура): `дизайн-система → компоненты → страницы → контент`

- **Дизайн-система** — визуальные токены и стили из OpenDesign (сейчас — `public/assets/css/styles.css`). НЕ делает: не содержит контента.
- **Компоненты** — переиспользуемые элементы интерфейса (шапка, меню, карточки, формы). Выделены первые компоненты (например, NewsIcon.astro); рефакторинг страниц в компоненты завершён в рамках 5a. НЕ делает: не содержит делового контента.
- **Страницы** — собирают страницу из компонентов и контента. НЕ делает: не хранит контент.
- **Контент (Markdown)** — фактические тексты и документы сайта: коллекции news (src/content/news/, 9 записей), announcements (src/content/announcements/, 4 записи; поле important, иконки через AnnouncementIcon), sveden (src/content/sveden/, 14 подразделов по приказу № 1493; поле num задаёт порядок, title/description совпадают 1:1 с карточками на /sveden/, тело — markdown-плейсхолдер), teachers (src/content/teachers/, 13 записей; поля по ПП РФ № 1802, order — порядок строк таблицы), documents (src/content/documents/, 4 записи; поля title/doc-type/date/file/description) и contacts (src/content/contacts.md, единый файл; плейсхолдеры дизайна, заменить реальными на этапе 6); схема — src/content.config.ts. Все коллекции подключены к Decap. Рубрики новостей (6: События, Достижения, Объявления, Приём, Спорт, Безопасность) и иконки (9) перенесены 1:1 с дизайна. НЕ делает: не содержит вёрстки.

### Decap CMS

- **Редактор** — веб-интерфейс для наполнения (public/admin/index.html, CDN decap-cms@^3.16.0). НЕ делает: не хранит данные сам — пишет в git.
- **Backend** — GitHub: вход через дефолтный GitHub OAuth, правки публикуются в ветку dev репозитория ntiwgg/school29-site.
- **Конфигурация** — public/admin/config.yml: коллекции (news, announcements, sveden, teachers, documents и contacts — file-коллекция) и их поля; все коллекции сайта подключены к Decap, новые добавляются здесь же. Важно: пути в config.yml резолвятся от корня git-репозитория (сайт живёт в подпапке site/), поэтому folder/media_folder обязаны иметь префикс site/ — комментарий-инвариант записан в config.yml; без него контент из админки создавался в корне репо и не попадал на сайт (исправлено 31.08.2026, коммит ebf6d25).

### CI/деплой (GitHub Actions + GitHub Pages)

- **Workflow** — `.github/workflows/deploy.yml` (в корне репозитория): `actions/checkout@v7` → `actions/setup-node@v7` (node 22, cache npm, cache-dependency-path site/package-lock.json) → `npm ci` и `npm run build` в `site/` (артефакт — `site/dist`) → `actions/configure-pages@v6` → `actions/upload-pages-artifact@v5` (path: site/dist) → `actions/deploy-pages@v5`. Триггеры: push в ветку dev + workflow_dispatch. Permissions: contents: read, pages: write, id-token: write; concurrency: group pages.
- **Публикация** — GitHub Pages репозитория ntiwgg/school29-site (build_type=workflow), сайт живёт на https://ntiwgg.github.io/school29-site/; репозиторий public (одобрено владельцем). Все ключевые страницы отвечают 200 (главная, /news/, /sveden/, /admin/, /assets/css/styles.css).
- **Base-путь** — `base: '/school29-site/'` в astro.config.mjs: сайт раздаётся из подпути /school29-site/. Astro не переписывает корневые ссылки в разметке, поэтому все внутренние пути (страницы и public-ассеты) обёрнуты в хелпер `url()` из `src/lib/paths.ts` (префикс `import.meta.env.BASE_URL` для путей, начинающихся с `/`; внешние ссылки и якоря не трогаются) — применено в 12 .astro-файлах.
- **Редиректы** — Astro-редиректы (redirects) на статическом GitHub Pages не работают (нужен сервер), поэтому удалены; /school29-site/admin/ отдаёт public/admin/index.html автоматически (статические хостинги отдают index.html для директории).

## Потоки работы

```
Наполнение: секретарь/учитель → Decap CMS (веб-интерфейс) → Markdown → git (ветка dev) → GitHub Actions (сборка) → GitHub Pages (https://ntiwgg.github.io/school29-site/)
```

## Правило зависимостей

- Слой может использовать только слои ниже себя; обратное использование запрещено.
- Контент не содержит вёрстки; страницы не содержат контента.
- Дизайн не правится руками в коде — изменения вносятся через OpenDesign.
