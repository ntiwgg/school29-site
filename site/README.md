# Сайт школы № 29 — Astro-проект

Официальный сайт МБОУ Петрозаводского ГО «СОШ № 29 им. Сепсяковой Т.Ф.» (г. Петрозаводск). Статический сайт на Astro; дизайн перенесён из макета OpenDesign, разметка страниц сохранена 1:1.

## Запуск

```sh
npm install
npm run dev       # локальный dev-сервер на localhost:4321
npm run build     # сборка в ./dist
npm run preview   # просмотр собранного сайта
```

## Структура

```text
src/
├── layouts/
│   └── Layout.astro      # общий каркас: head, шапка, <main>, футер, подключение шрифта
├── components/
│   ├── Header.astro      # шапка с меню (пропс active — подсветка раздела)
│   ├── Footer.astro      # футер
│   ├── GovLinks.astro    # полоса госссылок (пропс withIcons — иконки на главной)
│   ├── NewsCard.astro    # карточка новости
│   └── SvedenCard.astro  # карточка подраздела «Сведений об ОО»
└── pages/
    ├── index.astro
    ├── o-shkole.astro
    ├── sveden.astro
    ├── sveden-teachers.astro
    ├── news.astro
    ├── bezopasnost.astro
    └── contacts.astro
public/
├── assets/css/styles.css  # все стили сайта
├── assets/js/main.js      # скрипты (меню, «слабовидящие»)
└── assets/img/emblem.svg  # эмблема школы
```

## Шрифт

Шрифт **Golos Text** подключён локально через `@fontsource/golos-text` (self-host, веса 400–900) — импорты в `src/layouts/Layout.astro`. Google Fonts не используется; woff2-файлы попадают в `dist/_astro/` при сборке.
