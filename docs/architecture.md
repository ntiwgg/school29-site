# Архитектура Сайт школы № 29

> Как устроен проект. Правило для всех ИИ и участников: **соблюдай Architecture.md**. Зависимости направлены вниз: слой может использовать только слои ниже себя.

> **Статус:** актуально на 31.08.2026 — этап 4 завершён (Astro-проект создан); этап 5 завершён полностью: 5a (компоненты), 5b-1 (Decap CMS + коллекция news), 5b-2 (все контент-коллекции: announcements, sveden×14, teachers×13, documents, contacts; исправлен критический баг путей Decap — префикс site/ в config.yml). Все коллекции подключены к Decap; впереди CI (GitHub Actions + Pages) и этап 6 (перенос контента с Nubex).

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
- `src/components/NewsIcon.astro` — справочник 9 иконок рубрик; `src/lib/news.ts` — рубрики и даты новостей; `src/components/AnnouncementIcon.astro` — справочник иконок объявлений (alert, calendar, book, utensils); `src/components/SvedenCard.astro` — карточка подраздела «Сведений об ОО» (num, title, description, ссылка).
- `src/pages/index.astro` — главная страница берёт 4 последние новости из коллекции и рендерит блок объявлений из коллекции announcements.
- `public/assets/` — статические ассеты: `css/styles.css`, `js/main.js`, `img/emblem.svg`.
- `public/admin/` — точка входа Decap CMS: `index.html`, `config.yml`.
- `astro.config.mjs` — `compressHTML: false`: разметка сохраняется 1:1 с HTML-дизайном (в т.ч. пробелы между inline-элементами), чтобы не менять визуал.

Слои (целевая структура): `дизайн-система → компоненты → страницы → контент`

- **Дизайн-система** — визуальные токены и стили из OpenDesign (сейчас — `public/assets/css/styles.css`). НЕ делает: не содержит контента.
- **Компоненты** — переиспользуемые элементы интерфейса (шапка, меню, карточки, формы). Выделены первые компоненты (например, NewsIcon.astro); рефакторинг страниц в компоненты завершён в рамках 5a. НЕ делает: не содержит делового контента.
- **Страницы** — собирают страницу из компонентов и контента. НЕ делает: не хранит контент.
- **Контент (Markdown)** — фактические тексты и документы сайта: коллекции news (src/content/news/, 9 записей), announcements (src/content/announcements/, 4 записи; поле important, иконки через AnnouncementIcon), sveden (src/content/sveden/, 14 подразделов по приказу № 1493; поле num задаёт порядок, title/description совпадают 1:1 с карточками на /sveden/, тело — markdown-плейсхолдер), teachers (src/content/teachers/, 13 записей; поля по ПП РФ № 1802, order — порядок строк таблицы), documents (src/content/documents/, 4 записи; поля title/doc-type/date/file/description) и contacts (src/content/contacts.md, единый файл; плейсхолдеры дизайна, заменить реальными на этапе 6); схема — src/content.config.ts. Все коллекции подключены к Decap. Рубрики новостей (6: События, Достижения, Объявления, Приём, Спорт, Безопасность) и иконки (9) перенесены 1:1 с дизайна. НЕ делает: не содержит вёрстки.

### Decap CMS

- **Редактор** — веб-интерфейс для наполнения (public/admin/index.html, CDN decap-cms@^3.16.0). НЕ делает: не хранит данные сам — пишет в git.
- **Backend** — GitHub: вход через дефолтный GitHub OAuth, правки публикуются в ветку dev репозитория ntiwgg/school29-site.
- **Конфигурация** — public/admin/config.yml: коллекции (news, announcements, sveden, teachers, documents и contacts — file-коллекция) и их поля; все коллекции сайта подключены к Decap, новые добавляются здесь же. Важно: пути в config.yml резолвятся от корня git-репозитория (сайт живёт в подпапке site/), поэтому folder/media_folder обязаны иметь префикс site/ — комментарий-инвариант записан в config.yml; без него контент из админки создавался в корне репо и не попадал на сайт (исправлено 31.08.2026, коммит ebf6d25).

## Потоки работы

```
Наполнение: секретарь/учитель → Decap CMS (веб-интерфейс) → Markdown → git (ветка dev) → сборка Astro → статические страницы
```

## Правило зависимостей

- Слой может использовать только слои ниже себя; обратное использование запрещено.
- Контент не содержит вёрстки; страницы не содержат контента.
- Дизайн не правится руками в коде — изменения вносятся через OpenDesign.
