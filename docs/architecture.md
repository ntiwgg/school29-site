# Архитектура Сайт школы № 29

> Как устроен проект. Правило для всех ИИ и участников: **соблюдай Architecture.md**. Зависимости направлены вниз: слой может использовать только слои ниже себя.

> **Статус:** актуально на 01.09.2026 — **все этапы 1–8 завершены**: этап 4 (Astro-проект создан); этап 5 завершён полностью: 5a (компоненты), 5b-1 (Decap CMS + коллекция news), 5b-2 (все контент-коллекции: announcements, sveden×14, teachers, documents, contacts; исправлен критический баг путей Decap — префикс site/ в config.yml), 5c (CI/деплой: GitHub Actions + Pages, сайт опубликован на https://ntiwgg.github.io/school29-site/, base '/school29-site/', хелпер paths.ts); этап 6 завершён: 6a (контакты/основные сведения/руководство — 2e25dc0), 6b (педсостав 75 педагогов — a11cba9), 6c (реальные тексты 14 подразделов «Сведений» — 6601861, c6cbf62; подраздел «Документы»: markdown-тело + блок «Прикреплённые файлы», коллекция documents в коде — attachedDocs), 6d пропущен по решению владельца (файлы документов Nubex — при реальном запуске); этап 7 завершён: аудит (docs/research/audit-2026-08-31.md) + исправления 7a (коммит 3038dbc: тестовые новости удалены, шрифты 24 → 10 woff2, a11y) и 7b (коммит 55210c7: canonical/OG, title ≤ 70, focus-trap); финальный Lighthouse на живом сайте: Perf 99–100, A11y 100, BP 100, SEO 100; этап 8 завершён: аудит ссылок (docs/research/broken-links-2026-09-01.md — 78 битых URL, 61 заглушка href="#" / 1166 вхождений) → 8a (коммит d6bf314: страницы разделов /parents/, /students/, /teachers/, /gia/, /nastavnichestvo/), 8b (коммит a20e01d: служебные страницы /privacy/, /sitemap/, /links/, реальные URL футера и виджетов), 8c (коммит 9be30c4: NewsFilters.astro + статические страницы /news/tag/[tag]/; href="#" — 0). Итог: 52 страницы, битых ссылок и ссылок-заглушек нет.

## Части проекта

- **Astro (SSG):** генерация статических страниц сайта, компонентный подход. Проект — в подпапке `site/` (Astro v7.2.9, шаблон minimal).
- **Decap CMS:** git-based веб-редактор контента для секретаря/учителя. Подключён через CDN decap-cms@^3.16.0 (public/admin/index.html + public/admin/config.yml); backend — GitHub (дефолтный GitHub OAuth), правки публикуются в ветку dev.
- **Контент:** Markdown-файлы в репозитории. Коллекции: news (9 записей в src/content/news/), announcements (4 записи в src/content/announcements/), sveden (14 подразделов в src/content/sveden/, реальные тексты с Nubex), teachers (75 педагогов в src/content/teachers/), documents (4 записи в src/content/documents/; в подразделе «Документы» используется как блок «Прикреплённые файлы» — в коде attachedDocs), contacts (единый файл src/content/contacts.md, single-file, getEntry, реальные данные с Nubex); схема — src/content.config.ts (Astro content collections). Все коллекции подключены к Decap.
- **Дизайн-система:** из OpenDesign (токены, стили, компоненты дизайна).

## Слои / ответственность

### Astro-сайт

Структура проекта (site/):

- `src/pages/*.astro` — статичные страницы сайта: index, o-shkole, sveden, sveden-teachers, bezopasnost, contacts (contacts.astro читает единый файл коллекции через getEntry).
- `src/pages/sveden.astro` — страница «Сведения об образовательной организации» (`/sveden/`): карточки 14 подразделов из коллекции sveden (SvedenCard.astro, сортировка по num); «Педагогический состав» ведёт на отдельную страницу /sveden-teachers/.
- `src/pages/sveden/[slug].astro` — страница подраздела (`/sveden/<slug>/`) с хлебными крошками и сайдбаром из 14 подразделов; страница /sveden/pedagogicheskiy-sostav/ не генерируется (подраздел живёт на /sveden-teachers/, 404). Подраздел «Документы» (/sveden/dokumenty/): основной контент — markdown-тело dokumenty.md с реальным перечнем из 106 документов (источник Nubex); под перечнем — блок «Прикреплённые файлы» из коллекции documents (в коде — переменная attachedDocs, getCollection('documents') с фильтром по полю file, сортировка по title), блок рендерится только если есть записи с загруженными файлами.
- `src/pages/sveden-teachers.astro` — страница «Педагогический состав» (`/sveden-teachers/`): таблица рендерится из коллекции teachers (сортировка по order, порядок исходной разметки).
- `src/pages/news/index.astro` — лента новостей (`/news/`), собирается из коллекции news.
- `src/pages/news/[slug].astro` — страница новости (`/news/[slug]/`) с хлебными крошками.
- `src/pages/news/tag/[tag].astro` — статические страницы фильтров новостей по рубрикам (`/news/tag/<slug>/`): 6 рубрик, слаги — транслит названий рубрик; список рубрик и ссылки фильтров собираются компонентом NewsFilters.astro (этап 8c, коммит 9be30c4). Пагинация-заглушка удалена.
- `src/pages/parents/` — раздел «Родителям» (`/parents/` + подстраницы: приём в 1 класс, приём в 10 класс, FAQ, Малышок); контент с Nubex (этап 8a, коммит d6bf314).
- `src/pages/students/` — раздел «Ученикам» (`/students/` + подстраницы: одарённые дети, спортклуб, СПТ, отдых детей); контент с Nubex (этап 8a, коммит d6bf314).
- `src/pages/teachers/` — раздел «Педагогам» (`/teachers/` + подстраница «Нагрузка»); контент с Nubex (этап 8a, коммит d6bf314).
- `src/pages/gia.astro` — страница «ГИА» (`/gia/`): общая для двух меню (этап 8a, коммит d6bf314).
- `src/pages/nastavnichestvo.astro` — страница «Наставничество» (`/nastavnichestvo/`): общая для двух меню (этап 8a, коммит d6bf314).
- `src/pages/privacy.astro` — «Политика обработки персональных данных» (`/privacy/`): заготовка по 152-ФЗ, требует утверждения владельцем (этап 8b, коммит a20e01d).
- `src/pages/sitemap.astro` — карта сайта (`/sitemap/`) (этап 8b, коммит a20e01d).
- `src/pages/links.astro` — «Ссылки» (`/links/`): 10 проверенных государственных ресурсов (этап 8b, коммит a20e01d).
- `src/content.config.ts` — схема контент-коллекций (news, announcements, sveden, teachers, documents, contacts).
- `src/content/news/*.md` — записи новостей (9 записей; рубрики, даты).
- `src/content/announcements/*.md` — записи объявлений (4 записи; поле important — маркер важности, иконки alert/calendar/book/utensils).
- `src/content/sveden/*.md` — записи подразделов «Сведений об ОО» (14 записей по приказу № 1493; num — порядок 1–14, title/description — как в карточке на /sveden/, тело — реальные тексты с Nubex, перенесены на этапе 6c; коммиты 6601861, c6cbf62).
- `src/content/teachers/*.md` — записи педагогов (75 записей с Nubex, перенесены на этапе 6b, коммит a11cba9; поля по ПП РФ № 1802: name, position, subjects, category, education, degree, profdev, retraining, experience, programs; order — порядок строк в таблице; статистика на /sveden-teachers/ посчитана из коллекции: 75 работников, 11 — высшая категория, 8 — первая, 56 — без категории).
- `src/content/documents/*.md` — записи документов (4 примера: устав, отчёт о самообследовании, правила внутреннего распорядка, положение о платных услугах; поля title, doc-type enum, date, file, description). Используются как блок «Прикреплённые файлы» на /sveden/dokumenty/ (в коде [slug].astro — attachedDocs): показываются только записи с заполненным полем file.
- `src/content/contacts.md` — единый файл коллекции «Контакты» (single-file, getEntry; поля address/phones/email/workhours/requisites). Реальные данные с Nubex (этап 6a, коммит 2e25dc0): адрес наб. Варкауса, 5, +7 (8142) 33-20-29, sch29-ptz@yandex.ru, режим работы; ИНН/КПП/ОГРН — «уточнить» (на Nubex не опубликованы).
- `src/lib/paths.ts` — хелпер `url(path)` для внутренних ссылок с учётом base: Astro не переписывает корневые ссылки в разметке, поэтому пути к страницам и public-ассетам префиксуются через `import.meta.env.BASE_URL`; внешние ссылки (https://…) и якоря (#…) возвращаются без изменений. `src/components/NewsIcon.astro` — справочник 9 иконок рубрик; `src/lib/news.ts` — рубрики и даты новостей; `src/components/AnnouncementIcon.astro` — справочник иконок объявлений (alert, calendar, book, utensils); `src/components/SvedenCard.astro` — карточка подраздела «Сведений об ОО» (num, title, description, ссылка); `src/components/NewsFilters.astro` — фильтры новостей по рубрикам: список 6 рубрик со ссылками на статические страницы /news/tag/<slug>/ (слаги — транслит рубрик; этап 8c, коммит 9be30c4).
- `src/pages/index.astro` — главная страница берёт 4 последние новости из коллекции и рендерит блок объявлений из коллекции announcements.
- `src/layouts/Layout.astro` — общий каркас страниц (шапка, футер, meta-теги). С этапа 7b (коммит 55210c7): canonical-ссылка (`new URL(Astro.url.pathname, Astro.site)`) и Open Graph-мета (og:type, og:title, og:description, og:url, og:image, og:site_name, og:locale ru_RU), meta description; заголовки статей ≤ 70 символов.
- `public/assets/` — статические ассеты: `css/styles.css`, `js/main.js`, `img/emblem.svg`. В `js/main.js`: бургер-меню (aria-expanded/aria-controls, закрытие по Escape), версия для слабовидящих и (с этапа 7b) focus-trap мобильного меню — при открытой шторке Tab циклирует фокус по focusable-элементам меню (первый/последний, с учётом Shift), фокус не уходит за пределы шторки.
- `public/admin/` — точка входа Decap CMS: `index.html`, `config.yml`.
- `astro.config.mjs` — `site: 'https://ntiwgg.github.io'`: базовый URL для canonical и OG-тегов (полный URL страницы; добавлен на этапе 7b, коммит 55210c7); `compressHTML: false`: разметка сохраняется 1:1 с HTML-дизайном (в т.ч. пробелы между inline-элементами), чтобы не менять визуал; `base: '/school29-site/'`: сайт публикуется на GitHub Pages по адресу https://ntiwgg.github.io/school29-site/, base нужен, чтобы внутренние ссылки и собранные ассеты указывали на /school29-site/. Редиректы /admin → /admin/index.html удалены: на статическом хостинге GitHub Pages они не работают, а /school29-site/admin/ и так отдаёт public/admin/index.html (статические хостинги для директории автоматически отдают index.html); в dev-режиме /admin/ даёт 404 — админка открывается как /admin/index.html (известный нюанс dev).

Слои (целевая структура): `дизайн-система → компоненты → страницы → контент`

- **Дизайн-система** — визуальные токены и стили из OpenDesign (сейчас — `public/assets/css/styles.css`). НЕ делает: не содержит контента.
- **Компоненты** — переиспользуемые элементы интерфейса (шапка, меню, карточки, формы). Выделены первые компоненты (например, NewsIcon.astro); рефакторинг страниц в компоненты завершён в рамках 5a. НЕ делает: не содержит делового контента.
- **Страницы** — собирают страницу из компонентов и контента. НЕ делает: не хранит контент.
- **Контент (Markdown)** — фактические тексты и документы сайта: коллекции news (src/content/news/, 9 записей), announcements (src/content/announcements/, 4 записи; поле important, иконки через AnnouncementIcon), sveden (src/content/sveden/, 14 подразделов по приказу № 1493; поле num задаёт порядок, title/description совпадают 1:1 с карточками на /sveden/, тело — реальные тексты с Nubex, перенесены на этапе 6c), teachers (src/content/teachers/, 75 записей с Nubex, этап 6b; поля по ПП РФ № 1802, order — порядок строк таблицы; статистика категорий на /sveden-teachers/ считается из коллекции), documents (src/content/documents/, 4 записи; поля title/doc-type/date/file/description; в /sveden/dokumenty/ используется как блок «Прикреплённые файлы» — attachedDocs, показывается только при наличии записей с file) и contacts (src/content/contacts.md, единый файл; реальные данные с Nubex, этап 6a; ИНН/КПП/ОГРН — «уточнить»); схема — src/content.config.ts. Все коллекции подключены к Decap. Рубрики новостей (6: События, Достижения, Объявления, Приём, Спорт, Безопасность) и иконки (9) перенесены 1:1 с дизайна. НЕ делает: не содержит вёрстки.

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
